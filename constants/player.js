const database = require('../helper/database')

class UserCompact {
    //!i hate peppy
    constructor(id){
        this.id = id
        this.username = ""
        this.profile_colour = null
        this.avatar_url = "https:\/\/osu.ppy.sh\/images\/layout\/avatar-guest.png"
        this.country_code = "XX"
        this.default_group = "default"
        this.pm_friends_only = false
        this.last_visit = new Date(0).toISOString()
        this.is_active = true
        this.is_bot = false
        this.is_deleted = false
        this.is_online = false
        this.is_supporter = false
        this.country = {
            code: "XX",
            name: "Unknown"
        }
    }
    
    async getUser(t){
        const token = await database.requestOne(`SELECT id FROM sessions WHERE access_token = ${t}`)
        this.id = token.id
        this.load()
    }

    async load(){
        await database.client.connect()
        const user = await database.client.db("lazer").collection("users").findOne({ id: this.id })
        await database.client.close()
        this.avatar_url = `https:\/\/a.lemres.de\/${this.id + 998}`
        this.country.code = user.country
        this.country.name = "Unknown"
        this.join_date = new Date(user.register_date * 1000).toISOString()
        this.last_visit = new Date(user.latest_activity * 1000).toISOString()
        this.username = user.username
    }

}

class User extends UserCompact {
    constructor(){
        this.cover_url = "https:\/\/osu.ppy.sh\/images\/headers\/profile-covers\/c5.jpg"
        this.discord = null
        this.has_supported = false
        this.interests = null
        this.join_date = new Date(0).toISOString()
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
        this.country = {
            code : "XX",
            name: "Unknown"
        },
        this.cover = {
            custom_url : null,
            url : "https:\/\/osu.ppy.sh\/images\/headers\/profile-covers\/c5.jpg",
            id: 5
        }
        this.is_admin = false
        this.is_bng = false
        this.is_gmt = false
        this.is_limited_bn = false
        this.is_moderator = false
        this.is_nat = false
        this.is_restricted = false
        this.is_silenced = false
        this.blocks = []
        this.follow_user_mapping = []
        this.friends = []
        this.groups = []
        this.unread_pm_count = 0
        this.user_preferences = {
            audio_autoplay : false,
            audio_muted : false,
            audio_volume : 0.45,
            beatmapset_card_size : "normal",
            beatmapset_download : "all",
            beatmapset_show_nsfw : true,
            beatmapset_title_show_original : false,
            comments_show_deleted : false,
            forum_posts_show_deleted : true,
            profile_cover_expanded : true,
            user_list_filter : "all",
            user_list_sort : "last_visit",
            user_list_view : "card"
        }
    }
}

module.exports = {
    User,
    UserCompact
}