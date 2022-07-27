const database = require('../helper/database')
const sessions = require('../constants/sessions')
module.exports = async function(fastify, opts){

    fastify.register(require('./beatmaps'), { prefix: '/beatmaps'})

    fastify.get("/me/", async (req, reply) => {

      const session = sessions.access.get(req.headers.authorization.split(" ")[1])
      if(!session) return
      await database.client.connect()
      const user = await database.client.db("lazer").collection("users").findOne({id: session.id})
      await database.client.close()

        reply.send({
            avatar_url: `https://a.lemres.de/${user.id + 998}`,
            country_code: 'BR',
            default_group: 'default',
            id: user.id,
            is_active: true,
            is_bot: false,
            is_deleted: false,
            is_online: true,
            is_supporter: true,
            last_visit: new Date(user.latest_activity).toISOString(),
            pm_friends_only: true,
            profile_colour: '#6B3FA0',
            username: user.username,
            cover_url: 'https://assets.ppy.sh/user-profile-covers/4452992/6930dde80f0cbe68e142f403e551493b83c74f1f58e3e35f81cfc3944d24fd65.jpeg',
            discord: 'Lemres#0001',
            has_supported: true,
            interests: 'Yaoi',
            join_date: new Date(user.register_date).toISOString(),
            kudosu: { total: 0, available: 0 },
            location: 'Frankfurt',
            max_blocks: 100,
            max_friends: 500,
            occupation: 'osu!Horizon',
            playmode: 'osu',
            playstyle: [ 'keyboard', 'tablet' ],
            post_count: 0,
            profile_order: [
              'me',
              'beatmaps',
              'recent_activity',
              'kudosu',
              'top_ranks',
              'medals',
              'historical'
            ],
            title: 'Administrator',
            title_url: null,
            twitter: 'SomehowNanoo',
            website: 'http://www.twitch.tv/nanoolive',
            country: { code: 'BR', name: 'Brazil' },
            cover: {
              custom_url: 'https://assets.ppy.sh/user-profile-covers/4452992/6930dde80f0cbe68e142f403e551493b83c74f1f58e3e35f81cfc3944d24fd65.jpeg',      
              url: 'https://assets.ppy.sh/user-profile-covers/4452992/6930dde80f0cbe68e142f403e551493b83c74f1f58e3e35f81cfc3944d24fd65.jpeg',
              id: null
            },
            account_history: [ //TODO
              {
                description: 'inappropriate conduct in comments section',
                id: 11365551,
                length: 4800,
                timestamp: '2022-05-21T02:07:18+00:00',
                type: 'silence'
              }
            ],
            active_tournament_banner: null,
            badges: [ //TODO
              {
                awarded_at: '2022-02-07T18:57:41+00:00',
                description: 'Longstanding contribution to the Beatmap Nominators - 1 Year',
                image_url: 'https://assets.ppy.sh/profile-badges/BN1y.png',
                url: ''
              },
              {
                awarded_at: '2021-02-05T12:54:51+00:00',
                description: "Mapper's Favourite 2020: osu! (False Noise - Space Angel) [contributor]",
                image_url: 'https://assets.ppy.sh/profile-badges/cc2020_mf_osu_badge.png',
                url: ''
              },
              {
                awarded_at: '2019-05-13T12:00:20+00:00',
                description: 'osu! Mapping World Cup #1 Winning Team',
                image_url: 'https://assets.ppy.sh/profile-badges/obwc-champion-2019.png',
                url: ''
              },
              {
                awarded_at: '2018-07-18T15:30:26+00:00',
                description: 'osu! International Mapping Contest 2 Winner',
                image_url: 'https://assets.ppy.sh/profile-badges/oimc2-2018.jpg',
                url: ''
              },
              {
                awarded_at: '2017-12-19T08:44:49+00:00',
                description: 'French Beatmapping Contest 2017 Winner',
                image_url: 'https://assets.ppy.sh/profile-badges/fbc2017.png',
                url: ''
              }
            ],
            beatmap_playcounts_count: 0,
            comments_count: 0,
            favourite_beatmapset_count: 0,
            follower_count: 0,
            graveyard_beatmapset_count: 0,
            groups: [ //? TODO: I don't know how this works
              {
                colour: '#A347EB',
                has_listing: true,
                has_playmodes: true,
                id: 28,
                identifier: 'bng',
                is_probationary: false,
                name: 'Beatmap Nominators',
                short_name: 'BN',
                playmodes: ['osu']
              }
            ],
            guest_beatmapset_count: 0,
            loved_beatmapset_count: 0,
            mapping_follower_count: 0,
            monthly_playcounts: [
              { start_date: '2014-12-01', count: 4 },
              { start_date: '2015-01-01', count: 26 },
              { start_date: '2015-02-01', count: 57 },
              { start_date: '2015-03-01', count: 25 },
              { start_date: '2015-04-01', count: 329 },
              { start_date: '2015-05-01', count: 1267 },
              { start_date: '2015-06-01', count: 3298 },
              { start_date: '2015-07-01', count: 3578 },
              { start_date: '2015-08-01', count: 2911 },
              { start_date: '2015-09-01', count: 3290 },
              { start_date: '2015-10-01', count: 2516 },
              { start_date: '2015-11-01', count: 1049 },
              { start_date: '2015-12-01', count: 1818 },
              { start_date: '2016-01-01', count: 1870 },
              { start_date: '2016-02-01', count: 719 },
              { start_date: '2016-03-01', count: 1356 },
              { start_date: '2016-04-01', count: 534 },
              { start_date: '2016-05-01', count: 1588 },
              { start_date: '2016-06-01', count: 875 },
              { start_date: '2016-07-01', count: 765 },
              { start_date: '2016-08-01', count: 666 },
              { start_date: '2016-09-01', count: 1384 },
              { start_date: '2016-10-01', count: 1197 },
              { start_date: '2016-11-01', count: 921 },
              { start_date: '2016-12-01', count: 840 },
              { start_date: '2017-01-01', count: 622 },
              { start_date: '2017-02-01', count: 443 },
              { start_date: '2017-03-01', count: 469 },
              { start_date: '2017-04-01', count: 464 },
              { start_date: '2017-05-01', count: 294 },
              { start_date: '2017-06-01', count: 337 },
              { start_date: '2017-07-01', count: 84 },
              { start_date: '2017-08-01', count: 206 },
              { start_date: '2017-09-01', count: 154 },
              { start_date: '2017-10-01', count: 104 },
              { start_date: '2017-11-01', count: 75 },
              { start_date: '2017-12-01', count: 148 },
              { start_date: '2018-01-01', count: 274 },
              { start_date: '2018-02-01', count: 187 },
              { start_date: '2018-03-01', count: 124 },
              { start_date: '2018-04-01', count: 96 },
              { start_date: '2018-05-01', count: 115 },
              { start_date: '2018-06-01', count: 90 },
              { start_date: '2018-07-01', count: 465 },
              { start_date: '2018-08-01', count: 271 },
              { start_date: '2018-09-01', count: 674 },
              { start_date: '2018-10-01', count: 426 },
              { start_date: '2018-11-01', count: 245 },
              { start_date: '2018-12-01', count: 61 },
              { start_date: '2019-01-01', count: 39 },
              { start_date: '2019-02-01', count: 78 },
              { start_date: '2019-03-01', count: 115 },
              { start_date: '2019-04-01', count: 40 },
              { start_date: '2019-05-01', count: 149 },
              { start_date: '2019-06-01', count: 348 },
              { start_date: '2019-07-01', count: 198 },
              { start_date: '2019-08-01', count: 123 },
              { start_date: '2019-09-01', count: 99 },
              { start_date: '2019-10-01', count: 60 },
              { start_date: '2019-11-01', count: 51 },
              { start_date: '2019-12-01', count: 34 },
              { start_date: '2020-01-01', count: 20 },
              { start_date: '2020-02-01', count: 82 },
              { start_date: '2020-03-01', count: 199 },
              { start_date: '2020-04-01', count: 186 },
              { start_date: '2020-05-01', count: 118 },
              { start_date: '2020-06-01', count: 154 },
              { start_date: '2020-07-01', count: 26 },
              { start_date: '2020-08-01', count: 16 },
              { start_date: '2020-09-01', count: 571 },
              { start_date: '2020-10-01', count: 10 },
              { start_date: '2020-11-01', count: 8 },
              { start_date: '2020-12-01', count: 16 },
              { start_date: '2021-01-01', count: 4 },
              { start_date: '2021-02-01', count: 1 },
              { start_date: '2021-03-01', count: 62 },
              { start_date: '2021-04-01', count: 179 },
              { start_date: '2021-05-01', count: 97 },
              { start_date: '2021-06-01', count: 164 },
              { start_date: '2021-07-01', count: 385 },
              { start_date: '2021-08-01', count: 77 },
              { start_date: '2021-09-01', count: 64 },
              { start_date: '2021-10-01', count: 22 },
              { start_date: '2021-11-01', count: 169 },
              { start_date: '2021-12-01', count: 91 },
              { start_date: '2022-01-01', count: 154 },
              { start_date: '2022-02-01', count: 161 },
              { start_date: '2022-03-01', count: 353 },
              { start_date: '2022-04-01', count: 27 },
              { start_date: '2022-05-01', count: 46 }
            ],
            page: {
              raw: ''
            },
            pending_beatmapset_count: 3,
            previous_usernames: [],
            ranked_beatmapset_count: 0,
            replays_watched_counts: [
              { start_date: '2015-06-01', count: 1 },
              { start_date: '2015-08-01', count: 1 },
              { start_date: '2015-10-01', count: 1 },
              { start_date: '2015-11-01', count: 2 },
              { start_date: '2015-12-01', count: 11 },
              { start_date: '2016-01-01', count: 5 },
              { start_date: '2016-02-01', count: 12 },
              { start_date: '2016-03-01', count: 8 },
              { start_date: '2016-04-01', count: 6 },
              { start_date: '2016-05-01', count: 25 },
              { start_date: '2016-06-01', count: 17 },
              { start_date: '2016-07-01', count: 12 },
              { start_date: '2016-08-01', count: 21 },
              { start_date: '2016-09-01', count: 21 },
              { start_date: '2016-10-01', count: 39 },
              { start_date: '2016-11-01', count: 36 },
              { start_date: '2016-12-01', count: 32 },
              { start_date: '2017-01-01', count: 32 },
              { start_date: '2017-02-01', count: 26 },
              { start_date: '2017-03-01', count: 43 },
              { start_date: '2017-04-01', count: 55 },
              { start_date: '2017-05-01', count: 30 },
              { start_date: '2017-06-01', count: 29 },
              { start_date: '2017-07-01', count: 16 },
              { start_date: '2017-08-01', count: 16 },
              { start_date: '2017-09-01', count: 14 },
              { start_date: '2017-10-01', count: 6 },
              { start_date: '2017-11-01', count: 7 },
              { start_date: '2017-12-01', count: 5 },
              { start_date: '2018-01-01', count: 15 },
              { start_date: '2018-02-01', count: 16 },
              { start_date: '2018-03-01', count: 16 },
              { start_date: '2018-04-01', count: 28 },
              { start_date: '2018-05-01', count: 31 },
              { start_date: '2018-06-01', count: 29 },
              { start_date: '2018-07-01', count: 49 },
              { start_date: '2018-08-01', count: 35 },
              { start_date: '2018-09-01', count: 114 },
              { start_date: '2018-10-01', count: 81 },
              { start_date: '2018-11-01', count: 76 },
              { start_date: '2018-12-01', count: 63 },
              { start_date: '2019-01-01', count: 57 },
              { start_date: '2019-02-01', count: 85 },
              { start_date: '2019-03-01', count: 49 },
              { start_date: '2019-04-01', count: 36 },
              { start_date: '2019-05-01', count: 34 },
              { start_date: '2019-06-01', count: 57 },
              { start_date: '2019-07-01', count: 36 },
              { start_date: '2019-08-01', count: 32 },
              { start_date: '2019-09-01', count: 20 },
              { start_date: '2019-10-01', count: 36 },
              { start_date: '2019-11-01', count: 28 },
              { start_date: '2019-12-01', count: 18 },
              { start_date: '2020-01-01', count: 23 },
              { start_date: '2020-02-01', count: 20 },
              { start_date: '2020-03-01', count: 40 },
              { start_date: '2020-04-01', count: 28 },
              { start_date: '2020-05-01', count: 39 },
              { start_date: '2020-06-01', count: 40 },
              { start_date: '2020-07-01', count: 35 },
              { start_date: '2020-08-01', count: 25 },
              { start_date: '2020-09-01', count: 54 },
              { start_date: '2020-10-01', count: 51 },
              { start_date: '2020-11-01', count: 32 },
              { start_date: '2020-12-01', count: 43 },
              { start_date: '2021-01-01', count: 15 },
              { start_date: '2021-02-01', count: 20 },
              { start_date: '2021-03-01', count: 26 },
              { start_date: '2021-04-01', count: 47 },
              { start_date: '2021-05-01', count: 61 },
              { start_date: '2021-06-01', count: 56 },
              { start_date: '2021-07-01', count: 58 },
              { start_date: '2021-08-01', count: 99 },
              { start_date: '2021-09-01', count: 51 },
              { start_date: '2021-10-01', count: 34 },
              { start_date: '2021-11-01', count: 45 },
              { start_date: '2021-12-01', count: 54 },
              { start_date: '2022-01-01', count: 62 },
              { start_date: '2022-02-01', count: 43 },
              { start_date: '2022-03-01', count: 32 },
              { start_date: '2022-04-01', count: 21 },
              { start_date: '2022-05-01', count: 19 },
              { start_date: '2022-06-01', count: 2 }
            ],
            scores_best_count: 100,
            scores_first_count: 0,
            scores_pinned_count: 0,
            scores_recent_count: 0,
            statistics: {
              level: { current: 0, progress: 0 },
              global_rank: 1,
              pp: 0,
              ranked_score: 0,
              hit_accuracy: 0,
              play_count: 0,
              play_time: 0,
              total_score: 0,
              total_hits: 0,
              maximum_combo: 0,
              replays_watched_by_others: 0,
              is_ranked: true,
              grade_counts: { ss: 0, ssh: 0, s: 0, sh: 0, a: 0 },
              country_rank: 1,
              rank: { country: 0 }
            },
            support_level: 3,
            user_achievements: [
              { achieved_at: '2021-05-13T17:30:37+00:00', achievement_id: 147 },
              { achieved_at: '2021-05-13T17:30:37+00:00', achievement_id: 138 },
              { achieved_at: '2020-09-16T23:32:10+00:00', achievement_id: 222 },
              { achieved_at: '2018-01-14T18:31:15+00:00', achievement_id: 13 },
              { achieved_at: '2017-05-09T17:03:10+00:00', achievement_id: 141 },
              { achieved_at: '2017-04-07T17:00:46+00:00', achievement_id: 68 },
              { achieved_at: '2017-02-26T17:47:07+00:00', achievement_id: 132 },
              { achieved_at: '2017-02-25T22:45:08+00:00', achievement_id: 71 },
              { achieved_at: '2017-02-25T22:40:35+00:00', achievement_id: 72 },
              { achieved_at: '2017-01-09T21:56:39+00:00', achievement_id: 61 },
              { achieved_at: '2016-11-11T18:41:08+00:00', achievement_id: 127 },
              { achieved_at: '2016-10-27T16:55:49+00:00', achievement_id: 63 },
              { achieved_at: '2016-10-27T16:55:49+00:00', achievement_id: 55 },
              { achieved_at: '2016-09-05T15:49:46+00:00', achievement_id: 65 },
              { achieved_at: '2016-09-05T15:49:46+00:00', achievement_id: 57 },
              { achieved_at: '2016-08-31T14:52:39+00:00', achievement_id: 60 },
              { achieved_at: '2016-08-27T10:40:42+00:00', achievement_id: 148 },
              { achieved_at: '2016-07-25T01:13:26+00:00', achievement_id: 123 },
              { achieved_at: '2016-07-25T01:13:26+00:00', achievement_id: 122 },
              { achieved_at: '2016-07-22T23:57:14+00:00', achievement_id: 124 },
              { achieved_at: '2016-06-13T15:22:57+00:00', achievement_id: 64 },
              { achieved_at: '2016-06-13T15:22:57+00:00', achievement_id: 56 },
              { achieved_at: '2016-06-03T21:50:35+00:00', achievement_id: 103 },
              { achieved_at: '2016-06-03T21:44:24+00:00', achievement_id: 80 },
              { achieved_at: '2016-06-03T21:38:30+00:00', achievement_id: 79 },
              { achieved_at: '2016-05-24T08:20:01+00:00', achievement_id: 67 },
              { achieved_at: '2016-05-08T20:43:17+00:00', achievement_id: 59 },
              { achieved_at: '2016-05-08T20:43:17+00:00', achievement_id: 22 },
              { achieved_at: '2016-05-08T10:52:33+00:00', achievement_id: 66 },
              { achieved_at: '2016-05-04T22:11:16+00:00', achievement_id: 58 },
              { achieved_at: '2016-04-26T14:20:08+00:00', achievement_id: 51 },
              { achieved_at: '2016-04-25T20:45:27+00:00', achievement_id: 50 },
              { achieved_at: '2016-02-02T20:56:36+00:00', achievement_id: 42 },
              { achieved_at: '2015-10-01T20:19:05+00:00', achievement_id: 21 },
              { achieved_at: '2015-06-30T16:15:09+00:00', achievement_id: 20 },
              { achieved_at: '2015-06-25T00:10:10+00:00', achievement_id: 5 },
              { achieved_at: '2015-06-12T21:53:25+00:00', achievement_id: 4 },
              { achieved_at: '2015-05-27T18:56:57+00:00', achievement_id: 39 },
              { achieved_at: '2015-05-25T19:52:02+00:00', achievement_id: 3 },
              { achieved_at: '2015-05-22T02:24:14+00:00', achievement_id: 15 },
              { achieved_at: '2015-05-07T21:29:11+00:00', achievement_id: 1 }
            ],
            rank_history: {
              mode: 'osu',
              data: []
            },
            ranked_and_approved_beatmapset_count: 0,
            unranked_beatmapset_count: 0
          })
    })
    
    fastify.get('/users/:id/:mode', (req, reply) => {
        const { id, mode } = req.params
        let { key } = req.query
    
        if(!key) key = "id"
    
        return reply.send({
            avatar_url: 'https://a.ppy.sh/9527931?1644075951.jpeg',
            country_code: 'DE',
            default_group: 'bng',
            id: 9527931,
            is_active: true,
            is_bot: false,
            is_deleted: false,
            is_online: false,
            is_supporter: true,
            last_visit: null,
            pm_friends_only: true,
            profile_colour: '#6B3FA0',
            username: 'Nanoo',
            cover_url: 'https://assets.ppy.sh/user-profile-covers/4452992/6930dde80f0cbe68e142f403e551493b83c74f1f58e3e35f81cfc3944d24fd65.jpeg',
            discord: 'Lemres#0001',
            has_supported: true,
            interests: 'fhana',
            join_date: '2014-05-28T17:34:35+00:00',
            kudosu: { total: 3272, available: 2457 },
            location: 'France',
            max_blocks: 100,
            max_friends: 500,
            occupation: 'Game Designer',
            playmode: 'osu',
            playstyle: [ 'keyboard', 'tablet' ],
            post_count: 3448,
            profile_order: [
              'me',
              'beatmaps',
              'recent_activity',
              'kudosu',
              'top_ranks',
              'medals',
              'historical'
            ],
            title: 'Beatmap Nominator',
            title_url: null,
            twitter: 'sotarks',
            website: 'http://www.twitch.tv/sotarks',
            country: { code: 'FR', name: 'France' },
            cover: {
              custom_url: 'https://assets.ppy.sh/user-profile-covers/4452992/6930dde80f0cbe68e142f403e551493b83c74f1f58e3e35f81cfc3944d24fd65.jpeg',      
              url: 'https://assets.ppy.sh/user-profile-covers/4452992/6930dde80f0cbe68e142f403e551493b83c74f1f58e3e35f81cfc3944d24fd65.jpeg',
              id: null
            },
            account_history: [
              {
                description: 'inappropriate conduct in comments section',
                id: 11365551,
                length: 4800,
                timestamp: '2022-05-21T02:07:18+00:00',
                type: 'silence'
              }
            ],
            active_tournament_banner: null,
            badges: [
              {
                awarded_at: '2022-02-07T18:57:41+00:00',
                description: 'Longstanding contribution to the Beatmap Nominators - 1 Year',
                image_url: 'https://assets.ppy.sh/profile-badges/BN1y.png',
                url: ''
              },
              {
                awarded_at: '2021-02-05T12:54:51+00:00',
                description: "Mapper's Favourite 2020: osu! (False Noise - Space Angel) [contributor]",
                image_url: 'https://assets.ppy.sh/profile-badges/cc2020_mf_osu_badge.png',
                url: ''
              },
              {
                awarded_at: '2019-05-13T12:00:20+00:00',
                description: 'osu! Mapping World Cup #1 Winning Team',
                image_url: 'https://assets.ppy.sh/profile-badges/obwc-champion-2019.png',
                url: ''
              },
              {
                awarded_at: '2018-07-18T15:30:26+00:00',
                description: 'osu! International Mapping Contest 2 Winner',
                image_url: 'https://assets.ppy.sh/profile-badges/oimc2-2018.jpg',
                url: ''
              },
              {
                awarded_at: '2017-12-19T08:44:49+00:00',
                description: 'French Beatmapping Contest 2017 Winner',
                image_url: 'https://assets.ppy.sh/profile-badges/fbc2017.png',
                url: ''
              }
            ],
            beatmap_playcounts_count: 6295,
            comments_count: 1256,
            favourite_beatmapset_count: 0,
            follower_count: 23328,
            graveyard_beatmapset_count: 0,
            groups: [
              {
                colour: '#A347EB',
                has_listing: true,
                has_playmodes: true,
                id: 28,
                identifier: 'bng',
                is_probationary: false,
                name: 'Beatmap Nominators',
                short_name: 'BN',
                playmodes: [Array]
              }
            ],
            guest_beatmapset_count: 89,
            loved_beatmapset_count: 0,
            mapping_follower_count: 11901,
            monthly_playcounts: [
              { start_date: '2014-12-01', count: 4 },
              { start_date: '2015-01-01', count: 26 },
              { start_date: '2015-02-01', count: 57 },
              { start_date: '2015-03-01', count: 25 },
              { start_date: '2015-04-01', count: 329 },
              { start_date: '2015-05-01', count: 1267 },
              { start_date: '2015-06-01', count: 3298 },
              { start_date: '2015-07-01', count: 3578 },
              { start_date: '2015-08-01', count: 2911 },
              { start_date: '2015-09-01', count: 3290 },
              { start_date: '2015-10-01', count: 2516 },
              { start_date: '2015-11-01', count: 1049 },
              { start_date: '2015-12-01', count: 1818 },
              { start_date: '2016-01-01', count: 1870 },
              { start_date: '2016-02-01', count: 719 },
              { start_date: '2016-03-01', count: 1356 },
              { start_date: '2016-04-01', count: 534 },
              { start_date: '2016-05-01', count: 1588 },
              { start_date: '2016-06-01', count: 875 },
              { start_date: '2016-07-01', count: 765 },
              { start_date: '2016-08-01', count: 666 },
              { start_date: '2016-09-01', count: 1384 },
              { start_date: '2016-10-01', count: 1197 },
              { start_date: '2016-11-01', count: 921 },
              { start_date: '2016-12-01', count: 840 },
              { start_date: '2017-01-01', count: 622 },
              { start_date: '2017-02-01', count: 443 },
              { start_date: '2017-03-01', count: 469 },
              { start_date: '2017-04-01', count: 464 },
              { start_date: '2017-05-01', count: 294 },
              { start_date: '2017-06-01', count: 337 },
              { start_date: '2017-07-01', count: 84 },
              { start_date: '2017-08-01', count: 206 },
              { start_date: '2017-09-01', count: 154 },
              { start_date: '2017-10-01', count: 104 },
              { start_date: '2017-11-01', count: 75 },
              { start_date: '2017-12-01', count: 148 },
              { start_date: '2018-01-01', count: 274 },
              { start_date: '2018-02-01', count: 187 },
              { start_date: '2018-03-01', count: 124 },
              { start_date: '2018-04-01', count: 96 },
              { start_date: '2018-05-01', count: 115 },
              { start_date: '2018-06-01', count: 90 },
              { start_date: '2018-07-01', count: 465 },
              { start_date: '2018-08-01', count: 271 },
              { start_date: '2018-09-01', count: 674 },
              { start_date: '2018-10-01', count: 426 },
              { start_date: '2018-11-01', count: 245 },
              { start_date: '2018-12-01', count: 61 },
              { start_date: '2019-01-01', count: 39 },
              { start_date: '2019-02-01', count: 78 },
              { start_date: '2019-03-01', count: 115 },
              { start_date: '2019-04-01', count: 40 },
              { start_date: '2019-05-01', count: 149 },
              { start_date: '2019-06-01', count: 348 },
              { start_date: '2019-07-01', count: 198 },
              { start_date: '2019-08-01', count: 123 },
              { start_date: '2019-09-01', count: 99 },
              { start_date: '2019-10-01', count: 60 },
              { start_date: '2019-11-01', count: 51 },
              { start_date: '2019-12-01', count: 34 },
              { start_date: '2020-01-01', count: 20 },
              { start_date: '2020-02-01', count: 82 },
              { start_date: '2020-03-01', count: 199 },
              { start_date: '2020-04-01', count: 186 },
              { start_date: '2020-05-01', count: 118 },
              { start_date: '2020-06-01', count: 154 },
              { start_date: '2020-07-01', count: 26 },
              { start_date: '2020-08-01', count: 16 },
              { start_date: '2020-09-01', count: 571 },
              { start_date: '2020-10-01', count: 10 },
              { start_date: '2020-11-01', count: 8 },
              { start_date: '2020-12-01', count: 16 },
              { start_date: '2021-01-01', count: 4 },
              { start_date: '2021-02-01', count: 1 },
              { start_date: '2021-03-01', count: 62 },
              { start_date: '2021-04-01', count: 179 },
              { start_date: '2021-05-01', count: 97 },
              { start_date: '2021-06-01', count: 164 },
              { start_date: '2021-07-01', count: 385 },
              { start_date: '2021-08-01', count: 77 },
              { start_date: '2021-09-01', count: 64 },
              { start_date: '2021-10-01', count: 22 },
              { start_date: '2021-11-01', count: 169 },
              { start_date: '2021-12-01', count: 91 },
              { start_date: '2022-01-01', count: 154 },
              { start_date: '2022-02-01', count: 161 },
              { start_date: '2022-03-01', count: 353 },
              { start_date: '2022-04-01', count: 27 },
              { start_date: '2022-05-01', count: 46 }
            ],
            page: {
              raw: '[img]https://i.imgur.com/N029Ht3.png[/img][img]https://i.imgur.com/ul354BE.png[/img][url=https://osu.ppy.sh/beatmapsets?q=fhana%20creator%3Dsotarks][img]https://i.imgur.com/8u4aLXV.png[/img][/url][img]https://i.imgur.com/cvsQVVE.png[/img][img]https://i.imgur.com/WmXh1vH.png[/img][url=https://anilist.co/user/Sotarks/animelist][img]https://i.imgur.com/tk05DJK.png[/img][/url][img]https://i.imgur.com/KtFJKA5.png[/img][url=https://osu.ppy.sh/beatmapsets?m=0&q=sotarks][img]https://i.imgur.com/tusT8R1.png[/img][/url][img]https://i.imgur.com/qmd7KHI.png[/img][img]https://i.imgur.com/Z6EUZ2d.png[/img][img]https://i.imgur.com/DujvR2m.png[/img][url=https://jeminix2.carrd.co/][img]https://i.imgur.com/Xer4L7t.png[/img][/url][img]https://i.imgur.com/4Zccb4A.png[/img][img]https://i.imgur.com/kZPgBpo.png[/img][url=https://osuck.link/s-880][img]https://i.imgur.com/sKBxjg7.png[/img][/url][img]https://i.imgur.com/eYprKRu.png[/img][url=https://www.youtube.com/watch?v=HhNeemCRf0Q][img]https://i.imgur.com/32Kl17q.png[/img][/url][img]https://i.imgur.com/6mLN6HY.png[/img][url=http://twitch.tv/sotarks][img]https://i.imgur.com/hGim3je.png[/img][/url][url=https://www.youtube.com/channel/UC_InnqIfKhZ9Fp3r61v635Q][img]https://i.imgur.com/vYEnXEx.png[/img][/url][url=https://twitter.com/sotarks][img]https://i.imgur.com/Iw2yBow.png[/img][/url][url=https://discord.gg/sotarks][img]https://i.imgur.com/no8jOFv.png[/img][/url][img]https://i.imgur.com/h7OclFP.png[/img][img]https://i.imgur.com/GkkKBAE.png[/img]\n' +
                '\n' +
                '[centre][size=150]✏️ mapping : [b]active[/b] — 🗒️ modding : [b]active[/b] — 🎮 playing : [b]inacti ve[/b][/size]\n' +
                '\n' +
                '[img]https://i.imgur.com/TcZQMNT.png[/img]\n' +
                '\n' +
                '[notice][heading]BN Request[/heading]\n' +
                "[size=150][b]STATUS [/b]: to see if i'm [b]open[/b], check my [b]request form[/b] (if you can request that means i'm open, if you can't then i'm closed)[/size]\n" +
                '[/centre]\n' +
                '[box=📋 Rules (before requesting)]\n' +
                '[b]i do not[/b] nominate [b]hard tech maps[/b] [size=85](basically super fast SV stuff)[/size]\n' +
                'i prefer [b]j-pop[/b], [b]j-rock[/b], [b]k-pop[/b], [b]dnb[/b]...\n' +
                "don't bother requesting stuff [b]>8*[/b]\n" +
                "i'm ok with any style as long as it's not tech, or huge pp maps.\n" +
                'only request if your set is [b]done [/b]and [b]hitsounded[/b].\n' +
                '[/box]\n' +
                '\n' +
                "if you're from my favorite mapper list, you can message me anytime ♥\n" +
                '\n' +
                '[url=https://docs.google.com/spreadsheets/d/1HZI18eZQRLev3wFqiObL_nfmKGfVgNxc4MnOXBJRqOc/edit?usp=sharing][b]BN Log[/b][/url] — [url=https://osu.ppy.sh/community/forums/topics/459320?n=1][b]BN Queue[/b][/url] — [url=https://forms.gle/rDQFnT4bu9ZoAp5S6][b]Request Form[/b][/url][/notice] \n' +
                '\n' +
                '[notice][centre][b][size=150]✨ my proudest maps ✨[/size][/b] \n' +
                "[size=85](out of all the pp / controversial maps i made in my mapping career, these 3 are my favorite pieces. i had such a great time making these and i'm glad people enjoy these.)[/size]\n" +
                '[url=https://osu.ppy.sh/beatmapsets/1124422#osu/2349543][img]https://astral.s-ul.eu/e4ChKPJO[/img][/url]\n' +
                '[url=https://osu.ppy.sh/beatmapsets/1272018#osu/2643244][img]https://astral.s-ul.eu/1sX4Cif5[/img][/url]\n' +
                '[url=https://osu.ppy.sh/beatmapsets/1205697#osu/2510638][img]https://astral.s-ul.eu/MTZnfJs8[/img][/url][/centre][/notice]\n' +
                '\n' +
                '\n' +
                '[notice]💡 [b]influential — favorite mappers[/b] : [profile=1623405]Okoratu[/profile], [profile]appleeaterx[/profile], [profile=1367570]Rizia[/profile], [profile=6203841]Kagetsu[/profile], [profile=899031]Lami[/profile], [profile=3513559]diodex[/profile], [profile=5069490]Silky[/profile], [profile=8722791]schoolboy[/profile] & [profile=1125647]Shikibe Mayu[/profile].\n' +
                '\n' +
                '🖤 [b]proud mentees[/b] : [profile=3723568]Kujinn[/profile], [profile=7785535]pregnant woman[/profile], [profile=9327302]SMOKELIND[/profile], [profile=6629599]MiracleE[/profile], [profile=10507407]Nymphe[/profile], [profile=5156153]DeRandom Otaku[/profile], [profile=6591339]Alexandrine[/profile], [profile=5579871]Agatsu[/profile], [profile]iljaaz[/profile], [profile=5404892]Kowari[/profile], [profile=6707918]MaestroSplinter[/profile], [profile]Raitzuki[/profile], [profile=5419324]Elinor[/profile], [profile=10428529]Yereoz[/profile] & [profile=13292803]NakaRoniX[/profile].\n' +
                '[box=🧑‍🤝‍🧑 family pic][img]https://i.imgur.com/FiqgoRn.png[/img][/box]\n' +
                '\n' +
                '[box=🏆 best achievements]\n' +
                '[b]All top 5 most played beatmap in 24h[/b]\n' +
                '[img]https://i.imgur.com/n3vUXIL.png[/img]\n' +
                '\n' +
                '[b]A year in mapping 2018[/b]\n' +
                '[img]https://i.imgur.com/R9cACmO.png[/img]\n' +
                '\n' +
                '[b]A year in mapping 2019[/b]\n' +
                '[img]https://i.imgur.com/6QbotMn.jpeg[/img]\n' +
                '\n' +
                '[b]A year in mapping 2020[/b]\n' +
                '[img]https://i.imgur.com/0nOcXaH.png[/img]\n' +
                '\n' +
                '#1 Most ranked maps in 2016 (22)\n' +
                '#1 Most ranked maps & most played mapper in 2018\n' +
                '#1 Most ranked maps & most played mapper in 2019 \n' +
                '#1 Most ranked maps & most played mapper in 2020 \n' +
                '#1 French Beatmapping Contest 2017\n' +
                '#1 o!IMC2 (osu! International Mapping Contest 2018)\n' +
                '#1 France Winner o!MWC #1 (osu! Mapping World Cup)\n' +
                '#2 Global most ranked maps on osu!\n' +
                '#1 playcount on 1 map in 24h (quaver - 320k 06/01/18)\n' +
                'Most watched osu! mapper on Twitch\n' +
                '#1 Fastest qualified map (36sec)[/box]\n' +
                '\n' +
                '[url=https://osu.ppy.sh/users/4280363][b]Lydia [/b]♥[/url][/notice]'
            },
            pending_beatmapset_count: 3,
            previous_usernames: [ 'Miyaura', 'sotarks' ],
            ranked_beatmapset_count: 280,
            replays_watched_counts: [
              { start_date: '2015-06-01', count: 1 },
              { start_date: '2015-08-01', count: 1 },
              { start_date: '2015-10-01', count: 1 },
              { start_date: '2015-11-01', count: 2 },
              { start_date: '2015-12-01', count: 11 },
              { start_date: '2016-01-01', count: 5 },
              { start_date: '2016-02-01', count: 12 },
              { start_date: '2016-03-01', count: 8 },
              { start_date: '2016-04-01', count: 6 },
              { start_date: '2016-05-01', count: 25 },
              { start_date: '2016-06-01', count: 17 },
              { start_date: '2016-07-01', count: 12 },
              { start_date: '2016-08-01', count: 21 },
              { start_date: '2016-09-01', count: 21 },
              { start_date: '2016-10-01', count: 39 },
              { start_date: '2016-11-01', count: 36 },
              { start_date: '2016-12-01', count: 32 },
              { start_date: '2017-01-01', count: 32 },
              { start_date: '2017-02-01', count: 26 },
              { start_date: '2017-03-01', count: 43 },
              { start_date: '2017-04-01', count: 55 },
              { start_date: '2017-05-01', count: 30 },
              { start_date: '2017-06-01', count: 29 },
              { start_date: '2017-07-01', count: 16 },
              { start_date: '2017-08-01', count: 16 },
              { start_date: '2017-09-01', count: 14 },
              { start_date: '2017-10-01', count: 6 },
              { start_date: '2017-11-01', count: 7 },
              { start_date: '2017-12-01', count: 5 },
              { start_date: '2018-01-01', count: 15 },
              { start_date: '2018-02-01', count: 16 },
              { start_date: '2018-03-01', count: 16 },
              { start_date: '2018-04-01', count: 28 },
              { start_date: '2018-05-01', count: 31 },
              { start_date: '2018-06-01', count: 29 },
              { start_date: '2018-07-01', count: 49 },
              { start_date: '2018-08-01', count: 35 },
              { start_date: '2018-09-01', count: 114 },
              { start_date: '2018-10-01', count: 81 },
              { start_date: '2018-11-01', count: 76 },
              { start_date: '2018-12-01', count: 63 },
              { start_date: '2019-01-01', count: 57 },
              { start_date: '2019-02-01', count: 85 },
              { start_date: '2019-03-01', count: 49 },
              { start_date: '2019-04-01', count: 36 },
              { start_date: '2019-05-01', count: 34 },
              { start_date: '2019-06-01', count: 57 },
              { start_date: '2019-07-01', count: 36 },
              { start_date: '2019-08-01', count: 32 },
              { start_date: '2019-09-01', count: 20 },
              { start_date: '2019-10-01', count: 36 },
              { start_date: '2019-11-01', count: 28 },
              { start_date: '2019-12-01', count: 18 },
              { start_date: '2020-01-01', count: 23 },
              { start_date: '2020-02-01', count: 20 },
              { start_date: '2020-03-01', count: 40 },
              { start_date: '2020-04-01', count: 28 },
              { start_date: '2020-05-01', count: 39 },
              { start_date: '2020-06-01', count: 40 },
              { start_date: '2020-07-01', count: 35 },
              { start_date: '2020-08-01', count: 25 },
              { start_date: '2020-09-01', count: 54 },
              { start_date: '2020-10-01', count: 51 },
              { start_date: '2020-11-01', count: 32 },
              { start_date: '2020-12-01', count: 43 },
              { start_date: '2021-01-01', count: 15 },
              { start_date: '2021-02-01', count: 20 },
              { start_date: '2021-03-01', count: 26 },
              { start_date: '2021-04-01', count: 47 },
              { start_date: '2021-05-01', count: 61 },
              { start_date: '2021-06-01', count: 56 },
              { start_date: '2021-07-01', count: 58 },
              { start_date: '2021-08-01', count: 99 },
              { start_date: '2021-09-01', count: 51 },
              { start_date: '2021-10-01', count: 34 },
              { start_date: '2021-11-01', count: 45 },
              { start_date: '2021-12-01', count: 54 },
              { start_date: '2022-01-01', count: 62 },
              { start_date: '2022-02-01', count: 43 },
              { start_date: '2022-03-01', count: 32 },
              { start_date: '2022-04-01', count: 21 },
              { start_date: '2022-05-01', count: 19 },
              { start_date: '2022-06-01', count: 2 }
            ],
            scores_best_count: 100,
            scores_first_count: 0,
            scores_pinned_count: 0,
            scores_recent_count: 0,
            statistics: {
              level: { current: 100, progress: 59 },
              global_rank: 25715,
              pp: 6120.59,
              ranked_score: 21283375164,
              hit_accuracy: 99.3356,
              play_count: 43996,
              play_time: 2446483,
              total_score: 86211304983,
              total_hits: 9360950,
              maximum_combo: 6580,
              replays_watched_by_others: 2745,
              is_ranked: true,
              grade_counts: { ss: 64, ssh: 242, s: 618, sh: 1496, a: 535 },
              country_rank: 879,
              rank: { country: 879 }
            },
            support_level: 3,
            user_achievements: [
              { achieved_at: '2021-05-13T17:30:37+00:00', achievement_id: 147 },
              { achieved_at: '2021-05-13T17:30:37+00:00', achievement_id: 138 },
              { achieved_at: '2020-09-16T23:32:10+00:00', achievement_id: 222 },
              { achieved_at: '2018-01-14T18:31:15+00:00', achievement_id: 13 },
              { achieved_at: '2017-05-09T17:03:10+00:00', achievement_id: 141 },
              { achieved_at: '2017-04-07T17:00:46+00:00', achievement_id: 68 },
              { achieved_at: '2017-02-26T17:47:07+00:00', achievement_id: 132 },
              { achieved_at: '2017-02-25T22:45:08+00:00', achievement_id: 71 },
              { achieved_at: '2017-02-25T22:40:35+00:00', achievement_id: 72 },
              { achieved_at: '2017-01-09T21:56:39+00:00', achievement_id: 61 },
              { achieved_at: '2016-11-11T18:41:08+00:00', achievement_id: 127 },
              { achieved_at: '2016-10-27T16:55:49+00:00', achievement_id: 63 },
              { achieved_at: '2016-10-27T16:55:49+00:00', achievement_id: 55 },
              { achieved_at: '2016-09-05T15:49:46+00:00', achievement_id: 65 },
              { achieved_at: '2016-09-05T15:49:46+00:00', achievement_id: 57 },
              { achieved_at: '2016-08-31T14:52:39+00:00', achievement_id: 60 },
              { achieved_at: '2016-08-27T10:40:42+00:00', achievement_id: 148 },
              { achieved_at: '2016-07-25T01:13:26+00:00', achievement_id: 123 },
              { achieved_at: '2016-07-25T01:13:26+00:00', achievement_id: 122 },
              { achieved_at: '2016-07-22T23:57:14+00:00', achievement_id: 124 },
              { achieved_at: '2016-06-13T15:22:57+00:00', achievement_id: 64 },
              { achieved_at: '2016-06-13T15:22:57+00:00', achievement_id: 56 },
              { achieved_at: '2016-06-03T21:50:35+00:00', achievement_id: 103 },
              { achieved_at: '2016-06-03T21:44:24+00:00', achievement_id: 80 },
              { achieved_at: '2016-06-03T21:38:30+00:00', achievement_id: 79 },
              { achieved_at: '2016-05-24T08:20:01+00:00', achievement_id: 67 },
              { achieved_at: '2016-05-08T20:43:17+00:00', achievement_id: 59 },
              { achieved_at: '2016-05-08T20:43:17+00:00', achievement_id: 22 },
              { achieved_at: '2016-05-08T10:52:33+00:00', achievement_id: 66 },
              { achieved_at: '2016-05-04T22:11:16+00:00', achievement_id: 58 },
              { achieved_at: '2016-04-26T14:20:08+00:00', achievement_id: 51 },
              { achieved_at: '2016-04-25T20:45:27+00:00', achievement_id: 50 },
              { achieved_at: '2016-02-02T20:56:36+00:00', achievement_id: 42 },
              { achieved_at: '2015-10-01T20:19:05+00:00', achievement_id: 21 },
              { achieved_at: '2015-06-30T16:15:09+00:00', achievement_id: 20 },
              { achieved_at: '2015-06-25T00:10:10+00:00', achievement_id: 5 },
              { achieved_at: '2015-06-12T21:53:25+00:00', achievement_id: 4 },
              { achieved_at: '2015-05-27T18:56:57+00:00', achievement_id: 39 },
              { achieved_at: '2015-05-25T19:52:02+00:00', achievement_id: 3 },
              { achieved_at: '2015-05-22T02:24:14+00:00', achievement_id: 15 },
              { achieved_at: '2015-05-07T21:29:11+00:00', achievement_id: 1 }
            ],
            rankHistory: {
              mode: 'osu',
              data: [
                24832, 24850, 24876, 24899, 24926, 24956, 24986, 25010,
                25039, 25054, 25091, 25113, 25142, 24604, 24545, 24566,
                24601, 24625, 24652, 23990, 24020, 24045, 24068, 24089,
                24114, 24133, 24172, 24203, 24227, 24246, 24268, 24296,
                24318, 24352, 24387, 24426, 24449, 24476, 24506, 24528,
                24565, 24591, 24613, 24627, 24646, 24665, 24688, 24716,
                24748, 24780, 24798, 24822, 24845, 24857, 24879, 24923,
                24950, 24964, 24984, 25002, 25024, 25044, 25068, 25095,
                25118, 25143, 25168, 25193, 25211, 25237, 25261, 25277,
                25299, 25322, 25353, 25389, 25419, 25443, 25467, 25496,
                25509, 25527, 25559, 25582, 25605, 25618, 25648, 25678,
                25705, 25715
              ]
            },
            rank_history: {
              mode: 'osu',
              data: [
                24832, 24850, 24876, 24899, 24926, 24956, 24986, 25010,
                25039, 25054, 25091, 25113, 25142, 24604, 24545, 24566,
                24601, 24625, 24652, 23990, 24020, 24045, 24068, 24089,
                24114, 24133, 24172, 24203, 24227, 24246, 24268, 24296,
                24318, 24352, 24387, 24426, 24449, 24476, 24506, 24528,
                24565, 24591, 24613, 24627, 24646, 24665, 24688, 24716,
                24748, 24780, 24798, 24822, 24845, 24857, 24879, 24923,
                24950, 24964, 24984, 25002, 25024, 25044, 25068, 25095,
                25118, 25143, 25168, 25193, 25211, 25237, 25261, 25277,
                25299, 25322, 25353, 25389, 25419, 25443, 25467, 25496,
                25509, 25527, 25559, 25582, 25605, 25618, 25648, 25678,
                25705, 25715
              ]
            },
            ranked_and_approved_beatmapset_count: 280,
            unranked_beatmapset_count: 3
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