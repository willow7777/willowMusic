import { HYEventStore } from 'hy-event-store'
import { getRankings } from '../service/api_music' 

const rankingMap = { 0: [3779629,"newRanking"], 1: [3778678,"hotRanking"], 2: [2884035,"originRanking"], 3: [19723756,"upRanking"] }

const rankingStore = new HYEventStore({  
  state: {
    newRanking: {}, // 0: 新歌榜   3779629
    hotRanking: {}, // 1: 热歌榜  3778678
    originRanking: {}, // 2: 原创榜  2884035
    upRanking: {} // 3: 飙升榜  19723756
  },
  actions: { 
    getRankingDataAction(ctx) {
      for (let i = 0; i < 4; i++) { 
        const rankingParam = rankingMap[i][0]
        getRankings(rankingParam).then(res => {
          console.log(`${rankingMap[i][1]}的数据${res.playlist}`)
          const rankingName = rankingMap[i][1]
          ctx[rankingName] = res.playlist
        })
      }
    }
  }
})

export {
  rankingStore,
  rankingMap
}
