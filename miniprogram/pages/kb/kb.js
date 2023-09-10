var app = getApp()
Page({


  /**
   * 页面的初始数据
   */
  data: {

    year: app.globalData.year,
    term: app.globalData.term,
    week: app.globalData.jl_week,
    day: app.globalData.day,
    number: app.globalData.user_info.xh,
    date: '',



    colorArrays: ["#ff7638", "#96D56C", "#D8AA5A", "#8294FF", "#0A9A84", "#61BC69", "#5D478B", "#473C8B", "#8B7765", "#ECA1F4", "#00a6dd", "#e3006d", "#00AEAE"],
    wlist: [],
    sksj: ["8:00", "8:55", "10:00", "10:55", "", "13:00", "13:55", "14:50", "15:45", "16:40", "17:35"],
    dweek: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    index: app.globalData.jl_week - 1,
    week: app.globalData.jl_week,
    month: '2',
    weekday: ["一", "二", "三", "四", "五", "六", "日"],
    update: false,
    showid: -1,
    showid_number: -1,
    updatetime: 0,
    show_tckb: 1,
    show_tckb_gonggao: "公告:课表正在一步步更新，可以自己添加课程（除中午时间），敬请期待新功能",
    bg_img: "",
    old: [ //旧数据信息，做对比使用
      // week:10,
      // month:12,
      // sksj:["8:00","8:55","10:00","10:55","","13:00","13:55","14:50","15:45","16:40","17:35"],
      // kb:[{
      //   kcxx:'大学生职业发展与创业就业指导 A-120',
      //   color:"#ff7638",
      //   long:2,
      //   day:1,
      //   time:1
      // },{
      //   kcxx:'模拟电子线路 XX-226',
      //   color:"#D8AA5A",
      //   long:2,
      //   day:2,
      //   time:1
      // },{
      //   kcxx:'马克思主义基本原理概论 A-221',
      //   color:"#96D56C",
      //   long:2,
      //   day:1,
      //   time:3
      // },{
      //   kcxx:'数字逻辑与硬件描述语言 XX-229',
      //   color:"#8294FF",
      //   long:2,
      //   day:4,
      //   time:1
      // },{
      //   kcxx:'数字逻辑与硬件描述语言 XX-229',
      //   color:"#8294FF",
      //   long:2,
      //   day:2,
      //   time:6
      // },{
      //   kcxx:'模拟电子线路 XX-226',
      //   color:"#D8AA5A",
      //   long:4,
      //   day:5,
      //   time:1
      // },{
      //   kcxx:'马克思主义基本原理概论 A-221',
      //   color:"#96D56C",
      //   long:2,
      //   day:3,
      //   time:1
      // },{
      //   kcxx:'概率论 A-420',
      //   color:"#0A9A84",
      //   long:2,
      //   day:2,
      //   time:3
      // },{
      //   kcxx:'大学英语3 A-224',
      //   color:"#61BC69",
      //   long:2,
      //   day:1,
      //   time:6
      // },{
      //   kcxx:'大学英语3 A-224',
      //   color:"#61BC69",
      //   long:2,
      //   day:3,
      //   time:6
      // },{
      //   kcxx:'复变函数与积分变换 A-420',
      //   color:"#5D478B",
      //   long:2,
      //   day:4,
      //   time:3
      // },{
      //   kcxx:'大学物理B2 A219',
      //   color:'#473C8B',
      //   long:2,
      //   day:2,
      //   time:8
      // },{
      //   kcxx:'电路原理 XX-227',
      //   color:'#8B7765',
      //   long:2,
      //   day:1,
      //   time:10
      // },{
      //   kcxx:'电路原理 XX-227',
      //   color:'#8B7765',
      //   long:2,
      //   day:5,
      //   time:6
      // },{
      //   kcxx:'体育3 健美操馆3',
      //   color:'#ECA1F4',
      //   long:2,
      //   day:4,
      //   time:6
      // }]
    ],

  },
  show_tckb: function () {
    this.setData({
      show_tckb: !this.data.show_tckb
    }), wx.setStorage({
      data: this.data.show_tckb_date,
      key: "reader_tckb"
    });
  },
  showCardView: function (e) {
    let zhou = e.currentTarget.dataset.zhou
    let teacher = e.currentTarget.dataset.teacher
    let jc = e.currentTarget.dataset.jc
    let xqj = e.currentTarget.dataset.xqj
    let kcmc = e.currentTarget.dataset.kcmc
    let sksj = e.currentTarget.dataset.sksj
    let index = e.currentTarget.dataset.index
    let that = this
    if (teacher == "" && kcmc == "") {
      if (e.currentTarget.dataset.opacity > 0) {
        console.log(xqj, sksj, this.data.week)
        wx.navigateTo({
          url: './add/add?xqj=' + xqj + '&sksj=' + sksj + '&week=' + this.data.week,
        })
      }
      this.change_opacity(index)
    } else {
      wx.showModal({
        title: '课程详情',
        content: '任课教师：' + teacher + "\n" + '上课周：' + zhou,
        cancelText: '删除课程',
        confirmText: '确认',
        confirmColor: '#7cba23',
        success(res) {
          if (res.confirm) {} else if (res.cancel) {
            that.delete(xqj, jc, kcmc)
          }
        }
      })
    }
  },
  change_opacity(index) {
    let list = this.data.wlist
    // console.log(index)
    let that = this
    list[index].opacity = 0.8
    if (this.data.showid != -1) {
      list[this.data.showid].opacity = 0
      clearInterval(this.data.showid_number)
    }
    this.data.showid = index
    this.setData({
      wlist: list
    })
    this.data.showid_number = setInterval(function () {
      if (list[index].opacity <= 0.7) {
        list[index].opacity = 0
        that.data.showid = -1
        that.setData({
          wlist: list
        })
        clearInterval(that.data.showid_number)
        return
      }
      list[index].opacity -= 0.2
      that.setData({
        wlist: list
      })
    }, 1000)
  },
  change_week: function (e) {
    clearInterval(this.data.showid_number) //清除切换前课表的变化
    this.setData({
      index: e.detail.value,
      week: Number(e.detail.value) + 1
    })
    this.get_thiskb()
  },
  get_thiskb(event) {
    var kbinfo = app.globalData.kb;
    console.log(kbinfo)
    var kblist = []
    var week = Number(this.data.week)
    for (var i = 0; i < kbinfo.length; i++) {
      var xqj = kbinfo[i].xqj
      var jc = kbinfo[i].jc
      var jcor = kbinfo[i].jcor.split("-")
      var sksj = Number(jcor[0])
      var skcd = jcor[1] - jcor[0] + 1
      var zhou = kbinfo[i].zcd.match(/\d+/g)
      var kcmc = kbinfo[i].kcmc
      if (kcmc.length > 10) {
        var kcxx = kcmc.substr(0, 10) + "……" + "\n" + kbinfo[i].cdmc + "\n" + kbinfo[i].zcd
      } else {
        var kcxx = kcmc + "\n" + kbinfo[i].cdmc + "\n" + kbinfo[i].zcd
      }
      var teacher = kbinfo[i].xm
      var j = 0
      while (week > zhou[j + 1] && j <= zhou.length) {
        j += 2
      }
      var zhoustart = Number(zhou[j])
      var zhouend = Number(zhou[j + 1])
      if (week >= zhoustart && week <= zhouend) {
        kblist.push({
          "xqj": xqj,
          "sksj": sksj,
          "skcd": skcd,
          "kcxx": kcxx,
          "zcd": kbinfo[i].zcd,
          "teacher": teacher,
          colorindex: "",
          "kcmc": kcmc,
          "jc": jc,
          "opacity": 1
        });
      }
    }
    if (kblist.length == 0) {
      for (var i = 1; i <= 7; i++) {
        for (var j = 1; j <= 10; j += 2) {
          kblist.push({
            "xqj": i,
            "sksj": j,
            "skcd": 2,
            "kcxx": '+',
            "zcd": week,
            "teacher": "",
            colorindex: 12,
            "kcmc": "",
            "jc": j + "-" + (j + 1),
            "opacity": 0
          })
        }
      }
      this.setData({
        wlist: kblist
      })
    } else {
      kblist[0].colorindex = 0
      var colorindex = 1
      for (var i = 1; i < kblist.length; i++) {
        var flag = true
        for (var j = 0; j < i; j++) {
          if (kblist[j].kcxx.split(" ", 1).toString() === kblist[i].kcxx.split(" ", 1).toString()) {
            flag = false
            break
          }
        }
        if (flag) {
          kblist[i].colorindex = colorindex++
        } else {
          kblist[i].colorindex = kblist[j].colorindex
        }
      }
      // console.log(kblist);
      for (var i = 1; i <= 7; i++) {
        for (var j = 1; j <= 10; j += 2) {
          var flag2 = false
          for (var k = 0; k < kblist.length; k++) {
            if (kblist[k].xqj == i && kblist[k].sksj <= j && (kblist[k].sksj + kblist[k].skcd) > j) {
              flag2 = true
            }
            if (flag2) {
              break
            }
          }
          if (!flag2) {
            kblist.push({
              "xqj": i,
              "sksj": j,
              "skcd": 2,
              "kcxx": '+',
              "zcd": week,
              "teacher": "",
              colorindex: 12,
              "kcmc": "",
              "jc": j + "-" + (j + 1),
              "opacity": 0
            })
          }
        }
      }
      this.setData({
        wlist: kblist
      })
      // console.log("wlist")
      // console.log(this.data.wlist)
    }
  },
  get_kb_update(event) {
    var that = this
    wx.showModal({
      title: "刷新课表",
      content: "确认刷新吗?（刷新后将按照教务系统的课表填入）",
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在更新...',
          })
          that.update_kb()
          console.log("获得标志")
          console.log(that.data.update)
          console.log(that.data.updatetime)
          var number = setInterval(() => {
            that.is_update(number)
          }, 1000);
        } else if (res.cancel) {} else {
          wx.showToast({
            title: '两者都没选择？',
            icon: 'none'
          })
        }
      }
    })
  },
  is_update(number) {
    // console.log("执行了")
    var that = this
    if (that.data.updatetime < 5 && !that.data.update) {
      that.data.updatetime++
    } else {
      if (that.data.update) {
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '更新成功！'
            })
          },
        })
      } else {
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '更新较慢，请等待！',
              icon: "none"
            })
          },
        })
      }
      that.data.updatetime = 0
      that.data.update = false
      clearInterval(number)
    }
    // console.log(that.data.update)
    // console.log(that.data.updatetime)
  },
  update_kb(event) {
    // Toast('暂时关闭接口~')
    // console.log('获取课表')
    wx.getStorage({
      key: 'user_info',
      success: (res) => {
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
              var year = app.globalData.year
              var term = app.globalData.term
              var kb_res = await wx.cloud.callFunction({
                name: "kb",
                data: {
                  $url: 'get_class',
                  data: {
                    token: token,
                    year: year,
                    term: term
                  }
                },
              })
              // console.log(kb_res.result.data.res.kbList)
              //把课表加入缓存
              wx.setStorageSync('kb', {
                kb: kb_res.result.data.res.kbList
              })
              app.globalData.kb = kb_res.result.data.res.kbList
              this.get_thiskb()
              this.data.update = true
            }
          })
          .catch(err => {
            console.log(err)
            wx.onNetworkStatusChange((res) => {
              if (res.networkType != "none") {
                wx.hideLoading({
                  success: (res) => {
                    wx.showToast({
                      title: '教务系统超时',
                      icon: 'error',
                    })
                  },
                })
              }
            })
          })
      },
    })
  },
  delete(xqj, jc, kcmc) {
    var kb = wx.getStorageSync('kb')
    var kblist = kb.kb
    // console.log(kblist)
    for (var i = 0; i < kblist.length; i++) {
      if (kblist[i].xqj == xqj && kblist[i].jc == jc && kblist[i].kcmc == kcmc) {
        kblist.splice(i, 1)
        break
      }
    }
    kb = kblist
    wx.setStorageSync('kb', {
      kb: kb
    })
    app.globalData.kb = kb
    this.get_thiskb()
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    const time = new Date();
    const month = time.getMonth() + 1
    const day = time.getDate()
    this.setData({
      date: time.getFullYear() + "/" + (month >= 10 ? month : "0" + month) + "/" + (day >= 10 ? day : "0" + day),
    });
    wx.getStorage({
      key: 'kb',
      success: (res) => {
        // console.log('获取缓存的课表');
        // console.log(res.data.kb);
        app.globalData.kb = res.data.kb
        this.get_thiskb()
      },
      fail: (err) => {
        console.log(err)
        this.update_kb()
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
        content: '如需查看课表，请先绑定教务系统账号',
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

  }
})