//discovery.js


var touchDot = 0;//触摸时的原点 
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动 
var interval = "";// 记录/清理时间记录 



Page({
  data: {
    currentNavtab: "0",
    imgUrls: [
      '../../images/Un1.jpeg',
      '../../images/Un2.jpeg',
      '../../images/Un3.jpeg'
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    feed: [],
    feed_length: 0,
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    //this.refresh();
  },
 
  bindQueTap1: function () {
    wx.navigateTo({
      url: 'academies/SSDUT/SSDUT'
    })
  },
  bindQueTap2: function () {
    wx.navigateTo({
      url: 'academies/CSDUT/CSDUT'
    })
  },
  bindQueTap3: function () {
    wx.navigateTo({
      url: 'academies/CEDUT/CEDUT'
    })
  },
  bindQueTap4: function () {
    wx.navigateTo({
      url: 'academies/FLDUT/FLDUT'
    })
  },
  bindQueTap: function () {
    wx.navigateTo({
      url: '../posts/posts'
    })
  },

  //////////////////////
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点 
    // 使用js计时器记录时间  
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸移动事件 
  touchMove: function (e) {
    var touchMove = e.touches[0].pageX;
    console.log("touchMove:" + touchMove + " touchDot:" + touchDot + " diff:" + (touchMove - touchDot));
    // 向左滑动  
    if (touchMove - touchDot <= -40 && time < 10) {
      wx.switchTab({
        url: '../mine/mine'
      });
    }
    // 向右滑动 
    if (touchMove - touchDot >= 40 && time < 10) {
      console.log('向右滑动');
      wx.switchTab({
        url: '../index/index'
      });
    }
  },
  // 触摸结束事件 
  touchEnd: function (e) {
    clearInterval(interval); // 清除setInterval 
    time = 0;
  }


})
