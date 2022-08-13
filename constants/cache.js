import NodeCache from "node-cache"

export const sessions = new NodeCache() //Access Tokens + Session
export const tokens = new NodeCache() //Refresh Token
export const ranks = new NodeCache() //TODO: Use this instead of redis