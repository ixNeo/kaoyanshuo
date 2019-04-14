// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command
var ret_item;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log('begin add_post_like')
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
  try {
    await db.collection('posts').where({
      _id: event.item_cloud._id
    })
      .update({
        data: {
          like_count: _.inc(1)
        },
      })
  } catch (e) {
    console.error(e)
  };

}