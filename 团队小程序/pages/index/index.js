// pages/index/index.js
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    latitude: 39.9042,
    longitude: 116.4074,
    markers: [],
    showList: false,
    nearbyDiscoveries: [],
    userLocation: null
  },

  onLoad: function () {
    this.getUserLocation()
    this.loadDiscoveries()
  },

  onShow: function() {
    // 页面显示时刷新数据
    this.loadDiscoveries()
  },

  onPullDownRefresh: function() {
    // 下拉刷新
    this.loadDiscoveries(() => {
      wx.stopPullDownRefresh()
    })
  },

  getUserLocation: function() {
    const that = this
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        that.setData({
          userLocation: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
      fail: function() {
        wx.showToast({
          title: '获取位置失败',
          icon: 'none'
        })
      }
    })
  },

  loadDiscoveries: function(callback) {
    // 模拟从服务器获取数据
    const discoveries = [
      {
        id: 1,
        latitude: 39.9042,
        longitude: 116.4074,
        title: "井盖上的小涂鸦",
        description: "十字路口东南角的井盖上，有人画了一个笑脸",
        imageUrl: "/images/sample1.jpg",
        date: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3小时前
        reactions: {
          curious: 12,
          seen: 5
        }
      },
      {
        id: 2,
        latitude: 39.9082,
        longitude: 116.4114,
        title: "路灯下的蒲公英",
        description: "每天傍晚6点，这盏路灯下的蒲公英会发亮",
        imageUrl: "/images/sample2.jpg",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1天前
        reactions: {
          curious: 23,
          seen: 8
        }
      },
      {
        id: 3,
        latitude: 39.9022,
        longitude: 116.4054,
        title: "墙上的猫脚印",
        description: "老城区的红砖墙上有一串彩色的猫脚印涂鸦",
        imageUrl: "/images/sample1.jpg",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2天前
        reactions: {
          curious: 7,
          seen: 3
        }
      }
    ]

    // 计算距离
    if (this.data.userLocation) {
      discoveries.forEach(item => {
        item.distance = util.calculateDistance(
          this.data.userLocation.latitude,
          this.data.userLocation.longitude,
          item.latitude,
          item.longitude
        ) / 1000; // 转换为公里
        item.distance = item.distance.toFixed(1);
        item.dateText = util.formatRelativeTime(item.date);
      })
    }

    // 按距离排序
    discoveries.sort((a, b) => a.distance - b.distance);

    this.setData({
      nearbyDiscoveries: discoveries,
      markers: discoveries.map(item => ({
        id: item.id,
        latitude: item.latitude,
        longitude: item.longitude,
        iconPath: '/images/marker.png',
        width: 30,
        height: 30,
        callout: {
          content: item.title,
          color: '#4A90E2',
          fontSize: 14,
          borderRadius: 4,
          padding: 5,
          display: 'ALWAYS'
        }
      }))
    })

    // 保存到全局数据
    app.globalData.discoveries = discoveries

    if (callback) {
      callback()
    }
  },

  onMarkerTap: function (e) {
    const markerId = e.markerId
    const discovery = this.data.nearbyDiscoveries.find(item => item.id === markerId)
    if (discovery) {
      wx.navigateTo({
        url: `/pages/detail/detail?id=${discovery.id}`
      })
    }
  },

  goToAddPage: function () {
    wx.navigateTo({
      url: '/pages/add/add'
    })
  },

  toggleListView: function () {
    this.setData({
      showList: !this.data.showList
    })
  },

  viewDiscovery: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  }
})