import fetch from "node-fetch"
import { bancho } from "../config.js"

const cache = []

async function login(){
    let c = cache.shift()

    if(c){
        if(c.expires_in < Math.floor(Date.now() / 1000)) return await generate()

        if(c.reset < Math.floor(Date.now() / 1000)){
            c.reset = Math.floor(Date.now() / 1000) + 60
            c.count = 0
        } else {
            if(c.count >= 1000){
                return setTimeout(async () => await login(), c.reset - Math.floor(Date.now() / 1000) + 1)
            }
            c.count++
        }

        cache.push(c)
        return c.access_token
    }

    return await generate()

    async function generate(){
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        };

        const body = {
            "username": bancho.username,
            "password": bancho.password,
            "client_id": 5,
            "client_secret": "FGc9GAtyHzeQDshWP5Ah7dega8hJACAJpQtw6OXk",
            "grant_type": "password",
            "scope": "*"
        }

        const response = await fetch("https://osu.ppy.sh/oauth/token", {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        })

        let token = await response.json()

        token.count = 1
        token.reset = Math.floor(Date.now() / 1000) + 60
        token.expires_in = Math.floor(Date.now() / 1000) + token.expires_in

        cache.push(token)
        return token.access_token
    }
}

async function get(url) {
    const key = await login()
    try {
        const request = await fetch(url, {
            headers: {
                "authorization": "Bearer " + key,
                "scope": "*",
                "user-agent": "osu-lazer"
            },
        })

        if(request.url.includes(".osz")) return request

        return request.json()
    } catch(e){
        return await get(url)
    }
}

export default get