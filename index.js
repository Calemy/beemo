import database from "./helper/database.js"
import logger from "./helper/logger.js"
import api from "./modules/api.js"

async function main(){
    await database.connect()
    logger.purpleBlue("Connected to database").send()
    logger.rainbow("Started Beemo v1.0.0").purpleBlue().send()
    api()
}

main()