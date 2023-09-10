// pages/fuwu/news/news.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 'xyxw',
        news: [],
        name: '',
        newsnumber: 1,
        loadding: false,
        color: 'peru',
        list: [{
            name: '学校公告',
            icon: '../../../images/news_list/gonggao.svg',
            news: app.globalData.tztg,
            color: 'orange'
        }, {
            name: '教务通知',
            icon: '../../../images/news_list/tongzhi.svg',
            news: app.globalData.JW_news,
            color: 'tomato'
        }, {
            name: '校园新闻',
            icon: '../../../images/news_list/news.svg',
            news: app.globalData.news,
            color: 'peru'
        }],
        list_number: 0
    },
    tabchange(e) {
        const id = e.currentTarget.id
        this.setData({
            id: id == 1 ? 'jwtz' : 'xyxw',
            list_number: id,
            name: this.data.list[id].name,
            news: this.data.list[id].news,
            color: this.data.list[id].color
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(options)
        if (options) {
            if (options.id) {
                this.setData({
                    id: options.id
                })
            }
        }
        if (this.data.id == 'jwtz') {
            this.setData({
                news: app.globalData.JW_news,
                name: '教务通知',
                list_number: 1,
                color: 'tomato'
            })
        }
        if (this.data.id == 'xyxw') {
            this.setData({
                news: app.globalData.news,
                name: '校园新闻',
                list_number: 2,
                color: 'peru'
            })
        }
        if (this.data.id == 'tztg') {
            this.setData({
                news: app.globalData.tztg,
                name: '学校公告',
                list_number: 0,
                color: 'orange'
            })
        }
        // console.log(this.data.id)
        // console.log(this.data.news)
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
        // console.log('刷新')
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        // console.log('触底')
        if (!this.data.loadding) {
            this.data.loadding = true
            if (this.data.news.length >= 200) {
                this.data.loadding = true
                return
            }
            if (this.data.id) {
                wx.cloud.callFunction({
                    name: "kb",
                    data: {
                        $url: 'news',
                        data: {
                            newsnumber: this.data.newsnumber++,
                            id: this.data.id
                        }
                    }
                }).then((res) => {
                    // console.log(res.result.data.res)
                    if (res.result.data.res.state == 'fail') {
                        wx.showModal({
                            title: "错误",
                            content: "暂时无法查看更多"
                        })
                    } else {
                        var newnews = this.data.news.concat(res.result.data.res.news)
                        this.setData({
                            news: newnews
                        })
                    }
                    // console.log(this.data.news.length)
                    this.data.loadding = false
                })
            }
        }
    },
})