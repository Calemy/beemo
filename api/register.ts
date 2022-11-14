import bcrypt from "bcrypt"
import crypto from "crypto"
import fetch from "node-fetch"
import { User } from "../constants/player.js"
import { database } from "../helper/database.js"
import logger from "../helper/logger.js"
import { db } from "../config.js"
import { FastifyRequest, FastifyReply } from "fastify"

export default async function(req: FastifyRequest, reply: FastifyReply){
    const [ username, email, password ] = [req.body["user[username]"].value, req.body["user[user_email]"].value, req.body["user[password]"].value]

    logger.purpleBlue("Trying to register " + username).send()

    const username_safe = username.toLowerCase().replaceAll(" ", "_")
    const check = await database.db(db).collection("users").findOne({ $or : [{ username_safe: username_safe}, { email: email }] })

    if(check != null){
        let form_error = { user : {} }
        if(check.username_safe == username_safe) form_error.user.username = ["Username is already in use!"]
        if(check.email == email) form_error.user.user_email = ["E-Mail is already in use!"]
        return form_error
    }

    const hash = crypto.createHash('sha256').update(password).digest('base64');

    const hashed = await bcrypt.hash(hash, 10)

    let init = await database.db(db).collection("users").find({}).sort({id: -1}).toArray()

    const countryRequest = await fetch(`https://ip.zxq.co/${req.ips[req.ips.length - 1]}`)
    const { country } = await countryRequest.json()

    if(init.length < 1) init = [{ id: 2 }]

    await database.db(db).collection("users").insertOne({
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
        country: country
    })

    //TODO: Create Stats

    await database.db(db).collection("stats").insertOne({
        id: parseInt(init[0].id) + 1,
        grade_counts: {
            a: 0,
            s: 0,
            sh: 0,
            ss: 0,
            ssh: 0
        },
        hit_accuracy: 0,
        is_ranked: false,
        level : {
            current: 0,
            progress: 0
        },
        maximum_combo: 0,
        play_count: 0,
        play_time: 0,
        pp: 0,
        ranked_score: 0,
        replays_watched_by_others: 0,
        total_hits: 0,
        total_score: 0
    })

    const u = await database.db(db).collection("users").findOne({id: parseInt(init[0].id) + 1})

    let user = await new User(u.id).load()

    const load = [];

    for(let modul of ["blocks", "cover", "follow_user_mapping", "friends", "unread_pm_count", "user_preferences"]){
        load.push(user.loadModule(modul))
    }

    load.push(user.loadModule("country", u.country))
    load.push(user.loadModule("is_restricted", u.privileges))
    load.push(user.loadGroups())
    await Promise.all(load)

    logger.green(`Registered ${user.username} in ${user.country.name}`).send()

    return user
}