const Logger = require('cutesy.js')
const logger = new Logger()

module.exports = {
    info: async function(message){
        logger.blue()
        logger.send(message)
    },
    warn: async function(message){
        logger.yellow()
        logger.send(message)
    }
}