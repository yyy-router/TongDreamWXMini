// pages/index/xl.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        img_url: ""//校历图片
    },
    img_view(e) {
        wx.previewImage({
            urls: [this.data.img_url],
            showmenu:true
        })
    }
})