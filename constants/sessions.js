const nodeCache = require('node-cache');

const sessions = new nodeCache()
const tokens = new nodeCache()
const ranks = new nodeCache()

module.exports = {
        access: sessions,
        refresh: tokens,
        ranks: ranks
}