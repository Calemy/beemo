import database from "../helper/database.js";
import { ranks } from "../constants/cache.js"

export async function updateRanks(){
    let users = await database.db("lazer").collection("stats").find({ ranked_score: { $gt: 0 } }).sort({ranked_score: -1}).toArray()

    ranks.length = 0

    for(var i = 0; i < users.length; i++){
        let user = await database.db("lazer").collection("users").findOne({ id: users[i].id })

        if(!(user.privileges & 1)) continue;

        ranks.push(users[i].id)

        if(users[i].is_ranked == true) continue;

        users[i].is_ranked = true
        database.db("lazer").collection("stats").findOneAndUpdate({ id: users[i].id }, { $set: users[i] })
    }

    return 1
}

export async function loadChannels(){
    const channels = await database.db("lazer").collection("channels").find({}).limit(1).toArray()

    if(channels.length > 0) return;

    await database.db("lazer").collection("channels").insertOne({
        id: 1,
        name: "#osu",
        description: "Talk here with everyone!",
        icon: null,
        type: "PUBLIC",
        moderated: false,
        messages: []
    })

    return 1
}