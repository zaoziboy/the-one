App({
  globalData: {
    userInfo: null,
    callRecords: {}, // 存储小组打call记录
  },
  
  onLaunch() {
    this.initCallRecords();
    this.initTeacherCallData();
  },

  // 初始化打call记录
  initCallRecords() {
    try {
      const callRecords = wx.getStorageSync('groupCallRecords') || {};
      this.globalData.callRecords = callRecords;
    } catch (e) {
      console.log('读取小组打call记录失败', e);
      this.globalData.callRecords = {};
    }
  },

  // 初始化老师打call数据
  initTeacherCallData() {
    try {
      const teacherCallCount = parseInt(wx.getStorageSync('teacherCallCount') || '0');
      const hasTeacherCalled = wx.getStorageSync('hasTeacherCalled') || false;
      
      this.globalData.teacherCallCount = teacherCallCount;
      this.globalData.hasTeacherCalled = hasTeacherCalled;
    } catch (e) {
      console.log('读取老师打call记录失败', e);
      this.globalData.teacherCallCount = 0;
      this.globalData.hasTeacherCalled = false;
    }
  },

  // 保存小组打call记录
  saveCallRecords() {
    try {
      wx.setStorageSync('groupCallRecords', this.globalData.callRecords);
    } catch (e) {
      console.log('保存小组打call记录失败', e);
    }
  },

 
  // 小组打call相关方法
  canCallGroup() {
    const callRecords = this.globalData.callRecords;
    let callCount = 0;
    
    for (let groupId in callRecords) {
      if (callRecords[groupId]) {
        callCount++;
      }
    }
    
    return callCount < 3;
  },

  doCallGroup(groupId) {
    const callRecords = this.globalData.callRecords;
    const currentCallCount = Object.values(callRecords).filter(Boolean).length;
    
    if (currentCallCount >= 3) {
      return {
        success: false,
        message: '每个微信号最多只能给3个小组打call哦！'
      };
    }

    callRecords[groupId] = {
      hasCalled: true,
      callTime: new Date().getTime()
    };
    
    this.globalData.callRecords = callRecords;
    this.saveCallRecords();

    return {
      success: true,
      message: '打call成功！',
      callCount: Object.values(callRecords).filter(Boolean).length
    };
  },

  hasCalledGroup(groupId) {
    return !!this.globalData.callRecords[groupId];
  },

  getGroupCallCount(groupId) {
    let callCount = 0;
    const callRecords = this.globalData.callRecords;
    
    for (let id in callRecords) {
      if (callRecords[id] && parseInt(id) === groupId) {
        callCount++;
      }
    }
    
    return callCount;
  },

  getAllGroupCallCounts() {
    const callRecords = this.globalData.callRecords;
    const callCounts = {};
    
    for (let i = 1; i <= 7; i++) {
      callCounts[i] = 0;
    }
    
    for (let groupId in callRecords) {
      const id = parseInt(groupId);
      if (id >= 1 && id <= 7) {
        callCounts[id] = (callCounts[id] || 0) + 1;
      }
    }
    
    return callCounts;
  },

});
