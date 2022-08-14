import { ranks } from "../constants/cache.js"

export async function calculateRank(id){
    return ranks.indexOf(id) + 1
}