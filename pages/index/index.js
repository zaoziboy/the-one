const app = getApp();

Page({
  data: {
    assistant: {
      name: "张助教",
      title: "班级助教",
      avatar: "/images/assistant-avatar.png",
      description: "负责班级日常管理和学习指导",
      detail: ""
    },
    groups: [
      { id: 1, name: '第一小组', memberCount: 6 },
      { id: 2, name: '第二小组', memberCount: 6 },
      { id: 3, name: '第三小组', memberCount: 6 },
      { id: 4, name: '第四小组', memberCount: 6 },
      { id: 5, name: '第五小组', memberCount: 6 },
      { id: 6, name: '第六小组', memberCount: 5},
      { id: 7, name: '第七小组', memberCount: 5 }
    ],
    groupCallCounts: {},
    teacherCallCount: 0,
    showTeacherCallTip: false,
    teacherCallTipTimer: null
  },

  onLoad() {
    this.loadGroupCallCounts();
    this.loadTeacherCallCount();
  },

  onShow() {
    this.loadGroupCallCounts();
    this.loadTeacherCallCount();
  },

  goToAssistantDetail() {
    wx.navigateTo({
      url: '/pages/assistant-detail/assistant-detail',
    });
  },

  // 加载小组打call数量
  loadGroupCallCounts() {
    const callCounts = app.getAllGroupCallCounts();
    this.setData({
      groupCallCounts: callCounts
    });
  },


  // 小组页面跳转
  goToGroup(e) {
    const groupId = e.currentTarget.dataset.groupid;
    wx.navigateTo({
      url: `/pages/group/group?groupId=${groupId}`
    });
  },

  // 页面点击事件监听
  onPageTap(e) {
    this.handlePageTap(e);
  }
});
