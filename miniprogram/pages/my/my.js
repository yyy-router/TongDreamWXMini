// pages/my/my.js
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
        // avatarUrl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
        avatarUrl:"",
        username: '',
        userflag: false
    },
    getuserinfo() {
        wx.getUserProfile({
            desc: '用于展示头像和昵称',
            success: (res) => {
                wx.setStorage({
                    key: 'userInfo',
                    data: {
                        username: res.userInfo.nickName,
                        avatarUrl: res.userInfo.avatarUrl,
                        time: new Date().getTime()
                    },
                })
                this.setData({
                    username: res.userInfo.nickName,
                    avatarUrl: res.userInfo.avatarUrl,
                    userflag: true
                })
                wx.cloud.callFunction({
                    name: 'user',
                    data: {
                        $url: 'add_user',
                        data: {
                            username: res.userInfo.nickName,
                            avatarUrl: res.userInfo.avatarUrl
                        }
                    }
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    bind_set(e) {
        wx.navigateTo({
            url: './setting/setting',
        })
    },
    bind_xh() {
        wx.navigateTo({
            url: '../bind/index/index?id=1',
        })
    },
    onLoad: function (options) {
        if (app.globalData.userflag) {
            const user = wx.getStorageSync('userInfo')
            this.setData({
                username: user.username,
                avatarUrl: user.avatarUrl,
                userflag: true
            })
        }
        // if (user == null || user.time < now - 7 * 24 * 60 * 60 * 1000) {
        //     wx.cloud.callFunction({
        //         name: 'user',
        //         data: {
        //             $url: 'get_user'
        //         }
        //     }).then((res) => {
        //         let userinfo = res.result.data.res.data
        //         if (userinfo.length != 0) {
        //             wx.setStorage({
        //                 key: 'userInfo',
        //                 data: {
        //                     username: userinfo[0].userName,
        //                     avatarUrl: userinfo[0].avatarUrl,
        //                     time: new Date().getTime()
        //                 }
        //             })
        //             this.setData({
        //                 username: userinfo[0].userName,
        //                 avatarUrl: userinfo[0].avatarUrl,
        //                 userflag: true
        //             })
        //         }
        //     })
        // } else {
        // this.setData({
        //     username: user.username,
        //     avatarUrl: user.avatarUrl,
        //     userflag: true
        // })
        // }
        wx.getStorage({
            key: 'user_info',
            success: (res) => {
                app.globalData.user_info = res.data
                app.globalData.user_auth = true //已经授权
                console.log(res.data)
                this.setData({
                    number: res.data.xh
                })
            },
            fail: (err) => {
                console.log(err)
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {},

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
        return {
            title: '沈理小同学助手邀请了你',
            path: '/pages/index/index',
            imageUrl: '../../images/swiper_list/lunbo1.jpg'
        }
    }
})