import get from '../helper/osu.js'
import logger from "../helper/logger.js"

export default async function(fastify, opts){
    fastify.get('/:id', async (req, reply) => {
        return await get(`https://osu.ppy.sh${req.url}`)
    })

    fastify.get(`/:id/download`, async (req, reply) => {
        logger.purpleBlue(`Downloading ${id} from Mino`)
        reply.redirect(302, `https://catboy.best/d/${req.params.id}`)
    })
}