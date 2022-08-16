import { sessions } from "../constants/cache.js"
import { ChatChannel, ChatMessage } from "../constants/structures.js"
import database from "../helper/database.js"
import { db } from "../config.js"

export default async function(fastify, opts){
    fastify.get('/channels/:id/messages', async(req, reply) => {
        const session = sessions.get(req.headers.authorization.split(" ")[1])
        if(!session) return { error: "Unauthorized User" }
        const channel = await new ChatChannel(parseInt(req.params.id), session.id).load()
        
        return channel.recent_messages
    })

    fastify.post('/channels/:id/messages', async (req, reply) => {

        if(!req.body?.message?.value) return { error: "no message provided" }

        const session = sessions.get(req.headers.authorization.split(" ")[1])
        if(!session) return { error: "Unauthorized User" }

        let channel = await new ChatChannel(parseInt(req.params.id), session.id).load()
        if(!channel) return { error: "Channel not found"}

        let lastMessage = await database.db(db).collection("messages").find({}).sort({ id: -1 }).limit(1).toArray()

        if(lastMessage.length < 1) lastMessage = [{ id: 0 }]
        
        await database.db(db).collection("messages").insertOne({
            id: lastMessage[0].id + 1,
            channel_id: channel.channel_id,
            content: req.body.message.value,
            is_action: req.body.is_action.value == "true" ? true : false,
            sender_id: session.id,
            timestamp: Math.floor(Date.now() / 1000)
        })

        let Channel = await database.db(db).collection("channels").findOne({ id: parseInt(req.params.id) })

        if(Channel.messages.length >= 50){
            Channel.messages.shift()
        }

        Channel.messages.push(lastMessage[0].id + 1)

        await database.db(db).collection("channels").findOneAndUpdate({ id: parseInt(req.params.id) }, { $set: Channel })

        return await new ChatMessage(lastMessage[0].id + 1).load()
    })

    fastify.put('/channels/:id/mark-as-read/:readID', async(req, reply) => {
        const session = sessions.get(req.headers.authorization.split(" ")[1])
        if(!session) return { error: "Unauthorized User" }
        reply.code(204)
        return reply
    })

    fastify.get('/channels', async (req, res) => {
        const session = sessions.get(req.headers.authorization.split(" ")[1])
        if(!session) return { error: "Unauthorized User" }
        const channels = await database.db(db).collection("channels").find({}).toArray()

        const result = []

        for(var i = 0; i < channels.length; i++) {
            result.push(await new ChatChannel(channels[i].id, session.id).load())
        }

        return result
    })

    fastify.get('/updates', async(req, reply) => {
        const session = sessions.get(req.headers.authorization.split(" ")[1])
        if(!session) return { error: "Unauthorized User" }

        const messages = await database.db(db).collection("messages").find({ id: { $gt : parseInt(req.query.since) } }).sort({ id: -1 }).toArray()

        const result = []

        for(var i = 0; i < messages.length; i++){
            result.push(await new ChatMessage(messages[i].id).load())
        }

        return {
            messages: result,
            presence: [await new ChatChannel(1, session.id).load()]
        }
    })
}