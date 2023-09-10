// pages/achievement/achievement/achievement.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xnm: '',
    xqm: '',
    multiArray: [
      [],
      []
    ],
    multiIndex: [0, 0],
    lfjd: '',
    sum_xf: '',
    sum_jd: '',
  },
  ren: function () {
    wx.navigateTo({
      url: '/pages/study/bind_xh/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'user_info',
      success: (res) => {
        // 初始化下拉列表
        this.init_select(res.data.xh)
        this.setData({
          xh: res.data.xh,
          pwd: res.data.pwd,
          username: res.data.real_name
        })
        wx.cloud.callFunction({
          name: 'kb',
          data: {
            $url: 'bind_xh',
            data: {
              account: res.data.xh,
              passwd: res.data.pwd
            }
          }
        }).then(async (res) => {
          if (res.result.data.res.state != "success") {
            wx.showModal({
              content: res.result.data.res.state,
            })
          } else {
            console.log(res.result.data.res.token)
            var token = res.result.data.res.token
            // 把token存起来，方便改变学期时使用
            wx.setStorageSync('token', {
              token: token
            })
            // 默认查询入学第一年第一学期的成绩
            var xnm = this.data.multiArray[0][0]
            var xqm = 1
            console.log(xnm)
            console.log(xqm)
            var score_res = await wx.cloud.callFunction({
              name: "kb",
              data: {
                $url: 'get_score',
                data: {
                  token: token,
                  xqm: xqm,
                  xnm: xnm
                }
              }
            })
            var score = score_res.result.data.res.items
            // console.log("查询成绩")
            // console.log(score_res.result.data.res)
            this.setData({
              score: score,
            })
            this.count()
          }
        })
        this.setData({
          xh: res.data.xh,
          pwd: res.data.pwd,
          username: res.data.real_name
        })
      },
      fail: (err) => {
        this.init_select(app.globalData.year)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!app.globalData.user_auth) {
      wx.showModal({
        title: '绑定教务系统账号',
        content: '如需查看成绩，请先绑定教务系统账号',
        cancelText: '暂不绑定',
        confirmText: '前去绑定',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '../bind/index/index',
            })
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getYear(date) {
    var year = date.getFullYear()
    return year
  },

  getMonth(date) {
    var month = date.getMonth() + 1
    return month
  },
  // 选择二级联动
  changeMultiPicker(e) {
    console.log(e.detail)
    this.setData({
      multiIndex: e.detail.value
    })
    // 更新成绩
    var multiArray = this.data.multiArray
    var xnm = multiArray[0][e.detail.value[0]]
    var xqm = multiArray[1][e.detail.value[1]]
    console.log("year=" + xnm)
    console.log("term=" + xqm)
    if (xqm == 1) {
      xqm = 1
    } else {
      xqm = 2
    }
    wx.getStorage({
      key: 'token',
      success: (res) => {
        wx.cloud.callFunction({
          name: "kb",
          data: {
            $url: 'get_score',
            data: {
              token: res.data.token,
              xqm: xqm,
              xnm: xnm
            }
          }
        }).then(res => {
          var score = res.result.data.res.items
          this.setData({
            score: score,
          })
          this.count()
        })
      }
    })
  },
  count() {
    var score = this.data.score
    var sum_xf = 0
    var sum_jd = 0
    console.log("执行count")
    console.log(score)
    for (var i = 0; i < score.length; i++) {
      if (score[i].kcxzmc.indexOf("选修") == -1) {
        sum_xf += Number(score[i].xf)
        sum_jd += Number(score[i].xf) * Number(score[i].jd)
      }
    }
    var lfjd = sum_jd / sum_xf
    this.setData({
      sum_xf: sum_xf.toFixed(1),
      sum_jd: sum_jd.toFixed(1),
      lfjd: lfjd.toFixed(2)
    })
  },
  init_select(xh) {
    var xh = xh;
    var xh_str = xh + ''
    // 截取学号前2位，年份
    var xn_str = xh_str.substring(0, 2)
    xn_str = '20' + xn_str
    var xn = parseInt(xn_str)
    console.log(xn)
    // 学年数组
    var xns = []
    for (let i = 0; i < 6; i++) {
      xns[i] = xn
      xn++
    }
    var xq = [1, 2]
    var multiArray = [xns, xq]
    this.setData({
      multiArray: multiArray
    })
  }
})