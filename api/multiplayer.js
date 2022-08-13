export default async function(fastify, opts){
    fastify.post('/negotiate', async (req, reply) => {
        reply.send([])
    })
}