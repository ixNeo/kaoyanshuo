* content
{:toc}

# 简介

微信小程序--研谈论道

基于**王ZY**的版本, 未加入新帖子界面的更新

# done
- 论坛界面和后端的连接
　　　　- 直接编写json文件，然后上传到云开发中即可
- 某一帖子的界面．和后端的连接
　　　　- 此界面下，关注代表点赞，跟帖代表新回答．点击后对应数字会变，和后端连接
- 搜索界面和后端的连接．
　　　　- 支持搜索内容，摘要，标签，发帖人姓名．未区分，未排名

# todo
 1. 发帖和跟帖．和后端的连接
 2. 我的点赞，我的回答中可看见历史记录
 3. 资源界面．下载上传
 4. 个人信息反馈和后端的连接

 # json实例
 ```
 {
    "user_id": 2,　
    "user_name": "jk.tian",
    "user_head": "../../images/icon1.jpeg",
    "post_brief": "选择 kindle 而不是纸质书的原因是什么？",
    "post_content": "don't understand...",
    "post_tags": ["dlut","kindle"],
    "like_count": 3,
    "follow_count": 4,
    "follow_posts": [
        {"user_id": 1,"user_name": "wangZY","user_head": "../../images/icon1.jpeg","follow_content": "one"},
        {"user_id": 2,"user_name": "wangZY","user_head": "../../images/icon1.jpeg","follow_content": "this is my follow content"}
    ]
}
 ```
 其中，user_id暂时无用，　user_head采用同样的图片