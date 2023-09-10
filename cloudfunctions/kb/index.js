// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')
const TcbRouter = require('tcb-router') //引入一个模块
const CryptoJS = require('./aes_util.js') //引入Aes源码js
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
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

  //绑定学号
  app.router('bind_xh', async (ctx, next) => {
    console.log("绑定学号")
    console.log(event)
    var options = {
      uri: '',
      qs: {
        username: event.data.account,
        password: event.data.passwd
      },
      json: true //自动解析响应中的json字符串
    }
    var res = await rp(options)
    ctx.data1.event = event
    ctx.data1.res = res
    ctx.body = {
      data: ctx.data1
    }
  })

  //查询学生信息
  app.router('get_user_info', async (ctx, next) => {
    var options = {
      uri: '',
      qs: {
        token: event.data.token,
      },
      json: true //自动解析响应中的json字符串
    }
    var res = await rp(options)
    ctx.data1.res = res
    ctx.body = {
      data: ctx.data1
    }
  })

  //查询学生成绩
  app.router('get_score', async (ctx, next) => {
    var options = {
      uri: '',
      qs: {
        token: event.data.token,
        term: event.data.xqm,
        year: event.data.xnm
      },
      json: true //自动解析响应中的json字符串
    }
    var res = await rp(options)
    ctx.data1.res = res
    ctx.body = {
      data: ctx.data1
    }
  })

  //查询课表
  app.router('get_class', async (ctx, next) => {
    var options = {
      uri: '',
      qs: {
        token: event.data.token,
        year: event.data.year,
        term: event.data.term
      },
      json: true //自动解析响应中的json字符串
    }
    var res = await rp(options)
    ctx.data1.res = res
    ctx.body = {
      data: ctx.data1
    }
  })

  //数据库查看用户信息
  app.router('get_db_user_info', async (ctx, next) => {
    var res = await db.collection('users_info').where({
      _openid: event.userInfo.openId
    }).get()
    console.log(res)
    ctx.data1.res = res
    ctx.body = {
      data: ctx.data1
    }
  })

  //查看是否绑定学号
  app.router('is_bind_xh', async (ctx, next) => {
    var res = await db.collection('users_info').where({
      _openid: event.userInfo.openId
    }).get()
    ctx.data1.res = res
    ctx.body = {
      data: ctx.data1
    }
  })


  //查看用户信息
  app.router('get_user_info', async (ctx, next) => {
    var res = await db.collection('users_info').where({
      _openid: event.userInfo.openId
    }).get()
    ctx.data1.res = res
    ctx.body = {
      data: ctx.data1
    }

  })

  //查看周数
  app.router('get_zs', async (ctx, next) => {
    var res = await db.collection('kx_date').doc("1").get()
    ctx.data1.event = event
    ctx.data1.res = res
    ctx.body = {
      data: ctx.data1
    }

  })
  app.router('xl', async (ctx, next) => {
    var res = await db.collection('xl').orderBy('time', 'desc').limit(1).get()
    ctx.data1.res = res
    ctx.body = {
      data: ctx.data1
    }
  })
  app.router('jingyan', async (ctx, next) => {
    var res = await db.collection('jingyan').get()
    ctx.data1.res = res
    ctx.body = {
      data: ctx.data1
    }
  })
  //校园新闻和教务通知
  app.router('news', async (ctx, next) => {
    if (event.data) {
      console.log(event.data.id)
      var options = {
        uri: '' + event.data.id + '.php',
        qs: {
          number: event.data.newsnumber
        },
        json: true //自动解析响应中的json字符串
      }
      var res = await rp(options)
      ctx.data1.res = res
    } else {
      var options = {
        uri: '',
        json: true //自动解析响应中的json字符串
      }
      var res = await rp(options)
      var options2 = {
        uri: '',
        json: true //自动解析响应中的json字符串
      }
      var res2 = await rp(options2)
      var options3 = {
        uri: '',
        json: true //自动解析响应中的json字符串
      }
      var res3 = await rp(options3)
      ctx.data1.res = res
      ctx.data1.res2 = res2
      ctx.data1.res3 = res3
    }
    ctx.body = {
      data: ctx.data1
    }
  })
  //获取对应某一新闻的具体内容
  app.router('news_article', async (ctx, next) => {
    console.log('news_article', event.data.href)
    var options = {
      uri: '',
      qs: {
        href: event.data.href
      },
      json: true //自动解析响应中的json字符串
    }
    var res = await rp(options)
    ctx.data1.res = res
    ctx.body = {
      data: ctx.data1
    }
  })
  //获得具体某一页教务通知
  app.router('jwtz_article', async (ctx, next) => {
    console.log('jwtz_article', event.data.href)
    var options = {
      uri: '',
      qs: {
        href: event.data.href
      },
      json: true //自动解析响应中的json字符串
    }
    var res = await rp(options)
    ctx.data1.res = res
    ctx.body = {
      data: ctx.data1
    }
  })
  return app.serve()
}