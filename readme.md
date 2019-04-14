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

# LOG

20190414
---
1. 解决刷新问题．去除刷新特效
2. 解决具体帖子的标签显示问题．将text标签换为label
3. 在同一时刻，同一主帖下，点赞／关注的变灰效果，以及加减1
1. 发帖／跟帖后自动返回页面
2. 加入新帖子之后的搜索正常，关注新帖子后，也可在我的收藏中看到
	1. 解决办法：person数据库的插入问题．在调用云函数之前，删除json的_id和_openid字段
3. 对同一个帖子，在不同时刻，多次点赞，会当成对多个帖子的第一次点赞处理
	1. 相当于快照，因为我的收藏中保存的是点赞当时的状态（包括当时的点赞数）
4. 添加邀请功能
5. 搜索：点击右上角的搜索图标／输入搜索词后直接回车
6. 每个主帖下边的跟帖，按照时间顺序，最新的在最下边
20190413
---
1. 发帖和跟帖．和后端的连接
2. 我的点赞，我的回答中可看见历史记录
3. 资源界面
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
 // posts表
{
    "user_id": 2,
    "user_name": "jk.tian",
    "user_head": "../../images/icon1.jpeg",
    "post_brief": "考研的时候怎么查找资料",
    "post_content": "给学姐学长发红包",
    "post_tags": ["红包","资料","方法"],
    "like_count": 3,
    "follow_count": 2,
    "follow_posts": [
        {"user_id": 1,"user_name": "wangZY","user_head": "../../images/icon1.jpeg","follow_content": "+1"},
        {"user_id": 2,"user_name": "wangZY","user_head": "../../images/icon1.jpeg","follow_content": "朱门酒肉臭路有冻死骨"}
    ]
}
{
    "user_id": 2,
    "user_name": "zy.wang",
    "user_head": "../../images/icon8.jpeg",
    "post_brief": "三跨 二战 考研 工作？",
    "post_content": "我可能应该写一个更具有爆点的题目，比如三跨、双非、三本之类的。然而很可惜的是，我所有条件都具备，我今年仍然没有上岸。",
    "post_tags": ["选择","工作"],
    "like_count": 100,
    "follow_count": 3,
    "follow_posts": [
        {"user_id": 1,"user_name": "wangZY","user_head": "../../images/icon1.jpeg","follow_content": "工作去吧，考研这种应试，不值得的"},
        {"user_id": 2,"user_name": "wangZY","user_head": "../../images/icon1.jpeg","follow_content": "学会自己承担后果，自己为自己的选择负责"},
        {"user_id": 2,"user_name": "wangZY","user_head": "../../images/icon1.jpeg","follow_content": "火钳刘明"}
    ]
}

// person表
相当于posts表中某一行，加上了owner字段（标识点赞人）
 ```
- 其中，user_id暂时无用，　user_head采用同样的图片
- 初始建议like_count/follow_count均为０，follow_posts为空数组