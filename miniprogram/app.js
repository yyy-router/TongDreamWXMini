// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: '',//云开发ID
        traceUser: true,
      });
    }
    this.globalData = {
      user_info: {}, //教务系统的个人信息
      term_start: "",
      openId: '',
      year: Number,
      term: Number,
      kb: '',
      day: '',
      user_auth: false, //教务系统的授权
      jl_week: 1,
      xh: '',
      pwd: '',
      newshref: '',
      jwtzhref: '',
      tztghref: '',
      news: [],
      JW_news: [],
      tztg: [],
      is_bind_xh: false,
      userflag: false, //微信用户信息授权
    }
    //获取第几周
    wx.cloud.database().collection("system_info").get().then(res=>{
        this.globalData.term_start=res.data[0].term_start
        this.globalData.year=Number(res.data[0].year)
        this.globalData.term=Number(res.data[0].term)
        var mb=new Date(this.globalData.term_start)
        var sj = new Date()
        this.globalData.day = "日一二三四五六".charAt(new Date().getDay())
        var jl = sj.getTime() - mb.getTime()
        var jl_day = Math.floor(jl / (1000 * 60 * 60 * 24))
        this.globalData.jl_week = Math.floor(jl_day / 7) + 1
        this.globalData.jl_week > 20 ? this.globalData.jl_week = "假期中" : (this.globalData.jl_week <= 0 ? this.globalData.jl_week = "假期中" : "")
        wx.getStorage({
          key: 'user_info',
          success: (res) => {
            this.globalData.user_info = res.data,
              this.globalData.user_auth = true //已经授权
          },
          fail: (err) => {
            console.log(err + "没有该key")
          }
        })
        const user = wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo') : null //获取用户信息缓存
        console.log(user)
        const now = sj.getTime()
        if (user == null || user.time < now - 7 * 24 * 60 * 60 * 1000) {
          console.log('获取用户信息')
          wx.cloud.callFunction({
            name: 'user',
            data: {
              $url: 'get_user'
            }
          }).then((res) => {
            let userinfo = res.result.data.res.data[0]
            if (userinfo.length != 0) {
              wx.setStorage({
                key: 'userInfo',
                data: {
                  username: userinfo.username,
                  avatarUrl: userinfo.avatarUrl,
                  time: new Date().getTime()
                }
              })
              this.globalData.userflag = true
            }
          })
        } else {
          this.globalData.userflag = true
        }
      }
    )
    //检验版本更新
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
            wx.clearStorageSync()
          }
        }
      })
    })


  }
});