import { fastify as f } from "fastify"
import { FastifyRequest, FastifyReply } from "fastify"
import multipart from "@fastify/multipart"
import logger from "../helper/logger"
import multiplayer from "../api/multiplayer.js"
import oauth from "../api/oauth.js"
import register from "../api/register.js"
import spectator from "../api/spectator.js"
import v2 from "../api/v2.js"



const fastify = f({ logger: false, trustProxy: true })

export default async function(){
    fastify.register(multipart, { attachFieldsToBody: true })
    fastify.register(multiplayer, { prefix: '/multiplayer' })
    fastify.register(oauth, { prefix: '/oauth' })
    fastify.register(spectator, { prefix: '/spectator' })
    fastify.register(v2, { prefix: '/api/v2'  })


    fastify.get('/', async (req, reply) => {
        return "Version 1.1.0 - by Nanoo and HorizonCode <3\n"+
        "Consider contributing or donating to this project!\n"+
        "Repository: https://github.com/calemy/beemo"
    })

    fastify.post('/users', async (req, reply) => {
        return await register(req, reply)
    })

    await fastify.listen({ port: parseInt(process.env.PORT as string) })
    logger.purpleBlue(`Listening on https://${process.env.BASE_URL as string} (Port ${process.env.PORT as string})`).send()
}