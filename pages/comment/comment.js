//index.js

Page({
  data: {
    navTab: ["跟帖"],
    currentNavtab: "0"
  },
  onLoad: function () {

  },
  switchTab: function (e) {
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx
    });
  }
})
