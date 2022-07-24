const database = require('../helper/database')
const database = require('../helper/database')

module.exports = class {
    constructor(token){
        this.token = token
    }
    
    getUser(){
        const token = database.requestOne(`SELECT id FROM sessions WHERE access_token = ${this.token}`)
        //dude idk

        const user = database.requestOne(`SELECT * FROM users WHERE id = ${token.id}`)
    }

    getStats(){

    }
}