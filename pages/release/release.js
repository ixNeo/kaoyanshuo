//index.js
const app = getApp()

Page({
  data: {
    title: "",
    textarea: "",
    tag: [],
    tag_num: [1],
    hiddenmodalput: true,
    //可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框
    clear_input: "",
    imageList: [],
    // jktian-add
    type: '',
    major_item: {},
    follow_item: {},
    user_name: ''
  },

  onLoad: function (options) {
    var that = this;
    let type_trans = options.type;
    this.setData({type:type_trans});
    if(type_trans!="new"){
      let item_value = JSON.parse(options.item);
      this.setData({ major_item: item_value });
      console.log('major-post', that.data.major_item);
    }
    //调用应用实例的方法获取全局数据
    // this.getData();
    wx.getUserInfo({
      success(res) {
        const userInfo = res.userInfo
        const nickName = userInfo.nickName
        that.setData({ user_name: nickName });
      }
    });
  },



  //跳转到发送
  Next: function (e) {

  },
  //获取标题
  getTitle: function (e) {
    this.setData({
      title: e.detail.value
    });
  },
  //获取文本内容
  getTextarea: function (e) {
    this.setData({
      textarea: e.detail.value
    });
  },
  //添加跳出框
  modalinput: function (e) {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //重置按钮  
  cancel: function () {
    this.setData({
      clear_input: "",
      "tag[0]":"",
      "tag[1]":"",
      "tag[2]":""
    });
  },
  //确认  
  confirm: function () {
    this.setData({
      hiddenmodalput: true
    })
  },
  //获取标签1
  getTag1: function (e) {
    var index="tag[0]";
    this.setData({
      [index]: e.detail.value
    })
  },
  //获取标签2
  getTag2: function (e) {
    var index = "tag[1]";
    this.setData({
      [index]: e.detail.value
    })
  },
  //获取标签3
  getTag3: function (e) {
    var index = "tag[2]";
    this.setData({
      [index]: e.detail.value
    })
  },
  
  uploadPhoto: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        upload(that, tempFilePaths);
      }
    })
  },

  upload: function (page, path) {
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    }),
      wx.uploadFile({
        url: constant.SERVER_URL + "/FileUploadServlet",
        filePath: path[0],
        name: 'file',
        header: { "Content-Type": "multipart/form-data" },
        formData: {
          //和服务器约定的token, 一般也可以放在header中
          'session_token': wx.getStorageSync('session_token')
        },
        success: function (res) {
          console.log(res);
          if (res.statusCode != 200) {
            wx.showModal({
              title: '提示',
              content: '上传失败',
              showCancel: false
            })
            return;
          }
          var data = res.data
          page.setData({  //上传成功修改显示头像
            src: path[0]
          })
        },
        fail: function (e) {
          console.log(e);
          wx.showModal({
            title: '提示',
            content: '上传失败',
            showCancel: false
          })
        },
        complete: function () {
          wx.hideToast();  //隐藏Toast
        }
      })
  },

  /* 点击发送按钮，上传数据*/
  insert_post: function (e) {
    var that = this;
    var mname = that.data.user_name;
    const db = wx.cloud.database();
    var data_item = {
      // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
      user_name: mname,
      user_head: "../../images/icon1.jpeg",
      post_brief: that.data.title,
      post_content: that.data.textarea,
      post_tags: this.data.tag,
      like_count: 0,
      follow_count: 0,
      follow_posts: []
    };
    var follow_item = {
      // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
      user_name: mname,
      user_head: "../../images/icon1.jpeg",
      follow_content: that.data.title + '. '+ that.data.textarea,
    };
    that.setData({follow_item: follow_item});
    if(that.data.type=="new"){
      db.collection('posts').add({
        // data 字段表示需新增的 JSON 数据
        data: data_item,
        success: res => {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          wx.showToast({
            title: '上传成功',
          });
          console.log(res);
          wx.navigateBack({
            
          })
        },
        fail(res) {
          console.log(res);
        }
      });
     
    }else{
      wx.cloud.callFunction({
        // 云函数名称
        name: 'add_follow_post',
        // 传给云函数的参数
        data: {
          major_item: that.data.major_item,
          follow_item: that.data.follow_item
        },
        success(res) {
          console.log('res', res);
          // db.collection('posts').doc(itemc._id).get({
          //   success(res) {
          //     // res.data 包含该记录的数据
          //     console.log('like-res', res);
          //     that.setData({ item: res.data });
          //   }
          // })
          wx.showToast({
            title: '上传成功',
          });
          console.log(res);
          wx.navigateBack({
          })
        },
        fail: console.error
      });
    }

  },

})