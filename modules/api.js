import { fastify as f } from "fastify"
import multipart from "@fastify/multipart"
import { url, port } from "../config.js"
import logger from "../helper/logger.js"
import oauth from "../api/oauth.js"
import v2 from "../api/v2.js"
import multiplayer from "../api/multiplayer.js"
import spectator from "../api/spectator.js"
import register from "../api/register.js"


const fastify = f({ logger: false, trustProxy: true })

export default async function(){
    fastify.register(multipart, { attachFieldsToBody: true })
    fastify.register(oauth, { prefix: '/oauth' })
    fastify.register(v2, { prefix: '/api/v2'  })
    fastify.register(multiplayer, { prefix: '/multiplayer'})
    fastify.register(spectator, { prefix: '/spectator'})

    fastify.get('/', async (req, reply) => {
        return "Version 1.0.0 - by Nanoo <3\n"+
        "Consider contributing or donating to this project!\n"+
        "Repository: https://github.com/calemy/beemo"
    })

    fastify.post('/users', async (req, reply) => {
        return await register(req, reply)
    })

    await fastify.listen({ port })
    logger.purpleBlue(`Listening on https://${url.base} (Port ${port})`).send()
}