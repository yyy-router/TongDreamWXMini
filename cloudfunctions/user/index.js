// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router') //引入一个模块
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

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
    app.router('add_user', async (ctx, next) => { //添加用户
        const check = await db.collection('users').where({
            openid: event.userInfo.openId
        }).get()
        console.log(check)
        ctx.check = check
        await next();
        ctx.body = {
            data: ctx.data1
        }
    }, async (ctx) => {
        if (ctx.check.data.length == 0) { //判断是否存有记录
            const res = await db.collection('users').add({ //无记录添加
                data: {
                    openid: event.userInfo.openId,
                    username: event.data.username,
                    avatarUrl: event.data.avatarUrl,
                    time: new Date().getTime()
                }
            })
            ctx.data1.res = res
        } else {
            const res = await db.collection('users').where({ //有记录更新
                openid: event.userInfo.openId
            }).update({
                data: {
                    username: event.data.username,
                    avatarUrl: event.data.avatarUrl,
                    time: new Date().getTime()
                }
            })
            ctx.data1.res = res
        }
    })
    app.router('get_user', async (ctx, next) => { //获取用户信息，授权时长超过一周，即为未授权，需要重新授权获取信息更新
        let res = await db.collection('users').where({
            openid: event.userInfo.openId
        }).get() //先查询是否存在
        console.log('first', res, 'length', res.data[0].length)
        if (res.data[0].length != 0) {
            const now = new Date().getTime() //获取时间
            console.log('有效时间', res.data[0].time < now - 7 * 24 * 60 * 60 * 1000, res.data[0].time, now - 7 * 24 * 60 * 60 * 1000)
            if (res.data[0].time < now - 7 * 24 * 60 * 60 * 1000) { //判断是否授权距离时长是否达到一周
                res.data[0] = []
            }
        }
        console.log('second', res, 'length', res.data.length)
        ctx.data1.res = res
        ctx.body = {
            data: ctx.data1
        }
    })
    return app.serve()
}