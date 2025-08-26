// pages/detail/detail.js
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    discovery: null,
    similarDiscoveries: []
  },

  onLoad: function (options) {
    const id = parseInt(options.id)
    this.loadDiscoveryDetail(id)
    this.loadSimilarDiscoveries(id)
  },

  loadDiscoveryDetail: function (id) {
    // 从全局数据中查找
    const discovery = app.globalData.discoveries.find(item => item.id === id)
    
    if (discovery) {
      // 计算距离
      if (app.globalData.userLocation) {
        discovery.distance = util.calculateDistance(
          app.globalData.userLocation.latitude,
          app.globalData.userLocation.longitude,
          discovery.latitude,
          discovery.longitude
        ) / 1000; // 转换为公里
        discovery.distance = discovery.distance.toFixed(1);
      }
      
      discovery.dateText = util.formatRelativeTime(discovery.date);
      
      this.setData({
        discovery: discovery
      })
    } else {
      // 如果没有找到，使用模拟数据
      const discoveries = {
        1: {
          id: 1,
          title: "井盖上的小涂鸦",
          description: "十字路口东南角的井盖上，有人画了一个笑脸，每次路过看到都会心情变好。不知道是谁画的，但感谢这个小小的善意。",
          imageUrl: "/images/sample1.jpg",
          distance: 0.2,
          dateText: "3小时前",
          reactions: {
            curious: 12,
            seen: 5
          }
        },
        2: {
          id: 2,
          title: "路灯下的蒲公英",
          description: "每天傍晚6点，这盏路灯下的蒲公英会发亮，像是被施了魔法一样。我观察了一周，只有这盏灯下的蒲公英会这样。",
          imageUrl: "/images/sample2.jpg",
          distance: 0.5,
          dateText: "昨天",
          reactions: {
            curious: 23,
            seen: 8
          }
        }
      }
      
      this.setData({
        discovery: discoveries[id] || discoveries[1]
      })
    }
  },

  loadSimilarDiscoveries: function (currentId) {
    // 获取除了当前发现外的其他发现作为类似发现
    const similar = app.globalData.discoveries 
      ? app.globalData.discoveries.filter(item => item.id !== currentId).slice(0, 3)
      : []
    
    this.setData({
      similarDiscoveries: similar
    })
  },

  addReaction: function (e) {
    const type = e.currentTarget.dataset.type
    const discovery = this.data.discovery
    
    if (discovery) {
      const newCount = discovery.reactions[type] + 1
      
      // 更新全局数据
      if (app.globalData.discoveries) {
        const index = app.globalData.discoveries.findIndex(item => item.id === discovery.id)
        if (index !== -1) {
          app.globalData.discoveries[index].reactions[type] = newCount
        }
      }
      
      this.setData({
        [`discovery.reactions.${type}`]: newCount
      })
      
      wx.showToast({
        title: type === 'curious' ? '标记为好奇' : '标记为见过',
        icon: 'success'
      })
    }
  }
})