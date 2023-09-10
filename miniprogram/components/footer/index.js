// components/footer/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        footer_list:[
            {
                name:"首页",
                bind:"To_Main"
            },{
                name:"关于我们",
                bind:"To_About"
            },{
                name:"管理后台",
                bind:"To_Admin"
            }
        ]
    },

    /**
     * 组件的方法列表
     */
    methods: {
        To_Main(){
            wx.switchTab({
                url:'../../pages/index/index'
            })
        },
        To_About(){
            wx.navigateTo({
              url: '../../pages/about/about',
            })
        },
        To_Admin(){
            wx.navigateTo({
              url: '../../pages/admin/admin',
            })
        },
    }
})
