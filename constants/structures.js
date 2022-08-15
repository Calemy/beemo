import database from "../helper/database.js"
import logger from "../helper/logger.js"
import { UserCompact } from "./player.js"

export class Score {
    constructor(id){
        this.id = id
    }

    async load(){
        const score = await database.db("lazer").collection("scores").findOne({ id: this.id })
        if(score == null) return 0
        let beatmap = await database.db("lazer").collection("beatmaps").findOne({ checksum: score.beatmap })
        if(beatmap == null){
            logger.red("Beatmap for score not found. This does not seem correct").send()
            beatmap.id = 0
        }

        let u = new UserCompact(score.userid)
        await u.load()
        await u.loadModule("cover")
        await u.loadModule("country", u.country_code)

        this.accuracy = score.accuracy,
        this.beatmap_id = beatmap.id,
        this.build_id = 6489,
        this.ended_at = new Date(score.ended_at * 1000).toISOString(),
        this.max_combo = score.max_combo,
        this.mods = score.mods,
        this.passed = Boolean(score.completed),
        this.rank = score.rank,
        this.ruleset_id = score.mode,
        this.started_at = new Date(score.start * 1000).toISOString(),
        this.statistics = score.statistics,
        this.total_score = score.total_score,
        this.user_id = score.userid,
        this.best_id = null,
        this.id = score.id,
        this.legacy_perfect = score.legacy_perfect,
        this.pp = 0,
        this.replay = false,
        this.type = 'solo_score',
        this.current_user_attributes = {
            pin : null
        },
        this.user = u

        return this
    }
}

export default {
    Score
}