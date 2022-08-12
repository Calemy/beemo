import database from "./helper/database.js"
import logger from "./helper/logger.js"
import api from "./modules/api.js"

async function main(){
    await database.connect()
    logger.green("Connected to database").send()
    logger.rainbow("Started jazer v0.2.0").send()
    api()
}

main()