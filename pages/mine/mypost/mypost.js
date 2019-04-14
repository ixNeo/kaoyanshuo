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
    list: [],
  },

  onLoad: function () {
    wx.cloud.init();
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../../chooseLib/chooseLib',
      })
      return
    }
    console.log('onLoad');

  },

  onShow: function () {
    var that = this;
    //调用应用实例的方法获取全局数据
    // this.getData();
    const db = wx.cloud.database();
    var content_array = new Array();
    // var posts_array = [];
    wx.getUserInfo({
      success(res) {
        const userInfo = res.userInfo
        const nickName = userInfo.nickName
        console.log('getusr-info success', nickName);
        db.collection('posts').where({
          user_name: nickName,
        })
          .get({
            success(res) {
              // res.data 是包含以上定义的两条记录的数组
              content_array = res.data;
              that.setData({
                feed: content_array,
              });
              console.log('res-data', res.data);
            }
          });
      }
    });
    console.log('onShow');
  },

  upper: function () {
    wx.showNavigationBarLoading()
    this.refresh();
    console.log("upper");
    setTimeout(function () { wx.hideNavigationBarLoading(); wx.stopPullDownRefresh(); }, 2000);
  },
  lower: function (e) {
    wx.showNavigationBarLoading();
    var that = this;
    setTimeout(function () { wx.hideNavigationBarLoading(); that.nextLoad(); }, 1000);
    console.log("lower")
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
      url: '../../posts/posts?jsonstr=' + str,
    })
  },

  //网络请求数据, 实现首页刷新
  refresh0: function () {
    var index_api = '';
    util.getData(index_api)
      .then(function (data) {
        //this.setData({
        //
        //});
        console.log(data);
      });
  },

  //使用本地 fake 数据实现刷新效果
  getData: function () {
    var feed = util.getData2();
    console.log("loaddata");
    var feed_data = feed.data;
    this.setData({
      feed: feed_data,
      feed_length: feed_data.length
    });
  },
  refresh: function () {
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 2000
    });
    var feed = util.getData2();
    console.log("loaddata");
    var feed_data = feed.data;
    this.setData({
      feed: feed_data,
      feed_length: feed_data.length
    });
    setTimeout(function () {
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 2000
      })
    }, 3000)

  },

  //使用本地 fake 数据实现继续加载效果
  nextLoad: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 3000
    })
    var next = util.getNext();
    console.log("continueload");
    var next_data = next.data;
    this.setData({
      feed: this.data.feed.concat(next_data),
      feed_length: this.data.feed_length + next_data.length
    });
    setTimeout(function () {
      wx.showToast({
        title: '加载成功',
        icon: 'success',
        duration: 2000
      })
    }, 3000)
  }
})
