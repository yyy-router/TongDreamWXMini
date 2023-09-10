// pages/index/news/news.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        news: [],
        href: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    downloadfile(e) {
        const id = e.currentTarget.id
        console.log(e.currentTarget.id)
        wx.setClipboardData({
            data: this.data.news.downloads[1][id],
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
        console.log(typeof (options) == 'undefined')
        if (typeof (options) == 'undefined') {
            this.data.href = app.globalData.newshref
        } else {
            this.data.href = options.href
        }
        // console.log(this.data.href)
        wx.cloud.callFunction({
            name: 'kb',
            data: {
                $url: "news_article",
                data: {
                    href: this.data.href
                }
            }
        }).then(async (res) => {
            // console.log(res.result.data.res)
            let article = res.result.data.res
            console.log(article)
            if (article.imgposition[article.imgposition.length - 1] == article.paragraph.length) {
                article.paragraph.push("")
            }
            this.setData({
                news: article
            })
        })
    },
    img_view(e) {
        const id = e.target.dataset.id
        wx.previewImage({
            urls: this.data.news.imgs,
            current: this.data.news.imgs[id],
            showmenu: true
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
    onShareAppMessage: function (e) {
        return {
            title: this.data.news.title,
            path: '/pages/index/news/news?href=' + this.data.href,
        }
    }
})