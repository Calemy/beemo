const database = require("../helper/database")
const crypto = require('node:crypto')
const bcrypt = require('bcrypt')

module.exports = async function(req, reply){
    const [ username, email, password ] = [req.body["user[username]"].value, req.body["user[user_email]"].value, req.body["user[password]"].value]

    const username_safe = username.toLowerCase().replaceAll(" ", "_")
    await database.client.connect()
    const check = await database.client.db("lazer").collection("users").findOne({ $or : [{ username_safe: username_safe}, { email: email }] })
    await database.client.close()

    if(check != null){
        let form_error = { user : {} }
        if(check.username_safe == username_safe) form_error.user.username = ["Username is already in use!"]
        if(check.email == email) form_error.user.user_email = ["E-Mail is already in use!"]
        return form_error
    }

    const hash = crypto.createHash('sha256').update(password).digest('base64');

    const hashed = await bcrypt.hash(hash, 10)

    await database.client.connect()
    const init = await database.client.db("lazer").collection("users").find({}).sort({id: -1}).toArray()
    await database.client.close()

    await database.client.connect()
    await database.client.db("lazer").collection("users").insertOne({
        id: parseInt(init[0].id) + 1,
        username: username,
        username_safe: username_safe,
        email: email,
        password: hashed,
        privileges: 1,
        register_date: Math.floor(Date.now() / 1000),
        latest_activity: Math.floor(Date.now() / 1000),
        donator_end: 0,
        donator_time: 0,
        country: "XX"
    })

    await database.client.close()

    await database.client.connect()
    const user = await database.client.db("lazer").collection("users").findOne({id: parseInt(init[0].id) + 1})
    await database.client.close()

    return {
        "avatar_url": "https:\/\/osu.ppy.sh\/images\/layout\/avatar-guest.png",
        "country_code": "DE", //TODO: find out how to get country (ip locator?)
        "default_group": "default",
        "id": user.id,
        "is_active":true, //? Leaderboard
        "is_bot":false,
        "is_deleted":false,
        "is_online":true,
        "is_supporter":false,
        "last_visit": new Date().toISOString(),
        "pm_friends_only":false,
        "profile_colour":null,
        "username": username,
        "cover_url":"https:\/\/osu.ppy.sh\/images\/headers\/profile-covers\/c5.jpg",
        "discord":null,
        "has_supported":false,
        "interests":null,
        "join_date": new Date().toISOString(),
        "kudosu":{
            "total":0,
            "available":0
        },
        "location":null,
        "max_blocks":50,
        "max_friends":250,
        "occupation":null,
        "playmode":"osu",
        "playstyle":null,
        "post_count":0,
        "profile_order":[
            "me",
            "recent_activity",
            "top_ranks",
            "medals",
            "historical",
            "beatmaps",
            "kudosu"
        ],
        "title":null,
        "title_url":null,
        "twitter":null,
        "website":null,
        "country":{
            "code":"DE",
            "name":"Germany"
        },
        "cover":{
            "custom_url":null,
            "url":"https:\/\/osu.ppy.sh\/images\/headers\/profile-covers\/c5.jpg",
            "id":"5"
        },
        "is_admin":false,
        "is_bng":false,
        "is_full_bn":false,
        "is_gmt":false,
        "is_limited_bn":false,
        "is_moderator":false,
        "is_nat":false,
        "is_restricted":false,
        "is_silenced":false,
        "blocks":[
            
        ],
        "follow_user_mapping":[
            
        ],
        "friends":[
            
        ],
        "groups":[
            
        ],
        "unread_pm_count":0,
        "user_preferences":{
            "audio_autoplay":false,
            "audio_muted":false,
            "audio_volume":0.45,
            "beatmapset_card_size":"normal",
            "beatmapset_download":"all",
            "beatmapset_show_nsfw":true,
            "beatmapset_title_show_original":false,
            "comments_show_deleted":false,
            "forum_posts_show_deleted":true,
            "profile_cover_expanded":true,
            "user_list_filter":"all",
            "user_list_sort":"last_visit",
            "user_list_view":"card"
        }
    }
}