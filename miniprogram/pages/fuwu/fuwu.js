// pages/fuwu/fuwu.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        xyztc_list: [ //校园直通车列表
            {
                icon: "../../images/fuwu_list/gonggao.svg",
                name: "学校公告",
                bind: "./news/news?id=tztg",
                type: 'navigate'
            }, {
                icon: "../../images/fuwu_list/tongzhi.svg",
                name: "教务通知",
                bind: "./news/news?id=jwtz",
                type: 'navigate'
            }, {
                icon: "../../images/fuwu_list/news.svg",
                name: "校园新闻",
                bind: "./news/news?id=xyxw",
                type: 'navigate'
            }, {
                icon: "../../images/fuwu_list/fengguang.svg",
                name: "校园风光",
                bind: "./xyfg",
                type: 'navigate'
            }, {
                icon: "../../images/fuwu_list/huodong.svg",
                name: "校园活动",
                bind: "NaTo_XL",
                type: 'navigate'
            }, {
                icon: "../../images/sort_list/XL.png",
                name: "校历",
                bind: "../index/xl/xl",
                type: 'navigate'
            },
        ],
        zhcx_list: [ //综合查询列表
            {
                icon: "../../images/fuwu_list/jiaoshi.svg",
                name: "空闲教室",
                bind: "./",
                type: 'navigate',
                need_xh:false
            }, {
                icon: "../../images/KB_select.png",
                name: "课程表",
                bind: "To_kb",
                type: 'switchTab',
                need_xh:true
            }, {
                icon: "../../images/sort_list/CCJ.png",
                name: "成绩表",
                bind: "To_achievement",
                type: 'navigate',
                need_xh:true
            },
        ],
        sjyy_list: [ //数据应用
            {
                icon: "../../images/fuwu_list/jieyue.svg",
                name: "借阅公告",
                bind: "./",
                type: 'navigate'
            }, {
                icon: "../../images/fuwu_list/kaoqin.svg",
                name: "学生考勤",
                bind: "./",
                type: 'navigate'
            }, {
                icon: "../../images/fuwu_list/huaxiang.svg",
                name: "学生画像",
                bind: "./",
                type: 'navigate'
            }, {
                icon: "../../images/fuwu_list/fuwu.svg",
                name: "迎新服务",
                bind: "./",
                type: 'navigate'
            }, {
                icon: "../../images/fuwu_list/tiwen.svg",
                name: "体温填报",
                bind: "./Temperature/Temperature",
                type: 'navigate'
            },
        ],
        xyfw_list: [ //校园服务
            {
                icon: "../../images/fuwu_list/LostFound.svg",
                name: "失物招领",
                bind: "./LostFound/LostFound",
                type: 'navigate'
            }, {
                icon: "../../images/fuwu_list/wenjuan.svg",
                name: "问卷调查",
                bind: "./",
                type: 'navigate'
            }, {
                icon: "../../images/fuwu_list/weixiu.svg",
                name: "维修申请",
                bind: "./",
                type: 'navigate'
            }, {
                icon: "../../images/fuwu_list/sushe.svg",
                name: "宿舍管理",
                bind: "./",
                type: 'navigate'
            },
        ]
    },
    zwkf() {
        wx.showToast({
            title: '暂未开发~',
            icon: "none"
        })
    },
    bind_xh(e) {
        console.log('success', e)
        console.log(app.globalData.user_auth)
    },
    To_kb(){
        if(app.globalData.user_auth){
            wx.switchTab({
              url: '../kb/kb',
            })
        }
        else{
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
    To_achievement(){
        if(app.globalData.user_auth){
            wx.navigateTo({
              url: '../index/achievement/achievement',
            })
        }
        else{
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