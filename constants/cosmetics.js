export class Badge {
    constructor(id){
        this.id = id
    }

    async load(){
        const badge = await database.db("mino").collection("badges").findOne({ id: this.id })
        if(badge == null) return false
        this.description = badge.description
        this.image_url = badge.image_url
        this.url = badge.url
        return this
    }
}

export class Group {
    constructor(id){
        this.id = id
    }

    async load(){
        const group = await database.db("mino").collection("groups").findOne({ id: this.id })
        if(group == null) return false
        this.colour = group.colour
        this.has_listing = group.has_listing
        this.has_playmodes = group.has_playmodes
        this.identifier = group.identifier
        this.is_probationary = group.is_probationary
        this.name = group.name
        this.short_name = group.short_name //* Tag
        this.playmodes = group.playmodes //* Array
        return this
    }
}


export default {
    Badge,
    Group
}