//answer.js

var touchDot = 0;//触摸时的原点 
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动 
var interval = "";// 记录/清理时间记录 

var app = getApp();
var num = 0;
Page({
  data: {
    motto: '研坛论道',
    userInfo: {},
    item: {},
    viewBg: 'green',
    like_click_num: 0
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
    this.list = [{
      ///'author': 'xiongcf',
      //'info': 'just for example praise list item.',
      //'praise': 0,
      'hasChange': false
    }]
    this.setData({
      list: this.list
    });
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
    if(that.data.like_click_num % 2==0){
      this.setData({
        viewBg: 'green'
      });
    }else{
      this.setData({
        viewBg: 'gray'
      });
    }

    console.log('onShow');
    console.log('num: ', num);
    console.log('data-click-num',that.data.like_click_num);
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

  ////////////////////////////关注按钮事件///////////////////////////////////////////
  add_like: function (e){
    ///点赞
    var that = this;
    var num = that.data.like_click_num;
    that.setData({like_click_num:num+1});
    num = num +1;
    var result = num / 2;
    var itemc = this.data.item;
    var that = this;
    var db = wx.cloud.database();
    if (num % 2 == 0) {
      //希望添加取消关注的数据库操作///
      wx.cloud.callFunction({
        // 云函数名称
        name: 'rm_post_like',
        // 传给云函数的参数
        data: {
          item_cloud: itemc
        },
        success(res) {
          // console.log('old-rm-like-cnt', itemc.like_count);
          itemc.like_count = itemc.like_count-1;
          that.setData({ item: itemc });
          // console.log('rm-like-cnt', that.data.item.like_count);
        },
        fail: console.error
      });
      this.setData({
        viewBg: 'green',
      })
    } else {
    ///////////////////////////////////////////////////////////////////
      wx.cloud.callFunction({
        // 云函数名称
        name: 'update_post_like',
        // 传给云函数的参数
        data: {
          item_cloud: itemc
        },
        success(res) {
          itemc.like_count = itemc.like_count+1;
          that.setData({ item: itemc});
          // console.log('res', res);
        },
        fail: console.error
      });
      // 向数据库添加我点赞过的帖子
      var posts_agreed = that.data.item;
      delete posts_agreed._id;
      delete posts_agreed._openid;
      wx.getUserInfo({
        success(res) {
          const userInfo = res.userInfo
          const nickName = userInfo.nickName
          posts_agreed.owner = nickName;
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
        }
      });
    //////////////////////////////////////////////////////////////////////////////////
      this.setData({
        viewBg: 'gray'
      })
    }

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
  changeBg() {
    num++;
    var result = num / 2;
    if (num % 2 == 0) {
      this.setData({
        viewBg: 'green'
      })
    } else {
      this.setData({
        viewBg: 'blue'
      })
    }
    console.log(num)
    console.log(result)
  }



})
