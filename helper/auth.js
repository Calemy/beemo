const nodeCache = require('node-cache');
const cache = new nodeCache()
module.exports = {
    login : async function(){
        const fetch = require('node-fetch')
        const { username, password, id, secret } = require('../config').login
        
        let token = cache.get('token')

        if(token){
            cache.del('token')
            if(token.expires_in < Math.floor(Date.now() / 1000)){
                return await generate()
            }

            if(token.reset < Math.floor(Date.now() / 1000)) token.reset = Math.floor(Date.now() / 1000) + 60

            if(token.reset > Math.floor(Date.now() / 1000)){
                if(token.count >= 1000) return 0
                token.count++
            }

            cache.set('token', token)

            return token.access_token
        }

        return await generate()

        async function generate(){
            const headers = {
                "Accept": "application/json",
                "Content-Type": "application/json",
            };
    
            const body = {
                "username": username,
                "password": password,
                "client_id": id,
                "client_secret": secret,
                "grant_type": "password",
                "scope": "*"
            }
    
            const response = await fetch("https://osu.ppy.sh/oauth/token", {
                method: "POST",
                headers,
                body: JSON.stringify(body),
            })
    
            token = await response.json()
    
            token.count = 1
            token.reset = Math.floor(Date.now() / 1000) + 60
            token.expires_in = Math.floor(Date.now() / 1000) + token.expires_in
    
            cache.set('token', token)

            return token.access_token
        }
    }
}