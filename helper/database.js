const mysql = require('mysql-await')
const { host, user, password, database } = require('../config').database
const con = mysql.createConnection({
    host,
    user,
    password,
    database
})

module.exports = {
    connect: async function(){
        await con.connect()
    },
    request: async function(query){
        return await con.awaitQuery(query)
    },
    requestOne: async function(query){
        return (await con.awaitQuery(query))[0]
    },
    prepared : async function(){
        await con.awaitQuery(mysql.format(...arguments))
    }
}