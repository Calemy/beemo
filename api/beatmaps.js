import fetch from "node-fetch"
import { Score } from "../constants/structures.js"
import { sessions } from "../constants/cache.js"
import database from "../helper/database.js"
import get from "../helper/osu.js"
import logger from "../helper/logger.js"
import { url, db } from "../config.js"
import { updateRanks } from "../modules/cron.js"

export default async function(fastify, opts){
    fastify.get('/lookup', async (req, reply) => { //* Beatmap Information
        logger.purpleBlue("Loading Beatmap information for " + req.query.id).send()
        const search = await database.db(db).collection("beatmaps").findOne({ id: parseInt(req.query.id) })

        if(search != null) return search

        logger.yellow("Beatmap not found, searching on Bancho").send()

        const response = await get(`https://osu.ppy.sh${req.url}`)
        const set = await get(`https://osu.ppy.sh/api/v2/beatmapsets/${response.beatmapset_id}`)

        logger.green(`Adding Beatmaps from ${set.title}`).send()

        await database.db(db).collection("beatmaps").insertMany(set.beatmaps)

        return response
    })

    fastify.get('/:id/solo-scores', async (req, reply) => { //* Leaderboards

        await fetch(`https://${url.base}/api/v2/beatmaps/lookup?id=${req.params.id}`)

        const beatmap = await database.db(db).collection("beatmaps").findOne({ id: parseInt(req.params.id) })
        const scores = await database.db(db).collection("scores").find({ beatmap: beatmap.checksum, completed: 3 }).sort({total_score : -1}).toArray()
        
        const result = []

        for(var i = 0; i < scores.length; i++){
            result.push(await new Score(scores[i].id).load())
        }

        return {
            scores : result
        }
    })

    fastify.get('/:id/scores', async (req, reply) => {
        return {
            scores : []
        }
    })

    fastify.post('/:id/solo/scores', async (req, reply) => { //* Pre-Game Submission
        const version = req.body.version_hash.value //Apperently the OS + version
        const beatmap = req.body.beatmap_hash.value //beatmap_md5
        const mode = req.body.ruleset_id.value

        if(mode != 0) return reply.code(500).send({
            statusCode: 500,
            error: "This Mode is not supported",
            message: "This Mode is not supported"
        })

        const session = sessions.get(req.headers.authorization.split(" ")[1])

        logger.purpleBlue(`${session.username} (${session.id}) started a score`).send()

        const time = Math.floor(Date.now() / 1000)
        const date = new Date(time * 1000).toISOString()

        let [ latest, map ] = await Promise.all([
            database.db(db).collection("scores").findOne({}, {sort: { id: -1 }}),
            database.db(db).collection("beatmaps").findOne({ checksum: beatmap })
        ])

        if(!latest || latest == null) latest = { id: 0 }

        database.db(db).collection("scores").insertOne({
            id: latest.id + 1,
            userid: session.id,
            beatmap: beatmap,
            start: time,
            mode: mode,
            version: version,
            completed: 0
        })

        return {
            beatmap_id: map.id,
            created_at: date,
            id: latest.id + 1, //Score ID
            user_id: session.id
        }
    })

    fastify.put('/:bid/solo/scores/:id', async (req, reply) => { //* Post-game Submission
        const time = Math.floor(Date.now() / 1000)

        const initial = await database.db(db).collection("scores").findOne({id: parseInt(req.params.id) })

        if(initial == null) return { error: "Couldn't find score" }

        const session = sessions.get(req.headers.authorization.split(" ")[1])

        if(session.id != initial.userid) return { error: "Invalid Authentication" }

        let score = req.body

        let scores = await database.db(db).collection("scores").find({ userid: initial.userid, completed: 3}).sort({total_score: -1}).limit(100).toArray()
        let beatmap = await database.db(db).collection("beatmaps").findOne({checksum: initial.beatmap})
        let stats = await database.db(db).collection("stats").findOne({id: initial.userid })
        if(stats == null) return
        if(beatmap == null) return

        score.completed = await calculateCompletion()

        async function calculateCompletion(){
            let c = 0
            if(!score.passed) return c
            c++

            let best = await database.db(db).collection("scores").find({ userid: initial.userid, beatmap: initial.beatmap, completed: { $gt: 1 } }).sort({total_score: -1}).toArray()
            c++ //Map ranked, c++

            if(best.length > 0){
                if(score.total_score > best[0].total_score){
                    c++
                    best[0].completed = 2
                    await database.db(db).collection("scores").findOneAndUpdate({ id: best[0].id} , { $set: best[0] })
                    stats.ranked_score -= best[0].total_score
                    stats.ranked_score += score.total_score
                }
            } else {
                c++ //best score, c++   
                stats.ranked_score += score.total_score
            }

            return c
        }

        async function calculatePP(){ //TODO
            const mods = score.mods

            const acc = parseFloat((score.accuracy * 100).toFixed(2))

            const modsInt = 0

            const ppRequest = await fetch(`https://catboy.best/api/meta/${beatmap.id}?mods=${modsInt}&max_combo=${score.max_combo}&acc=${acc}`)
            const ppData = await ppRequest.json()

            return ppData.pp[acc].pp
        }

        async function calculateAcc(){
            let total = 0;

            if(scores.length == 0) return score.accuracy

            for(var i = 0; i < scores.length; i++){
                total += scores[i].accuracy
            }

            return total / scores.length
        }
        
        
        score.pp = 0
        score.time = time
        score.type = "solo_score"
        score.statistics.perfect = +score.statistics.perfect
        if(isNaN(score.statistics.perfect)) score.statistics.perfect = 1
        score.legacy_fc = null
        //Calculate rosu-pp || for now using mino LUL

        await database.db(db).collection("scores").findOneAndUpdate({id: parseInt(req.params.id) }, { $set : {
            accuracy: score.accuracy,
            build_id: 6519,
            ended_at: time,
            legacy_perfect: score.legacy_fc,
            max_combo: score.max_combo,
            mods: score.mods,
            passed: score.passed,
            pp: score.pp,
            rank: score.rank,
            replay: false,
            statistics: score.statistics,
            total_score: score.total_score,
            completed: score.completed,
            type: score.type,
        }
        })

        const playtime = time - initial.start

        if(score.max_combo > stats.maximum_combo) stats.maximum_combo = score.max_combo

        stats.pp += score.pp
        stats.play_count += 1
        stats.play_time += playtime
        stats.total_score += score.total_score
        for(let rank of ["a", "s", "sh", "sh", "ssh"]){
            if(score.rank.toLowerCase() == rank){
                stats.grade_counts[rank] += 1
            }
        }

        stats.hit_accuracy = await calculateAcc()


        await database.db(db).collection("stats").findOneAndUpdate({id: initial.userid }, { $set : stats })

        //Kagerou daze

        logger.green(`Submitting score for ${session.username} (${session.id}) - `)

        updateRanks()

        switch(score.completed){
            case 0:
                logger.red("Quit")
                break;
            case 1:
                logger.yellow("Completed")
                break;
            case 2:
                logger.yellow("Completed but not Ranked")
                break;
            case 3:
                logger.green("Ranked")
                break;
        }

        logger.green().send()

        return await new Score(parseInt(req.params.id)).load()
    })
}