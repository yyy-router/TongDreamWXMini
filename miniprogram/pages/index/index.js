// index.js
// const app = getApp()
//const { envList } = require('../../envList.js');
const amapFile = require('../../util/amap-wx.js')
var app = getApp()
Page({
  data: {
    swiperMargin: wx.getSystemInfoSync().windowWidth > 380 ? '60rpx' : '50rpx',
    swiperCurrent: 0,
    weather: '',
    key: "", //天气key
    swiperList: [ //轮播图列表
      {
        imgUrl: '../../images/swiper_list/lunbo1.jpg',
      },
      {
        imgUrl: '../../images/swiper_list/lunbo2.jpg'
      }
    ],
    sort_list: [ //菜单分类列表
      {
        icon: "../../images/sort_list/XL.png",
        name: "校历",
        bind: "NaTo_XL"
      },
      {
        icon: "../../images/sort_list/CCJ.png",
        name: "查成绩",
        bind: "NaTo_CJ"
      },
    ],
    news_list: ["校园新闻", "教务通知"], //新闻列表
    news_list_number: 0, //0为校园新闻，1为学工通知，切换影响显示的内容
    news: [],
    JW_news: [],
    dweek: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    index: app.globalData.jl_week - 1,
    a: ["日", "一", "二", "三", "四", "五", "六"],
    jl_week: app.globalData.jl_week,
    week: new Date().getDay(),
    is_bind_xh: false
  },
  bind_xh(event) {
    wx.navigateTo({
      url: '../bind/index/index',
    })
  },
  get_thiskb(event) {
    var kbinfo = app.globalData.kb
    // console.log(kbinfo)
    var kblist = []
    var day = Number(this.data.week)
    var week = Number(this.data.jl_week)
    for (var i = 0; i < kbinfo.length; i++) {
      var xqj = kbinfo[i].xqj % 7;
      var zhou = kbinfo[i].zcd.split(/\D/);
      var zhoustart = Number(zhou[0]);
      var zhouend = Number(zhou[zhou.length - 2]);
      var jc = kbinfo[i].jcor;
      var jcor = jc.split("-");
      if (jcor[0] == 1) {
        var sksj = "8:00-9:40";
      } else if (jcor[0] == 3) {
        var sksj = "10:00-11:40";
      } else if (jcor[0] == 5) {
        var sksj = "13:00-14:40";
      } else if (jcor[0] == 7) {
        var sksj = "14:50-16:30";
      } else if (jcor[0] == 9) {
        var sksj = "16:40-18:20";
      } else {
        var sksj = jcor;
      }
      var kcxx = kbinfo[i].kcmc;
      var skdd = kbinfo[i].cdmc;
      if ((xqj == day) && (week <= zhouend) && (week >= zhoustart)) {
        kblist.push({
          "xqj": xqj,
          "jcor": "   " + jc + "节",
          "sksj": sksj,
          "kcxx": kcxx,
          "skdd": skdd,
          zhou: zhou
        });
      }
    }
    // console.log(kblist[2])
    // console.log(kblist[3])
    this.setData({
      wlist: kblist
    })
  },
  //获取课表
  get_kb(event) {
    wx.getStorage({
      key: 'kb',
      success: (res) => {
        // console.log('获取缓存的课表');
        // console.log(res);
        app.globalData.kb = res.data.kb
        this.get_thiskb()
      },
      fail: () => {

      }
    })
  },
  //更改第几周
  change_week: function (e) {
    this.setData({
      index: e.detail.value,
      jl_week: Number(e.detail.value) + 1
    })
    this.get_thiskb()
  },
  //更改星期几
  change_day: function (e) {
    this.setData({
      week: e.detail.value
    })
    this.get_thiskb()
  },
  // 监听轮播图切换
  swiperChange(e) {
    let current = e.detail.current;
    this.setData({
      swiperCurrent: current
    });
  },
  //监听校园新闻和学工通知切换
  tabChange(e) {
    let number = e.target.dataset.number;
    this.setData({
      news_list_number: number
    })
  },
  //查成绩
  NaTo_CJ(e) {
    wx.navigateTo({
      url: './achievement/achievement',
    })
  },
  //校历
  NaTo_XL(e) {
    wx.navigateTo({
      url: './xl/xl',
    })
  },
  //跳转新闻
  NaTo_news(e) {
    // console.log(e.currentTarget.dataset.href)
    wx.navigateTo({
      url: './news/news?href=' + e.currentTarget.dataset.href,
    })
  },
  NaTo_JW_news(e) {
    console.log(e.currentTarget.dataset.href)
    wx.navigateTo({
      url: './JW_news/JW_news?href=' + e.currentTarget.dataset.href,
    })
  },
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'kb',
      data: {
        $url: "news",
      }
    }).then(async (res) => {
      console.log('已结束获取校园新闻和教务通知')
      console.log(res.result.data)
      app.globalData.news = res.result.data.res.news
      app.globalData.JW_news = res.result.data.res2.news
      app.globalData.tztg = res.result.data.res3.news
      // console.log(res.result.data.res[0].href)
      app.globalData.newshref = res.result.data.res.news[0].href
      app.globalData.jwtzhref = res.result.data.res2.news[0].href
      app.globalData.tztghref = res.result.data.res3.news[0].href
      this.setData({
        news: res.result.data.res.news,
        JW_news: res.result.data.res2.news
      })
    })
    wx.getStorage({
      key: 'user_info',
      success: (res) => {
        console.log(res)
        this.setData({
          is_bind_xh: true
        })
        this.get_kb()
      }
    })
    //获取天气
    var that = this
    var myAmapFun = new amapFile.AMapWX({
      key: this.data.key
    })
    myAmapFun.getWeather({
      success: function (res) {
        // console.log(res)
        var icon
        var w = res.weather.data
        if (w.indexOf('风') != -1) {
          icon = "feng"
        } else if (w.indexOf('阴') != -1) {
          icon = "yintian"
        } else if (w.indexOf('雾') != -1) {
          icon = "wu"
        } else if (w.indexOf('霾') != -1) {
          icon = "mai"
        } else if (w.indexOf('浮尘') != -1) {
          icon = "fuchen"
        } else if (w.indexOf('扬沙') != -1) {
          icon = "yangsha"
        } else if (w.indexOf("沙") != -1) {
          icon = "shachenbao"
        } else if (w.indexOf('雨') != -1 || w.indexOf('雪') != -1 || w.indexOf('雷') != -1) {
          if (w.indexOf('雨') != -1 && w.indexOf('雪') != -1) {
            icon = "yujiaxue"
          } else if (w.indexOf('雨') != -1 && w.indexOf('雷') != -1) {
            icon = "leizhenyu"
          } else if (w.indexOf('雷') != -1) {
            icon = "lei"
          } else if (w.indexOf('雨') != -1) {
            icon = "xiaoyu"
          } else {
            icon = "xiaoxue"
          }
        } else {
          var date = new Date()
          var time = date.getHours()
          if (time >= 18 || time <= 6) {
            icon = "day"
          } else {
            icon = "night"
          }
        }
        that.setData({
          weather: res,
          weather_icon: icon
        })
        wx.hideLoading()
      },
      fail: function (err) {
        console.log(err)
        wx.hideLoading()
      }
    })
  },
});