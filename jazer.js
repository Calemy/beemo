const api = require('./api')
const logger = require('./helper/logger')

async function main(){
    logger.info("Started jazer v0.1.0")
    await api()
}

main()