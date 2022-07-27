const mysql = require('mysql-await')
const { MongoClient } = require('mongodb')
const { host, user, password, database } = require('../config').database
const con = mysql.createConnection({
    host,
    user,
    password,
    database
})

const client = new MongoClient("mongodb://127.0.0.1:27017")

module.exports = {
    client,
    connect: async function(){
        await con.connect()
        await client.connect()

        await client.db("lazer").collection("")

        await client.close()
    },
    request: async function(query){
        return await con.awaitQuery(query)
    },
    requestOne: async function(query){
        return (await con.awaitQuery(query))[0]
    },
    prepared : async function(){
        await con.awaitQuery(mysql.format(...arguments))
    },

    mongoRequest : async function(collection, action, query){
        await client.connect()
        const result = await client.db("lazer").collection(collection)[action](query)
        await client.close()

        return result
    }
}