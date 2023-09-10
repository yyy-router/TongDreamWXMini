const app = getApp()
const db = wx.cloud.database()
Page({

  data: {
    show: false,
    id: 0
  },
  hide_show(event) {
    this.setData({
      show: false
    })
  },

  formsubmit(event) {
    if (!event.detail.value.is_ty[0]) {
      wx.showModal({
        content: '请同意用户协议',
      })
      return
    }
    if (event.detail.value.username.trim() == '' || event.detail.value.pwd.trim() == '') {
      wx.showModal({
        content: '用户账号密码不能为空',
      })
      return
    }
    wx.showLoading({
      title: '正在绑定中',
    })

    wx.cloud.callFunction({
      name: 'kb',
      data: {
        $url: 'bind_xh',
        data: {
          account: event.detail.value.username,
          passwd: event.detail.value.pwd
        }
      }
    }).then(async (res) => {
      console.log(res)
      if (res.result.data.res.state != "success") {
        wx.showModal({
          content: "账号或者密码错误",
        })
      } else {
        //如果id为0说明是第一次绑定
        if (this.data.id == 0) {
          var flat = await db.collection('users_info').where({
            _id: event.detail.value.username
          }).get().then(resu => {
            if (resu.data.length > 0) {
              console.log("已有记录")
              //更新绑定
              console.log("更新绑定")
              console.log(event.detail.value)
              db.collection('users_info').doc(event.detail.value.username).get({
                success: async () => {
                  console.log("获取成功")
                  var user_info = await wx.cloud.callFunction({
                    name: "kb",
                    data: {
                      $url: 'get_user_info',
                      data: {
                        token: res.result.data.res.token
                      }
                    }
                  })
                  db.collection('users_info').doc(event.detail.value.username).update({
                    data: {
                      pwd: event.detail.value.pwd,
                      stu_info: user_info.result.data.res,
                      update_time: db.serverDate()
                    }
                  }).then(() => {
                    wx.hideLoading()
                    wx.showToast({
                      title: '更新绑定成功',
                    })
                    //-----清理课表缓存
                    // wx.removeStorageSync('kb_arr')

                    //---------重新覆盖缓存
                    wx.setStorageSync('bind_xh', {
                      xh: event.detail.value.username,
                      pwd: event.detail.value.pwd
                    })
                    wx.setStorage({
                      data: {
                        xh: event.detail.value.username,
                        pwd: event.detail.value.pwd,
                        real_name: user_info.result.data.res.real_name,
                        zy: user_info.result.data.res.zy,
                        class_name: user_info.result.data.res.class_name,
                        faculty: user_info.result.data.res.faculty.substr(0, user_info.result.data.res.faculty.length - 2),
                      },
                      key: 'user_info',
                    })
                    app.globalData.user_auth = true
                    // //关闭所有页面进入首页
                    // setTimeout(() => {
                    //   wx.reLaunch({
                    //     url: '../../index/index',
                    //     fail: (error) => {
                    //       console.log('跳转失败', error)
                    //     }
                    //   })
                    //   // wx.navigateBack()
                    //   // var pag = getCurrentPages()
                    //   // pag[pag.length - 2].onLoad()
                    // }, 2000)

                  }).catch(err => {
                    console.log('更新记录失败', err)
                  })
                },
                fail: async (err) => {
                  console.log("获取失败")
                  var user_info = await wx.cloud.callFunction({
                    name: "kb",
                    data: {
                      $url: 'get_user_info',
                      data: {
                        token: res.result.data.res.token
                      }
                    }
                  })
                  db.collection('users_info').add({
                    data: {
                      _id: event.detail.value.username,
                      pwd: event.detail.value.pwd,
                      stu_info: user_info.result.data.res,
                      upload_time: db.serverDate()
                    },
                  }).then(() => {
                    wx.hideLoading()
                    wx.showToast({
                      title: '绑定成功',
                    })
                    wx.setStorageSync('bind_xh', {
                      xh: event.detail.value.username,
                      pwd: event.detail.value.pwd
                    })
                    wx.setStorage({
                      data: {
                        xh: event.detail.value.username,
                        pwd: event.detail.value.pwd,
                        real_name: user_info.result.data.res.real_name,
                        zy: user_info.result.data.res.zy,
                        class_name: user_info.result.data.res.class_name,
                        faculty: user_info.result.data.res.faculty.substr(0, user_info.result.data.res.faculty.length - 2)
                      },
                      key: 'user_info',
                    })
                    app.globalData.user_auth = true
                    

                  }).catch(err => {
                    console.log(err)
                  })
                }
              })
              return true
            }
          }).catch(err => {
            console.log(err)
          })
          if (flat) { //如果已经绑定账号就返回
            //关闭所有页面进入首页
            setTimeout(() => {
              wx.reLaunch({
                url: '../../index/index',
                fail: (error) => {
                  console.log('跳转失败', error)
                }
              })
              // wx.navigateBack()
              // var pag = getCurrentPages()
              // pag[pag.length - 2].onLoad()
            }, 2000)
            return
          }
          var user_info = await wx.cloud.callFunction({
            name: "kb",
            data: {
              $url: 'get_user_info',
              data: {
                token: res.result.data.res.token
              }
            }
          })
          db.collection('users_info').add({
            data: {
              _id: event.detail.value.username,
              pwd: event.detail.value.pwd,
              stu_info: user_info.result.data.res,
              upload_time: db.serverDate()
            },
          }).then(() => {
            wx.hideLoading()
            wx.showToast({
              title: '绑定成功',
            })
            wx.setStorageSync('bind_xh', {
              xh: event.detail.value.username,
              pwd: event.detail.value.pwd
            })
            app.globalData.user_auth = true
            wx.setStorage({
              data: {
                xh: event.detail.value.username,
                pwd: event.detail.value.pwd,
                real_name: user_info.result.data.res.real_name,
                zy: user_info.result.data.res.zy,
                class_name: user_info.result.data.res.class_name,
                faculty: user_info.result.data.res.faculty.substr(0, user_info.result.data.res.faculty.length - 2)
              },
              key: 'user_info',
            })
            //关闭所有页面进入首页
            setTimeout(() => {
              wx.reLaunch({
                url: '../../index/index',
                fail: (error) => {
                  console.log('跳转失败', error)
                }
              })
              // wx.navigateBack()
              // var pag = getCurrentPages()
              // pag[pag.length - 2].onLoad()
            }, 2000)

          }).catch(err => {
            console.log(err)
          })

        } else {
          //更新绑定
          console.log("更新绑定")
          console.log(event.detail.value)
          db.collection('users_info').doc(event.detail.value.username).get({
            success: async () => {
              console.log("获取成功")
              var user_info = await wx.cloud.callFunction({
                name: "kb",
                data: {
                  $url: 'get_user_info',
                  data: {
                    token: res.result.data.res.token
                  }
                }
              })
              db.collection('users_info').doc(event.detail.value.username).update({
                data: {
                  pwd: event.detail.value.pwd,
                  stu_info: user_info.result.data.res,
                  update_time: db.serverDate()
                }
              }).then(() => {
                wx.hideLoading()
                wx.showToast({
                  title: '更新绑定成功',
                })
                //-----清理课表缓存
                // wx.removeStorageSync('kb_arr')

                //---------重新覆盖缓存
                wx.setStorageSync('bind_xh', {
                  xh: event.detail.value.username,
                  pwd: event.detail.value.pwd
                })
                wx.setStorage({
                  data: {
                    xh: event.detail.value.username,
                    pwd: event.detail.value.pwd,
                    real_name: user_info.result.data.res.real_name,
                    zy: user_info.result.data.res.zy,
                    class_name: user_info.result.data.res.class_name,
                    faculty: user_info.result.data.res.faculty.substr(0, user_info.result.data.res.faculty.length - 2),
                  },
                  key: 'user_info',
                })
                app.globalData.user_auth = true
                //关闭所有页面进入首页
                setTimeout(() => {
                  wx.reLaunch({
                    url: '../../index/index',
                    fail: (error) => {
                      console.log('跳转失败', error)
                    }
                  })
                  // wx.navigateBack()
                  // var pag = getCurrentPages()
                  // pag[pag.length - 2].onLoad()
                }, 2000)

              }).catch(err => {
                console.log('更新记录失败', err)
              })
            },
            fail: async (err) => {
              console.log("获取失败")
              var user_info = await wx.cloud.callFunction({
                name: "kb",
                data: {
                  $url: 'get_user_info',
                  data: {
                    token: res.result.data.res.token
                  }
                }
              })
              db.collection('users_info').add({
                data: {
                  _id: event.detail.value.username,
                  pwd: event.detail.value.pwd,
                  stu_info: user_info.result.data.res,
                  upload_time: db.serverDate()
                },
              }).then(() => {
                wx.hideLoading()
                wx.showToast({
                  title: '绑定成功',
                })
                wx.setStorageSync('bind_xh', {
                  xh: event.detail.value.username,
                  pwd: event.detail.value.pwd
                })
                wx.setStorage({
                  data: {
                    xh: event.detail.value.username,
                    pwd: event.detail.value.pwd,
                    real_name: user_info.result.data.res.real_name,
                    zy: user_info.result.data.res.zy,
                    class_name: user_info.result.data.res.class_name,
                    faculty: user_info.result.data.res.faculty.substr(0, user_info.result.data.res.faculty.length - 2)
                  },
                  key: 'user_info',
                })
                app.globalData.user_auth = true
                //关闭所有页面进入首页
                setTimeout(() => {
                  wx.reLaunch({
                    url: '../../index/index',
                    fail: (error) => {
                      console.log('跳转失败', error)
                    }
                  })
                  // wx.navigateBack()
                  // var pag = getCurrentPages()
                  // pag[pag.length - 2].onLoad()
                }, 2000)

              }).catch(err => {
                console.log(err)
              })
            }
          })
        }
      }
    }).catch(err => {
      wx.showModal({
        content: '请求教务系统超时，请重试，可能教务系统接口暂时关闭',
      })
      console.log(err)
    }).then(() => {
      wx.hideLoading()
    })

    // console.log(event)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.id) {
      this.data.id = options.id

    } else {
      console.log('第一次绑定学号')
    }
    console.log(options)

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