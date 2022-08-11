const database = require("../helper/database");
const sessions = require('../constants/sessions')
const crypto = require('node:crypto')
const bcrypt = require('bcrypt')

module.exports = async function(fastify, opts){
    fastify.post('/token', async (req, reply) => {
        const username = req.body?.username?.value?.toLowerCase().replaceAll(" ", "_");
        const password = req.body?.password?.value
        const refresh_token = req.body?.refresh_token?.value

        if(refresh_token){
            let session = sessions.refresh.get(refresh_token)
            session.expires_in = (Math.floor(Date.now() / 1000) + 86400)
            session.access_token = await generateToken("access")
            sessions.access.set(session.access_token, session, 86400)
            return session
        }

        await database.client.connect()
        const user = await database.client.db("lazer").collection("users").findOne({ username_safe: username })
        await database.client.close()

        if(!user) return error("This Username does not exist")

        const hash = crypto.createHash('sha256').update(password).digest('base64');
        const check = await bcrypt.compare(hash, user.password)

        if(!check) return error("Invalid Password")
        if(!(user.privileges & 1)) return error("You are restricted")

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
            if(sessions[type].get(token)) return await generateToken(type)
            return token
        }

        const session = {
            "token_type": "Bearer",
            "expires_in": Math.floor(Date.now() / 1000) + 86400,
            "access_token": await generateToken("access"),
            "refresh_token": await generateToken("refresh"),
            "id": user.id,
            "username": user.username
        }

        sessions.access.set(session.access_token, session, 86400)
        sessions.refresh.set(session.refresh_token, session)

        return reply.code(200).send({
            "token_type": session.token_type,
            "expires_in": parseInt(session.expires_in - Math.floor(Date.now() / 1000)),
            "access_token": session.access_token,
            "refresh_token": session.refresh_token
        }) 
    })
}