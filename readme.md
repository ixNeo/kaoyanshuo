* content
{:toc}

# 简介

微信小程序--研谈论道

### 功能
1. 论坛．帖子包含标题／内容／标签／发帖人
	1. 发帖
	2. 跟帖
	3. 搜索
	4. 对某个帖子的点赞（关注）
2. 资源
	1. 官方信息．学校介绍等
3. 我的
	1. 我的点赞（关注）
	2. 我的发帖
	3. 个人信息．昵称／个人签名／性别
	4. 反馈信息．提建议

# log

TODO
---
1. 刷新问题．可直接去除刷新特效
2. 具体帖子的标签显示问题

20190413
---
 1. 发帖和跟帖．和后端的连接
 2. 我的点赞，我的回答中可看见历史记录
 3. 资源界面
 	- 有空做：下载上传
 4. 有空做：个人信息反馈和后端的连接

20190412
---
- 论坛界面和后端的连接
　　　　- 直接编写json文件，然后上传到云开发中即可
- 某一帖子的界面．和后端的连接
　　　　- 此界面下，关注代表点赞，跟帖代表新回答．点击后对应数字会变，和后端连接
- 搜索界面和后端的连接．
　　　　- 支持搜索内容，摘要，标签，发帖人姓名．未区分，未排名

# 数据库设计
1. posts表：包含帖子内容，每个帖子中包含follow_posts数组（显示跟帖信息）
2. person表：我点赞过的帖子

 # JSON实例（posts表）
 > 直接在本地写.json文件，在云开发中上传即可，可以先手动删除posts表中已经存在的所有数据
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
{
    "user_id": 2,
    "user_name": "zy.wang",
    "user_head": "../../images/icon1.jpeg",
    "post_brief": "选择 email 而不是纸质书的原因是什么？",
    "post_content": "don't understand...",
    "post_tags": ["peking","email"],
    "like_count": 3,
    "follow_count": 4,
    "follow_posts": [
        {"user_id": 1,"user_name": "wangZY","user_head": "../../images/icon1.jpeg","follow_content": "two"},
        {"user_id": 2,"user_name": "wangZY","user_head": "../../images/icon1.jpeg","follow_content": "this is my follow content"}
    ]
}
 ```
- 其中，user_id暂时无用，　user_head采用同样的图片
- 初始建议like_count/follow_count均为０，follow_posts为空数组