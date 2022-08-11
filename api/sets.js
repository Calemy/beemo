const auth = require('../helper/auth')
const fetch = require('node-fetch')

module.exports = async function(fastify, opts){
    fastify.get('/:id', async (req, reply) => {
        const key = await auth.login()

        const request = await fetch(`https://osu.ppy.sh${req.url}`, {
            headers: {
                "Authorization": `Bearer ${key}`
            },
        })

        return request.json()

    })

    fastify.get(`/:id/download`, async (req, reply) => {
        reply.redirect(302, `https://catboy.best/d/${req.params.id}`)
    })
}