//answer.js
var util = require('../../utils/util.js')

var touchDot = 0;//触摸时的原点 
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动 
var interval = "";// 记录/清理时间记录 

var app = getApp()
Page({
  data: {
    motto: '研坛论道',
    userInfo: {},
    item: {}
  },
  //事件处理函数
  onLoad: function (options) {
    let item_value = JSON.parse(options.jsonstr);
    this.setData({ item: item_value });
    console.log('onLoad');
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },

  onShow: function (options) {
    var that = this;
    var db = wx.cloud.database();
    db.collection('posts').doc(that.data.item._id).get({
      success(res) {
        console.log('follow-res', res);
        // res.data 包含该记录的数据
        that.setData({ item: res.data });
      }
    });
    console.log('onShow');
  },

  tapName: function(event){
    console.log(event)
  },

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
    if (touchMove - touchDot <= -40 && time < 20) {
      wx.switchTab({
        url: '../posts/posts'
      });
    }
    // 向右滑动 
    if (touchMove - touchDot >= 40 && time < 20) {
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

  // 关注按钮事件
  add_like: function (event){
    var itemc = this.data.item;
    var that = this;
    var db = wx.cloud.database();
    wx.cloud.callFunction({
      // 云函数名称
      name: 'update_post_like',
      // 传给云函数的参数
      data: {
        item_cloud: itemc
      },
      success(res) {
        // console.log('res', res);
        db.collection('posts').doc(itemc._id).get({
          success(res) {
            // res.data 包含该记录的数据
            console.log('like-res', res);
            that.setData({ item: res.data });
          }
        })

      },
      fail: console.error
    });
    // 向数据库添加我点赞过的帖子
    var posts_agreed = that.data.item;
    wx.getUserInfo({
      success(res) {
        const userInfo = res.userInfo
        const nickName = userInfo.nickName
        const avatarUrl = userInfo.avatarUrl
        const gender = userInfo.gender // 性别 0：未知、1：男、2：女
        const province = userInfo.province
        const city = userInfo.city
        const country = userInfo.country;
        posts_agreed.owner = nickName;
      }
    });
    db.collection('person').add({
      // data 字段表示需新增的 JSON 数据
      data: posts_agreed,
      success: res => {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res);
      },
      fail(res) {
        console.log(res);
      }
    });
  },

  // 跟帖按钮事件
  add_follow: function (event){
    var itemc = this.data.item;
    // var dateString = JSON.stringify(itemc.)
    var that = this;
    var db = wx.cloud.database();
    wx.cloud.callFunction({
      // 云函数名称
      name: 'update_post_follow',
      // 传给云函数的参数
      data: {
        item_cloud: itemc
      },
      success(res) {
        // console.log('res', res);
        db.collection('posts').doc(itemc._id).get({
          success(res) {
            console.log('follow-res', res);
            // res.data 包含该记录的数据
            that.setData({ item: res.data });
          }
        });
        var type = "follow";
        var str = JSON.stringify(itemc);
        wx.navigateTo({
          url: '../release/release?type=' + type+'&item='+str,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
        
      },
      fail: console.error
    });
    
  },


})
