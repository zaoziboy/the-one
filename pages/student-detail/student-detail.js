Page({
  data: {
    student: {},
    groupId: 1,
    showDetails: false
  },

  onLoad(options) {
    if (options.studentData) {
      const student = JSON.parse(decodeURIComponent(options.studentData));
      const groupId = parseInt(options.groupId);
      
      this.setData({
        student,
        groupId
      });
    }
  },

  toggleDetails() {
    this.setData({
      showDetails: !this.data.showDetails
    });
  }
});
