import bcrypt from "bcrypt";
import crypto from "node:crypto"
import { sessions, tokens } from "../constants/cache.js"
import database from "../helper/database.js"
import logger from "../helper/logger.js"
import { db } from "../config.js"

export default async function(fastify, opts){
    fastify.post('/token', async (req, reply) => {
        const username = req.body?.username?.value?.toLowerCase().replaceAll(" ", "_");
        const password = req.body?.password?.value
        const refresh_token = req.body?.refresh_token?.value

        if(refresh_token){
            let session = tokens.get(refresh_token)
            session.expires_in = (Math.floor(Date.now() / 1000) + 86400)
            session.access_token = await generateToken(sessions)
            sessions.set(session.access_token, session, 86400)
            return session
        }

        let user = await database.db(db).collection("users").findOne({ username_safe: username })

        if(user == null){
            logger.red("User not found: " + username).send()
            return error("This Username does not exist")
        } 

        logger.purpleBlue(`Trying to login ${user.username}`).send()

        const hash = crypto.createHash('sha256').update(password).digest('base64');
        const check = await bcrypt.compare(hash, user.password)

        if(!check){
            logger.red("Incorrect password for " + user.username).send()
            return error("Invalid Password")
        } 
        if(!(user.privileges & 1)){
            logger.red(`${user.username} is restricted`)
            return error("You are restricted")
        } 

        async function error(err){
            return reply.status(400).send({
                "error": "invalid_grant",
                "error_description": "The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.", 
                "hint": err,
                "message":"The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client."
            })
        }

        async function generateToken(type){
            let token = Math.random().toString(36).slice(2, 18)
            if(type.get(token)) return await generateToken(type)
            return token
        }

        const session = {
            "token_type": "Bearer",
            "expires_in": Math.floor(Date.now() / 1000) + 86400,
            "access_token": await generateToken(sessions),
            "refresh_token": await generateToken(tokens),
            "id": user.id,
            "username": user.username
        }

        sessions.set(session.access_token, session, 86400)
        tokens.set(session.refresh_token, session)
        
        logger.green(`Successfully logged in ${user.username}`).send()

        return reply.code(200).send({
            "token_type": session.token_type,
            "expires_in": parseInt(session.expires_in - Math.floor(Date.now() / 1000)),
            "access_token": session.access_token,
            "refresh_token": session.refresh_token
        }) 
    })
}