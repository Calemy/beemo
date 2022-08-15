import api from "./modules/api.js"
import { updateRanks, loadChannels } from "./modules/cron.js"
import database from "./helper/database.js"
import logger from "./helper/logger.js"

async function main(){
    await database.connect()
    logger.purpleBlue("Connected to database").send()
    await updateRanks()
    logger.purpleBlue("Updated ranks").send()
    await loadChannels()
    logger.purpleBlue("Loaded channels").send()
    logger.rainbow("Started Beemo v1.0.5").purpleBlue().send()
    api()
}

main()
