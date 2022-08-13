import countries from "./countries.js"
import database from "../helper/database.js"
export default {
    beatmap_playcounts_count: async function(){
        return 0
    },
    blocks: async function(){
        return []
    },
    country: async function(code){
        return {
            code,
            name: await countries(code)
        }
    },
    cover: async function(){
        return {
            custom_url: 'https://assets.ppy.sh/user-profile-covers/4452992/6930dde80f0cbe68e142f403e551493b83c74f1f58e3e35f81cfc3944d24fd65.jpeg',      
            url: 'https://assets.ppy.sh/user-profile-covers/4452992/6930dde80f0cbe68e142f403e551493b83c74f1f58e3e35f81cfc3944d24fd65.jpeg',
            id: null
          }
    },
    favourite_beatmapset_count: async function(){
        return 0
    },
    follow_user_mapping: async function(){
        return []
    },
    follower_count: async function(){
        return 0
    },
    friends: async function(){
        return []
    },
    graveyard_beatmapset_count: async function(){
        return 0
    },
    is_restricted: async function(privileges){
        if(!(privileges & 1)) return true
        return false
    },
    loved_beatmapset_count: async function(){
        return 0
    },
    page: async function(){
        return {
            raw: ''
        }
    },
    pending_beatmapset_count: async function(){
        return 0
    },
    previous_usernames: async function(){
        return []
    },
    rank_history: async function(){
        return []
    },
    ranked_beatmapset_count: async function(){
        return 0
    },
    replays_watched_counts: async function(){
        return []
    },
    scores_best_count: async function(){
        return 0
    },
    scores_first_count: async function(){
        return 0
    },
    scores_recent_count: async function(){
        return 0
    },
    statistics: async function(){
        return {
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
            rank: { country: 1 }
          }
    },
    support_level: async function(){
        return 3
    },
    unread_pm_count: async function(){
        return 0
    },
    user_achievements: async function(){
        return []
    },
    user_preferences: async function(){
        return {
            audio_autoplay: false,
            audio_muted: false,
            audio_volume: 0.45,
            beatmapset_card_size: "normal",
            beatmapset_download: "all",
            beatmapset_show_nsfw: true,
            beatmapset_title_show_original: false,
            comments_show_deleted: false,
            forum_posts_show_deleted: false,
            profile_cover_expanded: true,
            user_list_filter: "all",
            user_list_sort: "last_visit",
            user_list_view: "card"
        }
    }
}