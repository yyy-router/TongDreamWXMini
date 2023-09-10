// pages/fuwu/Temperature/Temperature.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        height:0,
        width:0,
        Temp_int:0,
        Temp_point:0,
        history:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const window=wx.getSystemInfoSync()
        // console.log(window)//获取当前机型信息，主要获取屏幕高度和宽度
        const time=new Date()
        const month=time.getMonth()+1
        const date=time.getDate()
        const hour=time.getHours()
        const minute=time.getMinutes()
        this.setData({
            height:window.windowHeight,
            width:window.windowWidth,
            time:time.getFullYear()+"-"+(month>=10?month:"0"+month)+"-"+(date>=10?date:"0"+date)+" ",
            hour:hour>=10?hour:'0'+hour,
            minute:minute>=10?minute:'0'+minute
        })
        wx.cloud.callFunction({
            name:'tw',
            data:{
                $url:'gettoday',
            }
        }).then(res=>{
            var jilu=res.result.data.res.data//今日填报完成的历史记录
            console.log(jilu)
            this.setData({
                history:jilu
            })
        })
    },
    changetime(e){
        var change=e.detail.value.split(":")
        this.setData({
            hour:change[0],
            minute:change[1]
        })
    },
    changeTemp(e){
        var Temp=e.detail.value
        this.setData({
            Temp_int:Temp[0]+35,
            Temp_point:Temp[1]
        })
    },
    sumbit(){
        if(this.data.Temp_int==0){
            wx.showToast({
              title: '请填写体温',
              icon:'none'
            })
            return
        }
        wx.showLoading({
          title: '请稍后',
        })
        const hour=Number(this.data.hour)
        const minute=Number(this.data.minute)
        console.log("时间:"+hour+":"+minute,"体温:"+this.data.Temp_int+"."+this.data.Temp_point+"℃")
        wx.cloud.callFunction({
            name:"tw",
            data:{
                $url:"tianbao",
                data:{
                    hour:hour,
                    minute:minute,
                    Temp_int:this.data.Temp_int,
                    Temp_point:this.data.Temp_point
                }
            }
        }).then(res=>{
            wx.hideLoading()
            if(res.result.data.code==200){
                wx.showToast({
                  title: '填报成功',
                  duration:1500,
                  icon:'success'
                })
                var jilu=this.data.history
                jilu.push({'Temp':this.data.Temp_int+'.'+this.data.Temp_point,'time':(hour>=10?hour:'0'+hour)+":"+(minute>=10?minute:'0'+minute)})
                if(jilu.length>=2){//填报时间必须间隔3小时，则判断hour大小排序
                    let jilu_hour=Array()
                    let num=jilu.length-1
                    for(let i=0;i<num+1;i++){
                        jilu_hour[i]=Number(jilu[i].time.split(':')[0])
                    }
                    let temp_index=num
                    //由于一次填报插入一次，插入的原先数据是有序的
                    for(let i=0;i<num;i++){
                        if(jilu_hour[i]>jilu_hour[num]){
                            temp_index=i
                        }
                    }
                    if(temp_index!=num){
                        let temp=jilu[temp_index]
                        jilu[temp_index]=jilu[num]
                        jilu[num]=temp
                    }
                }
                this.setData({
                    history:jilu
                })
            }
            else{
                wx.showToast({
                  title: res.result.data.error,
                  duration:1500,
                  icon:'none'
                })
            }
            console.log(res)
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