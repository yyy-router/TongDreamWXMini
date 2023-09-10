// pages/index/JW_news/JW_news.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        jwtz: [],
        number: 0,
        pageCount: 1,
    },
    prepage() {
        this.setData({
            number: this.data.number - 1
        })
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 100
        })
    },
    nextpage() {
        this.setData({
            number: this.data.number + 1
        })
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 100
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    downloadfile(e) {
        const id = e.currentTarget.id
        console.log(e.currentTarget.id)
        wx.setClipboardData({
            data: this.data.jwtz[this.data.number].downloads[id],
            success: (res) => {
                wx.hideToast()
                wx.showModal({
                    title: "提示",
                    content: "下载链接已复制，请从浏览器中下载",
                    showCancel: false
                })
            }
        })
    },
    onLoad: function (options) {
        if (typeof (options) == "undefined") {
            this.data.href = app.globalData.jwtzhref
        } else {
            this.data.href = options.href
        }
        // console.log(this.data.href)
        wx.cloud.callFunction({
            name: 'kb',
            data: {
                $url: "jwtz_article",
                data: {
                    href: this.data.href
                }
            }
        }).then(async (res) => {
            console.log(res.result.data.res)
            this.setData({
                jwtz: res.result.data.res,
                pageCount: res.result.data.res.length
            })
            // console.log(this.data.pageCount)
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
        return {
            title: this.data.jwtz[0].title,
            path: '/pages/index/JW_news/JW_news?href=' + this.data.href,
        }
    }
})