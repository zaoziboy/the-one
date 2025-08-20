// pages/assistant-detail/assistant-detail.js
Page({
  data: {
    assistant: {
      name: "张助教",
      title: "班级助教",
      avatar: "",//todo,用于示范如何添加多媒体资源
      description: "负责班级日常管理和学习指导",
      detail: ""
    }
  },

  onLoad: function(options) {
    // 如果需要从首页传递数据，可以在这里处理
    // const app = getApp();
    // this.setData({
    //   assistant: app.globalData.assistant
    // });
  }
});