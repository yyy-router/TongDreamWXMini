// pages/fuwu/LostFound/LostFound.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        focusflag: false,
        sort_list: ["全部", "钱包现金", "钥匙挂坠", "身份证件", "笔记书本", "鞋靴服饰", "电子数码", "雨伞及其他"],
        sort_number: 0,
        sort2_number: 0,

    },
    tabChange(e) {
        let number = e.target.dataset.number;
        this.setData({
            sort_number: number
        })
    },
    tab2Change(e) {
        let number = e.target.dataset.number;
        this.setData({
            sort2_number: number
        })
    },
    focusblur(e) {
        // console.log(e.type)
        if (e.type == "focus") {
            this.setData({
                focusflag: true
            })
        } else if (e.type == "blur") {
            this.setData({
                focusflag: false
            })
        }
    },
    getPhoneNumber(e) {
        console.log(e.detail.code)
    },
    fabu() {
        //判断用户信息授权，后跳转添加界面
        // console.log(wx.getUserProfile)
        if (!app.globalData.userflag) {
            wx.getUserProfile({
                desc: '发布失物招领',
                success: (res) => {
                    //   console.log(res)
                    app.globalData.user_info = res.userInfo
                    wx.setStorage({
                        key: 'userInfo',
                        data: {
                            username: res.userInfo.nickName,
                            avatarUrl: res.userInfo.avatarUrl,
                            time: new Date().getTime()
                        },
                    })
                    wx.navigateTo({
                        url: './LostFound_add/LostFound_add',
                    })
                    app.globalData.hasuserinfo = true
                }
            })
        } else {
            wx.navigateTo({
                url: './LostFound_add/LostFound_add',
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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