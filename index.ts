import api from "./modules/api.js"
import { updateRanks, loadChannels } from "./modules/cron.js"
import { connect as connectDatabase } from "./helper/database"
import logger from "./helper/logger.js"
import dotenv from 'dotenv'
dotenv.config();

async function main(){
    await connectDatabase();
    logger.purpleBlue().send("Connected to database");
    // await updateRanks();
    logger.send("Updated ranks");
    // await loadChannels();
    logger.send("Loaded channels");
    logger.rainbow("Started Beemo v1.0.5").purpleBlue().send();
    api()
}

main()