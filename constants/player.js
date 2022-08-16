
import cosmetics from "./cosmetics.js"
import extras from "./playerExtra.js"
import { sessions } from "./cache.js"
import database from "../helper/database.js"
import logger from "../helper/logger.js"
import { calculateRank } from "../helper/server.js"
import { url, db } from "../config.js"

export class UserCompact {
    //!i hate peppy
    constructor(id){
        this.id = id
        this.profile_colour = null
        this.pm_friends_only = false
        this.is_active = true
        this.is_bot = false
        this.is_deleted = false
    }
    
    async getUser(t){
        const token = sessions.get(t)
        this.id = token.id
        await this.load()
    }

    async load(){
        const user = await database.db(db).collection("users").findOne({ id: this.id })
        this.username = user.username
        this.avatar_url = `https:\/\/${url.avatar}\/${this.id + 998}`
        this.country_code = user.country
        this.join_date = new Date(user.register_date * 1000).toISOString()
        this.last_visit = new Date(user.latest_activity * 1000).toISOString()
        this.default_group = "default"
        this.is_online = false
        this.is_supporter = false
        return this
    }

    async loadAccountHistory() {
        this.account_history = await new UserAccountHistory(this.id).load()
        return this
    }

    async loadBadges(){
        this.badges = await new UserBadge(this.id).load()
        return this
    }

    async loadGroups(){
        this.groups = await new UserGroup(this.id).load()
        return this
    }

    async loadMonthlyPlaycount(){
        this.monthly_playcounts = await new UserMonthlyPlaycount(this.id).load()
        return this
    }

    async loadStatistics(mode){
        this.statistics = await new UserStatistics(this.id, mode).load()
        return this
    }

    async loadModule(){
        const args = Array.from(arguments)
        const modul = args.shift()

        this[modul] = await extras[modul](...args)
        return this
    }
}

export class User extends UserCompact {
    constructor(id){
        super(id)
        this.cover_url = "https:\/\/osu.ppy.sh\/images\/headers\/profile-covers\/c5.jpg"
        this.discord = null
        this.has_supported = false
        this.interests = null
        this.kudosu = {
            total: 0,
            available: 0
        }
        this.location = null
        this.max_blocks = 50
        this.max_friends = 250
        this.occupation = null
        this.playmode = "osu"
        this.playstyle = null
        this.post_count = 0
        this.profile_order = [
            "me",
            "recent_activity",
            "top_ranks",
            "medals",
            "historical",
            "beatmaps",
            "kudosu"
        ]
        this.title = null
        this.title_url = null
        this.twitter = null
        this.website = null
        this.is_admin = false
        this.is_bng = false
        this.is_gmt = false
        this.is_limited_bn = false
        this.is_moderator = false
        this.is_nat = false
        this.is_silenced = false
    }
}

export class UserAccountHistory {
    constructor(id){
        this.id = id
        this.incidents = []
    }

    async load(){
        const incidents = await database.db(db).collection("incidents").find({ user: this.id }).project({ user: 0 }).sort({ timestamp: -1 }).toArray()
        if(incidents.length < 1) return this.incidents
        for(let i = 0; i < incidents.length; i++){
            let incident = incidents[i]

            incident.timestamp = new Date(incident.timestamp * 1000).toISOString()

            this.incidents.push(incident)
        }
        return this.incidents
    }
}

export class UserBadge {
    constructor(id){
        this.id = id
        this.badges = []
    }

    async load(){
        const badges = await database.db(db).collection("cosmetics").find({ id: this.id }).sort({ "badges.awarded_at": -1 }).toArray()
        if(badges.length < 1) return this.badges
        for(let i = 0; i < badges.length; i++){
            const userBadge = badges[i]
            const badge = await new cosmetics.Badge(userBadge.id).load()

            if(!badge){
                logger.red(`Badge ${userBadge.id} not found`).send().save(`./.data/logs/error.txt`)
            }

            this.badges.push({
                awarded_at: new Date(userBadge.awarded_at * 1000).toISOString(),
                description: badge.description,
                image_url: badge.image_url,
                url: badge.url,
            })
        }
        return this.badges
    }
}

export class UserGroup {
    constructor(id){
        this.id = id
        this.groups = []
    }

    async load(){
        const group = await database.db(db).collection("cosmetics").find({ id: this.id }).sort({ "groups.id" : 1 }).toArray()
        if(group.length < 1) return this.groups

        for(let i = 0; i < groups.length; i++){
            const userGroup = groups[i]
            const group = await new cosmetics.Group(userGroup.id).load()

            if(!group){
                logger.red(`Badge ${userGroup.id} not found`).send().save(`./.data/logs/error.txt`)
            }

            this.groups.push(group)
        }
        return this.groups
    }
}

export class UserMonthlyPlaycount {
    constructor(id){
        this.id = id
        this.monthly_playcounts = []
    }

    async load(){
        const playcount = await database.db(db).collection("playcount").find({ id: this.id }).sort({ start_date : 1 }).toArray()
        if(playcount.length < 1) return this.monthly_playcounts

        for(let i = 0; i < playcount.length; i++) {
            let month = playcount[i]

            month.start_date = new Date(month.start_date * 1000).toISOString().slice(0, 10)

            this.monthly_playcounts.push(month)
        }

        return this.monthly_playcounts
    }
}

export class UserStatistics {
    constructor(id, mode){
        this.id = id
        this.mode = mode
        this.statistics = {}
    }

    async load(){
        //! Maybe int to string converter needed
        let statistics = await database.db(db).collection("stats").findOne({ id: this.id })

        delete statistics._id

        if(statistics == null){
            logger.red("User has no stats").send()
            return {}
        }

        statistics.global_rank = await calculateRank(this.id)
        statistics.country_rank = await calculateRank(this.id)
        statistics.rank = {
            global: await calculateRank(this.id),
            country: await calculateRank(this.id)
        }
        statistics.user = new UserCompact(this.id)

        statistics.hit_accuracy = parseFloat((statistics.hit_accuracy * 100).toFixed(3))

        this.statistics = statistics

        return this.statistics
    }

}

export default {
    User,
    UserCompact,
    UserAccountHistory,
    UserBadge,
    UserGroup,
    UserMonthlyPlaycount,
    UserStatistics
}