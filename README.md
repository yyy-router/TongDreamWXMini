##### 项目介绍

> + 页面目录结构

```
miniprogram
    ├─@babel
    ├─components	（公共组件）
    ├─images	（图片资源）
    ├─pages
    │  ├─bind	（教务绑定功能）
    │  │  ├─index	
    │  │  └─xieyi
    │  ├─fuwu	（基础服务功能）
    │  │  ├─LostFound	（失物招领）
    │  │  │  └─LostFound_add	（发布失物招领）
    │  │  ├─news	（校园新闻）
    │  │  └─Temperature		（体温填报）
    │  ├─index		
    │  │  ├─achievement		（查询成绩）
    │  │  ├─JW_news
    │  │  ├─news
    │  │  └─xl		（校历）
    │  ├─kb		（课表功能）
    │  │  └─add		（更换修改课表）
    │  └─my
    │      └─setting		（个人信息设置）
    └─util		（工具库）
```

> + 云函数目录结构

```
├─cloudfunctions
│  ├─kb		（主要的服务功能，对接学校接口云函数）
│  ├─tw		（体温填报功能）
│  └─user	（获取用户信息，检查登陆是否过期）
```



