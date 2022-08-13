import bcrypt from "bcrypt"
import crypto from "node:crypto"
import { User } from "../constants/player.js"
import database from "../helper/database.js"

export default async function(req, reply){
    const [ username, email, password ] = [req.body["user[username]"].value, req.body["user[user_email]"].value, req.body["user[password]"].value]

    const username_safe = username.toLowerCase().replaceAll(" ", "_")
    const check = await database.db("lazer").collection("users").findOne({ $or : [{ username_safe: username_safe}, { email: email }] })

    if(check != null){
        let form_error = { user : {} }
        if(check.username_safe == username_safe) form_error.user.username = ["Username is already in use!"]
        if(check.email == email) form_error.user.user_email = ["E-Mail is already in use!"]
        return form_error
    }

    const hash = crypto.createHash('sha256').update(password).digest('base64');

    const hashed = await bcrypt.hash(hash, 10)

    let init = await database.db("lazer").collection("users").find({}).sort({id: -1}).toArray()

    if(init.length < 1) init = [{ id: 2 }]

    await database.db("lazer").collection("users").insertOne({
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
        country: "BR" //TODO: Determine User Location
    })

    //TODO: Create Stats

    const u = await database.db("lazer").collection("users").findOne({id: parseInt(init[0].id) + 1})

    let user = await new User(u.id).load()

    const load = [];

    for(modul of ["blocks", "cover", "follow_user_mapping", "friends", "unread_pm_count", "user_preferences"]){
        load.push(user.loadModule(modul))
    }

    load.push(user.loadModule("country", u.country))
    load.push(user.loadModule("is_restricted", u.privileges))
    load.push(user.loadGroups())
    await Promise.all(load)

    user.country_code = u.country

    return user
}