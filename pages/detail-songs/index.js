// pages/detail-songs/index.js
import { rankingStore, playerStore } from '../../store/index'
import { getSongMenuDetail } from '../../service/api_music'  

Page({
  data: {
    type: "",
    ranking: "",
    songInfo: {}
  },
  onLoad: function (options) { 
    //options可以接收url参数
    console.log('options',options) 
    //  榜单： {ranking: "hotRanking", type: "rank"}
    //歌单： {id: "2829269414", type: "menu"}
    const type = options.type
    this.setData({ type })

    if (type === "menu") {
      const id = options.id
      getSongMenuDetail(id).then(res => {
        console.log('监听歌单menu拿到的数据',res) 
        this.setData({ songInfo: res.playlist })
      })
    } else if (type === "rank") {
      const ranking = options.ranking
      this.setData({ ranking })

      // 1.获取数据 例如点击热歌榜，就是监听共享数据 hotRanking 
      rankingStore.onState(ranking, this.getRankingDataHanlder)
    }
  },

  handleSongItemClick: function(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playListSongs", this.data.songInfo.tracks)
    playerStore.setState("playListIndex", index)
  },


  onUnload: function () {
    if (this.data.ranking) {
      rankingStore.offState(this.data.ranking, this.getRankingDataHanlder)
    }
  },

  getRankingDataHanlder: function(res) {
    console.log('监听ranking拿到的数据',res) 
    this.setData({ songInfo: res })
  } 
})