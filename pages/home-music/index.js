// pages/home-music/index.js
import { rankingStore, rankingMap, playerStore } from '../../store/index'

import { getBanners, getSongMenu } from '../../service/api_music'
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'

const throttleQueryRect = throttle(queryRect, 1000,{ leading: true, trailing: true })  

Page({ 
  data: {
    swiperHeight: 0,
    banners: [],
    hotSongMenu: [],
    recommendSongMenu: [],
    recommendSongs: [],
    rankings: { 0: {}, 2: {}, 3: {} },//保障各个榜单数据的顺序

    currentSong: {},
    isPlaying: false,
    playAnimState: "paused" 
  },

  onLoad: function (options) { 
    playerStore.dispatch("playMusicWithSongIdAction", { id: 1842025914 })

    // 获取页面数据
    this.getPageData() 

    // 发起共享数据的请求
    rankingStore.dispatch("getRankingDataAction") 

    // 从store获取共享的数据
    this.setupPlayerStoreListener()
  },

  // 网络请求
  getPageData: function() {
    getBanners().then(res => {
      this.setData({ banners: res.banners })
    })

    getSongMenu().then(res => {
      console.log('获取热门歌单',res)
      this.setData({ hotSongMenu: res.playlists })
    })

    getSongMenu("华语").then(res => {
      console.log('获取推荐歌单',res)

      this.setData({ recommendSongMenu: res.playlists })
    })
  },

  // 事件处理 点击首页歌单推荐跳转功能 
  handleSearchClick: function() {
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },
 // 获取图片的高度
  handleSwiperImageLoaded: function() { 
    throttleQueryRect(".swiper-image").then(res => {
      
      const rect = res[0]
      console.log('高度',rect.height)
      this.setData({ swiperHeight: rect.height })
    },err=>{
      console.log('11',err);
    })
  },
// 3.点击推荐歌曲的更多 跳转到 detail-song  
  handleMoreClick: function() { 
    this.navigateToDetailSongsPage("hotRanking")
  },
// 巅峰榜点击事件
  handleRankingItemClick: function(event) {
    const idx = event.currentTarget.dataset.idx
    const rankingName = rankingMap[idx][1]
    this.navigateToDetailSongsPage(rankingName)
  },
 // 跳转到歌曲列表页  detail-songs
  navigateToDetailSongsPage: function(rankingName) {
    wx.navigateTo({
      url: `/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
    })
  },
// 点击推荐歌曲 进行播放歌曲操作
  handleSongItemClick: function(event) {
    const index = event.currentTarget.dataset.index
    console.log('点击推荐歌曲',index,this.data.recommendSongs) 

    playerStore.setState("playListSongs", this.data.recommendSongs)
    playerStore.setState("playListIndex", index) 
  },

  handlePlayBtnClick: function() {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
  }, 

  // 卸载页面
  onUnload: function () {
    // rankingStore.offState("newRanking", this.getNewRankingHandler)
  },

  setupPlayerStoreListener: function() {
    // 1.排行榜监听
    rankingStore.onState("hotRanking", (res) => {
      console.log('排行榜监听排序热歌版',res)
       if (!res.tracks) return 
      //  截取推荐歌曲 前六项
      const recommendSongs = res.tracks.slice(0, 6)
      this.setData({ recommendSongs })
    })
    rankingStore.onState("newRanking", this.getRankingHandler(0))
    rankingStore.onState("originRanking", this.getRankingHandler(2))
    rankingStore.onState("upRanking", this.getRankingHandler(3))

    // 2.播放器监听
    playerStore.onStates(["currentSong", "isPlaying"], ({currentSong, isPlaying}) => {
      if (currentSong) this.setData({ currentSong })
      if (isPlaying !== undefined) {
        this.setData({   
          isPlaying, 
          playAnimState: isPlaying ? "running": "paused" 
        })
      }
    })
  },

  getRankingHandler: function(idx) {
    return (res) => {
      console.log('排行榜监听其余情况',res)
      if (Object.keys(res).length === 0) return
      const name = res.name
      const coverImgUrl = res.coverImgUrl
      const playCount = res.playCount
      const songList = res.tracks.slice(0, 3)
      const rankingObj = {name, coverImgUrl, playCount, songList}
      const newRankings = { ...this.data.rankings, [idx]: rankingObj}// [idx] 表明是动态的key，idx
      this.setData({ 
        rankings: newRankings
      })
    }
  }
})