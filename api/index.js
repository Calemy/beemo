const fastify = require('fastify')({ logger: true })
const logger = require('../helper/logger')

module.exports = async function(){
    fastify.register(require('@fastify/multipart'), { attachFieldsToBody: true })
    fastify.register(require('./oauth'), { prefix: '/oauth' })
    fastify.register(require('./v2'), { prefix: '/api/v2'  })
    fastify.register(require('./multiplayer'), { prefix: '/multiplayer'})
    fastify.register(require('./spectator'), { prefix: '/spectator'})

    fastify.get('/', async (req, reply) => {
        return "If you see this, the frontend got deactivated to develop on Beemo - a lazer implementation for Horizon\n"+
        "No panic, you will see everything as usual again soon."
    })

    fastify.post('/users', async (req, reply) => {
        return await require('./register')(req, reply)
    })

    await fastify.listen({ port : 6969 })
    logger.info("Listening on https://lemres.de (Port 6969)")
}