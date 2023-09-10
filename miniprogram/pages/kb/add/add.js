// pages/kb/add/add.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array1: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    array2: ['第1节', '第2节', '第3节', '第4节', '第5节', '第6节', '第7节', '第8节', '第9节', '第10节'],
    array3: ['第1节', '第2节', '第3节', '第4节', '第5节', '第6节', '第7节', '第8节', '第9节', '第10节'],
    index1: 0,
    index2: 0,
    index3: 0,
    array4: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
    array5: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
    index4: 0,
    index5: 0,
    kcmc: '', //课程名称
    cdmc: '', //上课地点
    teacher: '', //任课教师
  },
  input_kcmc(e) {
    this.data.kcmc = e.detail.value
  },
  input_cdmc(e) {
    this.data.cdmc = e.detail.value
  },
  input_teacher(e) {
    this.data.teacher = e.detail.value
  },
  bindPickerChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      index1: e.detail.value[0],
      index2: e.detail.value[1],
      index3: e.detail.value[2]
    })
  },

  bindPickerChange1: function (e) {
    console.log(e.detail.value)
    this.setData({
      index4: e.detail.value[0],
      index5: e.detail.value[1]
    })
  },
  baocun() {
    const that = this.data
    if (that.kcmc.trim() == '') {
      wx.showToast({
        title: '课程名称不能为空',
        icon: 'none'
      })
      return
    }
    if (that.cdmc.trim() == '') {
      wx.showToast({
        title: '上课地点不能为空',
        icon: 'none'
      })
      return
    }
    if (that.teacher.trim() == '') {
      wx.showToast({
        title: '任课老师不能为空',
        icon: 'none'
      })
      return
    }
    if (that.index4 > that.index5) {
      wx.showToast({
        title: '周数有误,请重新选择',
        icon: 'none'
      })
      return
    }
    if (that.index2 > that.index3) {
      wx.showToast({
        title: '课程时间有误,请重新选择',
        icon: 'none'
      })
      return
    }
    console.log(that.kcmc, that.cdmc, that.teacher, that.array1[that.index1], that.array2[that.index2], that.array3[that.index3], that.array4[that.index4], that.array5[that.index5])
    var kb = wx.getStorageSync('kb')
    console.log("kb", kb)
    console.log(kb == '')
    if (kb == '') {
      var kblist = new Array()
    } else {
      var kblist = kb.kb
    }
    kblist.push({
      'xqj': that.index1 + 1,
      'jc': (Number(that.index2) + 1) + '-' + (Number(that.index3) + 1),
      'jcor': (Number(that.index2) + 1) + '-' + (Number(that.index3) + 1),
      'zcd': (Number(that.index4) + 1) + '-' + (Number(that.index5) + 1),
      'kcmc': that.kcmc,
      'xm': that.teacher,
      'cdmc': that.cdmc
    })
    console.log(kblist)
    wx.setStorageSync('kb', {
      kb: kblist
    })
    app.globalData.kb = kblist
    wx.switchTab({
      url: '../kb',
      success: function (e) {
        const page = getCurrentPages().pop()
        console.log(page)
        if (page == 'undefined' || page == null) return
        page.onLoad()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (typeof (options) == "undefined") {
      return
    } else {
      this.setData({
        index1: options.xqj - 1,
        index2: options.sksj - 1,
        index3: options.sksj,
        index4: options.week - 1,
        index5: options.week - 1
      })
    }
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