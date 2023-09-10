// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router') //引入一个模块
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _=db.command
// 云函数入口函数
exports.main = async (event, context) => {
    const app = new TcbRouter({
        event
    })
    app.use(async (ctx, next) => {
        ctx.data1 = {} //定义ctx对象里面的空属性对象 用来存放数据
        //ctx.data1.openId = event.userInfo.openId;
        await next(); // 执行下一中间件
    })
    app.router('getphone',async (ctx,next)=>{
        const res=await cloud.openapi.phonenumber.getPhoneNumber({
            code:event.data.code
        })
        ctx.data1.res=res
        ctx.body={
            data:ctx.data1
        }
    })
    app.router('gettoday',async (ctx,next)=>{
        //目前教务系统崩溃了，所以暂时改成通过openid来验证
        const now=new Date().getTime()+8*60*60*1000
        const today=new Date(Math.floor(now/(24*60*60*1000))*(24*60*60*1000)).getTime()//舍弃小数点后面的位数再乘则为当天0点时间
        const tomorrow=today+24*60*60*1000
        console.log('today',today,'tomorrow',tomorrow)
        const res=await db.collection('Temperature').where({
            openid:event.userInfo.openId,
            timestamp:_.gte(today).and(_.lte(tomorrow))
        }).orderBy('timestamp','asc').get()
        ctx.data1.res = res
        ctx.body={
            data:ctx.data1
        }
    })
    app.router('tianbao',async(ctx,next)=>{
        if(event.data.Temp_int==0){
            ctx.data1.code=410//传回的温度为0.x
            ctx.data1.error='请填写正确的体温！'
        }
        else{
            const hour=event.data.hour
            const minute=event.data.minute
            if(hour<5){
                ctx.data1.code=411
                ctx.data1.error='填报时间从5点开始填报'
            }
            else{
                const now=new Date().getTime()+8*60*60*1000
                const today=new Date(Math.floor(now/(24*60*60*1000))*(24*60*60*1000)).getTime()//舍弃小数点后面的位数再乘则为当天0点时间
                const tbtime=today+hour*60*60*1000+minute*60*1000//用于比较
                if(now<tbtime){
                    ctx.data1.code=412//现在的时间比填报的时间早,
                    ctx.data1.error='现在的时间还早，填报的时间有误'
                }
                else{
                    const tomorrow=today+24*60*60*1000
                    // console.log('today',today,'tomorrow',tomorrow)
                    const res=await db.collection('Temperature').where({
                        openid:event.userInfo.openId,
                        timestamp:_.gte(today).and(_.lte(tomorrow))
                    }).orderBy('timestamp','desc').get()
                    ctx.check=res
                    ctx.tbtime=tbtime
                    await next();
                }
            }
        }
        ctx.body={
            data:ctx.data1
        }
    },async(ctx)=>{
        if(ctx.check.data.length>=3){
            ctx.data1.code=413
            ctx.data1.error="今天已经填报3次体温了，不需要再填报了"
        }
        else{
            if(ctx.check.data.length){
                if(Math.abs(ctx.tbtime-ctx.check.data[0].timestamp)>=10800000){
                    const result=await db.collection('Temperature').add({
                        data:{
                            openid:event.userInfo.openId,
                            time:(event.data.hour>=10?event.data.hour:'0'+event.data.hour)+":"+(event.data.minute>=10?event.data.minute:'0'+event.data.minute),
                            timestamp:ctx.tbtime,
                            Temp:event.data.Temp_int+"."+event.data.Temp_point
                        }
                    })
                    ctx.data1.code=200
                    ctx.data1.res=result
                }
                else{
                    ctx.data1.code=414
                    ctx.data1.error="两次填报的时间没有达到3小时"
                }
            }
            else{
                const result=await db.collection('Temperature').add({
                    data:{
                        openid:event.userInfo.openId,
                        time:(event.data.hour>=10?event.data.hour:'0'+event.data.hour)+":"+(event.data.minute>=10?event.data.minute:'0'+event.data.minute),
                        timestamp:ctx.tbtime,
                        Temp:event.data.Temp_int+"."+event.data.Temp_point
                    }
                })
                ctx.data1.code=200
                ctx.data1.res=result
            }
        }        
    })
    return app.serve()
}