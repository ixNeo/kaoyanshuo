//index.js

var app = getApp()

var touchDot = 0;//触摸时的原点 
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动 
var interval = "";// 记录/清理时间记录 

Page({
  data: {
    // posts: [],
    feed: [],
    feed_length: 0,
    searchValue: '',
    search_res: '',
    list: [],
  },

  onLoad: function () {
    wx.cloud.init();
    console.log('onLoad');

  },

  onShow: function () {
    var that = this;
    //调用应用实例的方法获取全局数据
    // this.getData();
    const db = wx.cloud.database();
    var content_array = new Array();
    // var posts_array = [];
    db.collection('posts').get().then(res => {
      // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
      content_array = res.data;
      this.setData({
        feed: content_array,
      });
    });
    console.log('onShow');
  },

 

/*方案一：跳转到comment
bindItemTap: function () {
   wx.navigateTo({
     url: '../comment/comment'
   })
},*/
/*方案二：跳转到posts*/
bindItemTap: function (event) {
  let str = JSON.stringify(event.currentTarget.dataset.itemValue);
    wx.navigateTo({
      url: '../posts/posts?jsonstr='+str,
    })
},

  //网络请求数据, 实现首页刷新

/////////////手势操作/////////
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
        url: '../material/material'
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
  },

  searchValueInput: function (e) {
    var value = e.detail.value;
    this.setData({
      searchValue: value,
    });
  },


  start_search_db: function (e) {
    var keyword = this.data.searchValue;
    wx.navigateTo({
      url: '../search/search?searchValue=' + keyword,
    });
  },

  //发帖
  onPostClick: function (e) {
    var type = "new";
    wx.navigateTo({
      url: '../release/release?type='+ type,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }

})
