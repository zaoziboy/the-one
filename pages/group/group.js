const app = getApp();

Page({
  data: {
    groupId: 1,
    members: [],
    hasBeenCalled: false,
    callButtonText: '为小组打call',
    callTip: '',
    callLimited: false
  },

  onLoad(options) {
    const groupId = parseInt(options.groupId);
    this.setData({ groupId });
    this.loadGroupMembers(groupId);
    this.checkCallStatus(groupId);
  },

  onShow() {
    // 每次显示页面时检查打call状态
    const { groupId } = this.data;
    this.checkCallStatus(groupId);
  },

  loadGroupMembers(groupId) {
    // 模拟数据（保持原有代码不变）
    const mockMembers = {
      1: [
        { id: 1, name: '张三', role: '组长' },
        { id: 2, name: '李四', role: '副组长' },
        { id: 3, name: '王五', role: '成员' },
        { id: 4, name: '赵六', role: '成员' },
        { id: 5, name: '钱七', role: '成员' }
      ],
      2: [
        { id: 6, name: '孙八', role: '组长' },
        { id: 7, name: '周九', role: '副组长' },
        { id: 8, name: '吴十', role: '成员' },
        { id: 9, name: '郑一', role: '成员' },
        { id: 10, name: '王二', role: '成员' },
        { id: 11, name: '李三', role: '成员' }
      ],
      3: [
        { id: 12, name: '陈四', role: '组长' },
        { id: 13, name: '刘五', role: '副组长' },
        { id: 14, name: '杨六', role: '成员' },
        { id: 15, name: '黄七', role: '成员' },
        { id: 16, name: '朱八', role: '成员' }
      ],
      4: [
        { id: 17, name: '林九', role: '组长' },
        { id: 18, name: '何十', role: '副组长' },
        { id: 19, name: '高一一', role: '成员' },
        { id: 20, name: '梁一二', role: '成员' },
        { id: 21, name: '宋一三', role: '成员' },
        { id: 22, name: '唐一四', role: '成员' }
      ],
      5: [
        { id: 23, name: '许一五', role: '组长' },
        { id: 24, name: '邓一六', role: '副组长' },
        { id: 25, name: '韩一七', role: '成员' },
        { id: 26, name: '冯一八', role: '成员' },
        { id: 27, name: '曹一九', role: '成员' }
      ],
      6: [
        { id: 28, name: '彭二十', role: '组长' },
        { id: 29, name: '曾二一', role: '副组长' },
        { id: 30, name: '肖二二', role: '成员' },
        { id: 31, name: '田二三', role: '成员' },
        { id: 32, name: '董二四', role: '成员' },
        { id: 33, name: '袁二五', role: '成员' }
      ],
      7: [
        { id: 34, name: '潘二六', role: '组长' },
        { id: 35, name: '于二七', role: '副组长' },
        { id: 36, name: '蒋二八', role: '成员' },
        { id: 37, name: '蔡二九', role: '成员' },
        { id: 38, name: '余三十', role: '成员' }
      ]
    };

    this.setData({
      members: mockMembers[groupId] || []
    });
  },

  // 检查打call状态
  checkCallStatus(groupId) {
    const hasBeenCalled = app.hasCalledGroup(groupId);
    const canCall = app.canCallGroup();
    
    let callButtonText = '为小组打call';
    let callTip = '';
    let callLimited = false;

    if (hasBeenCalled) {
      callButtonText = '已打call ✓';
      callTip = '你已经为这个小组打过call了！';
    } else if (!canCall) {
      callButtonText = '打call次数已用完';
      callTip = '每个微信号最多只能给3个小组打call哦！';
      callLimited = true;
    }

    this.setData({
      hasBeenCalled,
      callButtonText,
      callTip,
      callLimited
    });
  },

  // 处理打call
  handleCall() {
    const { groupId } = this.data;
    
    if (!app.canCallGroup()) {
      wx.showToast({
        title: '打call次数已用完',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    wx.showLoading({
      title: '打call中...'
    });

    // 模拟网络延迟
    setTimeout(() => {
      const result = app.doCallGroup(groupId);
      
      wx.hideLoading();

      if (result.success) {
        wx.showToast({
          title: result.message,
          icon: 'success',
          duration: 2000
        });

        // 更新页面状态
        this.checkCallStatus(groupId);
        
        // 可以在这里添加打call动画效果
        this.showCallAnimation();
      } else {
        wx.showToast({
          title: result.message,
          icon: 'none',
          duration: 2000
        });
      }
    }, 500);
  },

  // 打call动画效果
  showCallAnimation() {
    // 简单的震动反馈
    wx.vibrateShort({
      type: 'light'
    });
  },

  showStudentDetail(e) {
    const student = e.currentTarget.dataset.student;
    wx.navigateTo({
      url: `/pages/student-detail/student-detail?studentData=${encodeURIComponent(JSON.stringify(student))}&groupId=${this.data.groupId}`
    });
  }
});
