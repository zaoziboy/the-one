// pages/add/add.js
const app = getApp()

Page({
  data: {
    imageTempPath: '',
    title: '',
    description: '',
    locationText: '正在获取位置...',
    latitude: null,
    longitude: null,
    isSubmitting: false
  },

  onLoad: function () {
    this.getLocation()
  },

  chooseImage: function () {
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.setData({
          imageTempPath: res.tempFilePaths[0]
        })
      }
    })
  },

  getLocation: function () {
    const that = this
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        
        // 这里简化处理，实际应该调用逆地理编码API
        that.setData({
          locationText: '北京市朝阳区某处'
        })
      },
      fail: function () {
        wx.showToast({
          title: '获取位置失败',
          icon: 'none'
        })
        that.setData({
          locationText: '位置获取失败'
        })
      }
    })
  },

  onTitleInput: function (e) {
    this.setData({
      title: e.detail.value
    })
  },

  onDescriptionInput: function (e) {
    this.setData({
      description: e.detail.value
    })
  },

  submitDiscovery: function () {
    if (this.data.isSubmitting) {
      return
    }
    
    if (!this.data.imageTempPath) {
      wx.showToast({
        title: '请上传图片',
        icon: 'none'
      })
      return
    }

    if (!this.data.title.trim()) {
      wx.showToast({
        title: '请填写标题',
        icon: 'none'
      })
      return
    }

    this.setData({
      isSubmitting: true
    })

    wx.showLoading({
      title: '发布中...',
    })

    // 模拟上传过程
    setTimeout(() => {
      // 生成新的发现项
      const newDiscovery = {
        id: Date.now(), // 使用时间戳作为ID
        title: this.data.title,
        description: this.data.description,
        imageUrl: this.data.imageTempPath,
        latitude: this.data.latitude,
        longitude: this.data.longitude,
        date: new Date(),
        reactions: {
          curious: 0,
          seen: 0
        }
      }
      
      // 添加到全局数据
      if (!app.globalData.discoveries) {
        app.globalData.discoveries = []
      }
      app.globalData.discoveries.unshift(newDiscovery)
      
      wx.hideLoading()
      this.setData({
        isSubmitting: false
      })
      
      wx.showToast({
        title: '发布成功',
        icon: 'success',
        duration: 1500
      })
      
      // 返回首页
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }, 2000)
  }
})