import NodeCache from "node-cache"

export const sessions = new NodeCache()
export const tokens = new NodeCache()
export const ranks = new NodeCache()