import { ranks } from "../constants/cache.js"
import { UserStatistics, UserCompact } from "../constants/player.js"

export default async function(fastify, opts){
    fastify.get('/:mode/:type', async(req, reply) => {

        const ranking = []

        if(req.params.mode != "osu") return ready()

        for(let i = 0; i < ranks.length; i++){
            let stats = await new UserStatistics(ranks[i], req.params.mode).load()
            let user = await new UserCompact(ranks[i]).load()
            await user.loadModule("country", user.country_code)
            await user.loadModule("cover")

            stats.user = user

            ranking.push(stats)
        }

        return ready()

        function ready(){
            return {
                cursor: { page: 2 },
                ranking,
                total: ranking.length
            }
        }
    })
}