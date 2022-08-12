const sessions = require('../constants/sessions')
const database = require('../helper/database')
const fetch = require('node-fetch')
const auth = require('../helper/auth')
const { url } = require('../config')
const { UserCompact } = require('../constants/player')
const Logger = require('cutesy.js')
module.exports = async function(fastify, opts){

    fastify.get('/lookup', async (req, reply) => { //* Beatmap Information
        const key = await auth.login()

        const search = await database.mongoRequest("beatmaps", "findOne", { id: parseInt(req.query.id) })

        if(search != null) return search

        const request = await fetch(`https://osu.ppy.sh${req.url}`, {
            headers: {
                "Authorization": `Bearer ${key}`
            },
        })
        
        let response = await request.json()

        const setRequest = await fetch(`https://osu.ppy.sh/api/v2/beatmapsets/${response.beatmapset_id}`, {
            headers: {
                "Authorization": `Bearer ${key}`
            }
        })
        const set = await setRequest.json()

        for(var i = 0; i < set.beatmaps.length; i++) {
            await database.mongoRequest("beatmaps", "insertOne", set.beatmaps[i])
        }

        return response

    })

    fastify.get('/:id/solo-scores', async (req, reply) => { //* Leaderboards

        await fetch(`https://${url}/api/v2/beatmaps/lookup?id=${req.params.id}`)

        await database.client.connect()
        const beatmap = await database.client.db("lazer").collection("beatmaps").findOne({ id: parseInt(req.params.id) })
        await database.client.close()

        await database.client.connect()
        const scores = await database.client.db("lazer").collection("scores").find({ beatmap: beatmap.checksum, completed: 3 }).sort({total_score : -1}).toArray()
        await database.client.close()
        
        const result = []

        for(var i = 0; i < scores.length; i++){
            score = scores[i];

            let u = new UserCompact(score.userid)
            
            await u.load()

            u.country = {
                code: "BR",
                name: "Brazil"
            }

            u.cover = {
                custom_url: 'https://assets.ppy.sh/user-profile-covers/8945180/edc51066bbded8278b2755e67ed695b7658e0c4d74994a25e43c985918f44906.png',
                url: 'https://assets.ppy.sh/user-profile-covers/8945180/edc51066bbded8278b2755e67ed695b7658e0c4d74994a25e43c985918f44906.png',
                id: null
            }

            result.push({
                accuracy: score.accuracy,
                beatmap_id: req.params.id,
                build_id: 6489,
                ended_at: new Date(score.ended_at * 1000).toISOString(),
                max_combo: score.max_combo,
                mods: score.mods,
                passed: Boolean(score.completed),
                rank: score.rank,
                ruleset_id: score.mode,
                started_at: new Date(score.start * 1000).toISOString(),
                statistics : score.statistics,
                total_score: score.total_score,
                user_id: score.userid,
                best_id: null,
                id: score.id,
                legacy_perfect: score.legacy_perfect,
                pp: 0,
                replay: false,
                type: 'solo_score',
                current_user_attributes : {
                    pin : null
                },
                user : u
            })
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

        const session = sessions.access.get(req.headers.authorization.split(" ")[1])

        const time = Math.floor(Date.now() / 1000)
        const date = new Date(time).toISOString()

        await database.client.connect()
        let latest = await database.client.db("lazer").collection("scores").findOne({}, {sort: { id: -1 }})
        await database.client.close()



        await database.client.connect()
        let map = await database.client.db("lazer").collection("beatmaps").findOne({checksum: beatmap})
        await database.client.close()

        if(!latest || latest == null) latest = { id: 0 }

        database.mongoRequest("scores", "insertOne", {
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
        const session = sessions.access.get(req.headers.authorization.split(" ")[1])
        const time = Math.floor(Date.now() / 1000)
        const date = new Date(time).toISOString()

        await database.client.connect()
        const initial = await database.client.db("lazer").collection("scores").findOne({id: parseInt(req.params.id) })
        await database.client.close()

        if(initial == null) return { error: "Couldn't find score" }

        let score = req.body

        score.completed = await calculateCompletion()

        async function calculateCompletion(){
            let c = 0
            if(!score.passed) return c
            c++
            await database.client.connect()
            const best = await database.client.db("lazer").collection("scores").find({ userid: initial.userid, beatmap: initial.beatmap }).sort({total_score: -1}).toArray()
            await database.client.close()

            c++ //Map ranked, c++

            if(best != null){
                if(score.total_score < best[0].total_score) return c
            }

            best[0].completed = 2

            await database.client.connect()
            await database.client.db("lazer").collection("scores").findOneAndUpdate({ id: best[0].id} , { $set: best[0] })
            await database.client.close()

            c++ //best score, c++

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
        
        
        score.pp = 0
        score.time = time
        score.type = "solo_score"
        score.statistics.perfect = +score.statistics.perfect
        if(isNaN(score.statistics.perfect)) score.statistics.perfect = 1
        score.legacy_fc = null
        //Calculate rosu-pp || for now using mino LUL

        

        await database.client.connect()
        await database.client.db("lazer").collection("scores").findOneAndUpdate({id: parseInt(req.params.id) }, { $set : {
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
        await database.client.close()

        //Kagerou daze

        return {
            accuracy: score.accuracy,
            beatmap_id: req.params.bid,
            best_id: null,
            build_id: 6519, //Try to find out how this works
            current_user_attributes : {
                pin : {
                    is_pinned: false,
                    score_id: req.params.id,
                    score_type: "solo_score"
                }
            },
            ended_at: date, //????
            id: req.params.id,
            legacy_perfect: null, //? why legacy
            max_combo: score.max_combo,
            mods: score.mods,
            passed: score.passed,
            pp: score.pp,
            rank: score.rank,
            replay: false, //TODO: Replay system
            ruleset_id: score.ruleset_id,
            started_at: new Date(initial.start).toISOString(), //????
            statistics: score.statistics,
            total_score: score.total_score,
            type: "solo_score",
            user_id: session.id
        }
    } )
}