// pages/fuwu/LostFound/LostFound_add/LostFound_add.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        array1: ['数码设备', '证件', '日用品', '服饰'],
        index1: -1,
        date: '',
        img_list: [],
        //flag0-5分别对应--->物品状态/物品类型/物品名称/遗失地点/详细描述
        flag0: true,
        flag1:true,
        flag2:true,
        flag3:true,
        flag4:true,
    },
    bindradiochange(e) { //物品状态
        console.log(e.detail.value)
        this.setData({
            flag0: false
        })
    },
    bindPickerChange: function (e) { //物品类型
        console.log(e.detail.value)
        this.setData({
            index1: e.detail.value[0],
            flag1: false
        })
    },
    bindDateChange: function (e) {//物品日期
        console.log(e.detail.value)
        this.setData({
            date: e.detail.value
        })
    },
    bindnamechange(e) {//物品名称
        if (e.detail.value.trim() == '') {
            this.setData({
                flag2:true
            })
        } else {
            this.setData({
                flag2:false
            })
        }
    },
    bindplacechange(e) {//物品地点
        if (e.detail.value.trim() == '') {
            this.setData({
                flag3:true
            })
        } else {
            this.setData({
                flag3:false
            })
        }
    },
    bindcontentchange(e) {//详细描述
        if (e.detail.value.trim() == '') {
            this.setData({
                flag4:true
            })
        } else {
            this.setData({
                flag4:false
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const time = new Date();
        const month = time.getMonth() + 1
        const day = time.getDate()
        this.setData({
            date: time.getFullYear() + "-" + (month >= 10 ? month : "0" + month) + "-" + (day >= 10 ? day : "0" + day),
        });
    },
    chooseImage(e) {
        if (this.data.img_list >= 3) {
            return
        }
        console.log(e)
        var that = this
        wx.chooseMedia({
            count: 3,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            sizeType: ['original', 'compressed'],
            camera: ['back'],
            success(res) {
                console.log(res.tempFiles)
                var list = that.data.img_list
                for (let i = list.length, j = 0; j < res.tempFiles.length && i < 3; i++, j++) {
                    list[i] = res.tempFiles[j].tempFilePath
                }
                console.log(list)
                that.setData({
                    img_list: list
                })
            }
        })
    },
    uploadImage(imgs, index) {
        const name = Math.random() * 1000000;
        wx.cloud.uploadFile({
            cloudPath: 'LostFound/' + name + (new Date()).getTime() + imgs[index].match(/\.[^.]+?$/),
            filePath: imgs[index],
            success: (res) => {
                console.log(res.fileID)
            },
            complete: () => {
                index++
                if (index != imgs.length) {
                    this.uploadImage(imgs, index)
                }
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