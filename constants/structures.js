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

export class ChatChannel {
    constructor(id, user){
        this.channel_id = id
        this.user = user
    }

    async load(){

        const channel = await database.db("lazer").collection("channels").findOne({ id: this.channel_id })
        const user = await database.db("lazer").collection("userStatus").findOne({ id: this.user })

        if(channel == null){
            logger.red(`Channel ${this.channel_id} not found`).send()
            return 0
        }
        
        this.current_user_attributes = {
            can_message: true,
            can_message_error: null,
            last_read_id: 0
        }

        this.name = channel.name
        this.description = channel.description
        this.icon = channel.icon
        this.type = "PUBLIC"
        this.last_message_id = channel.messages[channel.messages.length - 1]
        this.recent_messages = []
        this.uuid = null

        for(var i = 0; i < channel.messages.length; i++) {
            this.recent_messages.push(await new ChatMessage(channel.messages[i]).load())
        }

        this.moderated = channel.moderated
        this.users = []

        return this
    }
}

export class ChatMessage {
    constructor(id){
        this.message_id = id
    }

    async load(){
        const message = await database.db("lazer").collection("messages").findOne({ id: this.message_id })
        
        if(message == null){
            logger.red("Message not found").send()
            return 0
        }

        this.sender_id = message.sender_id
        this.channel_id = message.channel_id
        this.timestamp = new Date(message.timestamp * 1000).toISOString()
        this.content = message.content
        this.is_action = message.is_action
        this.sender = await new UserCompact(parseInt(message.sender_id)).load()

        return this
    }
}

export default {
    Score,
    ChatChannel,
    ChatMessage
}