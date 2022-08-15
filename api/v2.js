import database from "../helper/database.js"
import { User } from "../constants/player.js"
import { sessions, tokens } from "../constants/cache.js"
import beatmaps from "./beatmaps.js"
import rankings from "./rankings.js"
import sets from "./sets.js"

export default async function(fastify, opts){

    fastify.register(beatmaps, { prefix: '/beatmaps'})
    fastify.register(sets, { prefix: '/beatmapsets'})
    fastify.register(rankings, { prefix: '/rankings'})

    fastify.get('/comments', async (req, reply) => {
      return {
        comments: []
      }
    })

    fastify.get("/me/", async (req, reply) => {

      const session = sessions.get(req.headers.authorization.split(" ")[1])
      if(!session) return {}

      let user = await new User(session.id).load()
      await user.loadAccountHistory()
      await user.loadBadges()
      await user.loadModule("beatmap_playcounts_count")
      await user.loadModule("country", user.country_code)
      await user.loadModule("cover")
      await user.loadModule("favourite_beatmapset_count")
      await user.loadModule("follower_count")
      await user.loadModule("graveyard_beatmapset_count")
      await user.loadGroups()
      await user.loadModule("loved_beatmapset_count")
      await user.loadMonthlyPlaycount()
      await user.loadModule("page")
      await user.loadModule("pending_beatmapset_count")
      await user.loadModule("previous_usernames")
      await user.loadModule("rank_history", "osu")
      await user.loadModule("ranked_beatmapset_count")
      await user.loadModule("replays_watched_counts")
      await user.loadModule("scores_best_count")
      await user.loadModule("scores_first_count")
      await user.loadModule("scores_recent_count")
      await user.loadStatistics()
      await user.loadModule("support_level")
      await user.loadModule("user_achievements")

      user.active_tournament_banner = null
      user.comments_count = 0
      user.guest_beatmapset_count = 0
      user.loved_beatmapset_count = 0
      user.mapping_follower_count = 0
      user.rank_history = {
        mode: 'osu',
        data: []
      }
      user.ranked_and_approved_beatmapset_count = 0
      user.unranked_beatmapset_count = 0
      user.scores_pinned_count = 0

      return reply.send({
        avatar_url: user.avatar_url,
        country_code: user.country_code,
        default_group: user.default_group,
        id: user.id,
        is_active: user.is_active,
        is_bot: user.is_bot,
        is_deleted: user.is_deleted,
        is_online: user.is_online,
        is_supporter: user.is_supporter,
        last_visit: user.last_visit,
        pm_friends_only: user.pm_friends_only,
        profile_colour: user.profile_colour,
        username: user.username,
        cover_url: user.cover_url,
        discord: user.discord,
        has_supported: user.has_supported,
        interests: user.interests,
        join_date: user.join_date,
        kudosu: user.kudosu,
        location: user.location,
        max_blocks: user.max_blocks,
        max_friends: user.max_friends,
        occupation: user.occupation,
        playmode: user.playmode,
        playstyle: user.playstyle,
        post_count: user.post_count,
        profile_order: user.profile_order,
        title: user.title,
        title_url: user.title_url,
        twitter: user.twitter,
        website: user.website,
        country: user.country,
        cover: user.cover,
        account_history: user.account_history,
        active_tournament_banner: null,
        badges: user.badges,
        beatmap_playcounts_count: user.beatmap_playcounts_count,
        comments_count: 0,
        favourite_beatmapset_count: user.favourite_beatmapset_count,
        follower_count: user.follower_count,
        graveyard_beatmapset_count: user.graveyard_beatmapset_count,
        groups: user.groups,
        guest_beatmapset_count: 0,
        loved_beatmapset_count: user.loved_beatmapset_count,
        mapping_follower_count: user.follow_user_mapping,
        monthly_playcounts: user.monthly_playcounts,
        page: user.page,
        pending_beatmapset_count: user.pending_beatmapset_count,
        previous_usernames: user.previous_usernames,
        ranked_beatmapset_count: user.ranked_beatmapset_count,
        replays_watched_counts: user.replays_watched_counts,
        scores_best_count: user.scores_best_count,
        scores_first_count: user.scores_first_count,
        scores_pinned_count: 0,
        scores_recent_count: user.scores_recent_count,
        statistics: user.statistics,
        support_level: user.support_level,
        user_achievements: user.user_achievements,
        rankHistory: user.rank_history,
        rank_history: user.rank_history,
        ranked_and_approved_beatmapset_count: 0,
        unranked_beatmapset_count: 0
      })
    })
    
    fastify.get('/users/:id/:mode', async (req, reply) => {
      let { id, mode } = req.params

      let { key } = req.query
    
      if(!key) key = "id"

      if(key != "id"){
        const u = await database.db("lazer").collection("users").findOne({username_safe: id.toLowerCase().replaceAll(" ", "_")})
        id = u.id
      }
    
      let user = await new User(id).load()
      await user.loadAccountHistory()
      await user.loadBadges()
      await user.loadModule("beatmap_playcounts_count")
      await user.loadModule("cover")
      await user.loadModule("country", user.country_code)
      await user.loadModule("favourite_beatmapset_count")
      await user.loadModule("follower_count")
      await user.loadModule("graveyard_beatmapset_count")
      await user.loadGroups()
      await user.loadModule("loved_beatmapset_count")
      await user.loadMonthlyPlaycount()
      await user.loadModule("page")
      await user.loadModule("pending_beatmapset_count")
      await user.loadModule("previous_usernames")
      await user.loadModule("rank_history", mode)
      await user.loadModule("ranked_beatmapset_count")
      await user.loadModule("replays_watched_counts")
      await user.loadModule("scores_best_count")
      await user.loadModule("scores_first_count")
      await user.loadModule("scores_recent_count")
      await user.loadStatistics()
      await user.loadModule("support_level")
      await user.loadModule("user_achievements")

      user.active_tournament_banner = null
      user.comments_count = 0
      user.guest_beatmapset_count = 0
      user.loved_beatmapset_count = 0
      user.mapping_follower_count = 0
      user.rank_history = {
        mode: 'osu',
        data: []
      }
      user.ranked_and_approved_beatmapset_count = 0
      user.unranked_beatmapset_count = 0
      user.scores_pinned_count = 0

      return reply.send({
        avatar_url: user.avatar_url,
        country_code: user.country_code,
        default_group: user.default_group,
        id: user.id,
        is_active: user.is_active,
        is_bot: user.is_bot,
        is_deleted: user.is_deleted,
        is_online: user.is_online,
        is_supporter: user.is_supporter,
        last_visit: user.last_visit,
        pm_friends_only: user.pm_friends_only,
        profile_colour: user.profile_colour,
        username: user.username,
        cover_url: user.cover_url,
        discord: user.discord,
        has_supported: user.has_supported,
        interests: user.interests,
        join_date: user.join_date,
        kudosu: user.kudosu,
        location: user.location,
        max_blocks: user.max_blocks,
        max_friends: user.max_friends,
        occupation: user.occupation,
        playmode: user.playmode,
        playstyle: user.playstyle,
        post_count: user.post_count,
        profile_order: user.profile_order,
        title: user.title,
        title_url: user.title_url,
        twitter: user.twitter,
        website: user.website,
        country: user.country,
        cover: user.cover,
        account_history: user.account_history,
        active_tournament_banner: null,
        badges: user.badges,
        beatmap_playcounts_count: user.beatmap_playcounts_count,
        comments_count: 0,
        favourite_beatmapset_count: user.favourite_beatmapset_count,
        follower_count: user.follower_count,
        graveyard_beatmapset_count: user.graveyard_beatmapset_count,
        groups: user.groups,
        guest_beatmapset_count: 0,
        loved_beatmapset_count: user.loved_beatmapset_count,
        mapping_follower_count: user.follow_user_mapping,
        monthly_playcounts: user.monthly_playcounts,
        page: user.page,
        pending_beatmapset_count: user.pending_beatmapset_count,
        previous_usernames: user.previous_usernames,
        ranked_beatmapset_count: user.ranked_beatmapset_count,
        replays_watched_counts: user.replays_watched_counts,
        scores_best_count: user.scores_best_count,
        scores_first_count: user.scores_first_count,
        scores_pinned_count: 0,
        scores_recent_count: user.scores_recent_count,
        statistics: user.statistics,
        support_level: user.support_level,
        user_achievements: user.user_achievements,
        rankHistory: user.rank_history,
        rank_history: user.rank_history,
        ranked_and_approved_beatmapset_count: 0,
        unranked_beatmapset_count: 0
      })
    })

    fastify.get('/friends', (req, reply) => {
        return reply.send([])
    })

    fastify.get('/seasonal-backgrounds', (req, reply) => {
        return reply.send({
          "ends_at": "2022-09-01T16:00:00+00:00",
          "backgrounds": [
              {
                  "url":"https:\/\/x.catboy.best\/k4ocG4j.jpg",
                  "user":{
                      "avatar_url":"https:\/\/a.ppy.sh\/29265711?1647803084.jpeg",
                      "country_code":"KE",
                      "default_group":"default",
                      "id":29265711,
                      "is_active":true,
                      "is_bot":false,
                      "is_deleted":false,
                      "is_online":false,
                      "is_supporter":true,
                      "last_visit":"2022-07-11T14:48:13+00:00",
                      "pm_friends_only":false,
                      "profile_colour":null,
                      "username":"lILY1231"
                  }
              }]
        })
    })
}