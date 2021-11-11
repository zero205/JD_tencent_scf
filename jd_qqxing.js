/*
星系牧场
活动入口：QQ星儿童牛奶京东自营旗舰店->星系牧场
每次都要手动打开才能跑 不知道啥问题
号1默认给我助力,后续接龙 2给1 3给2
 19.0复制整段话 http:/J7ldD7ToqMhRJI星系牧场养牛牛，可获得DHA专属奶！%VAjYb8me2b!→去猄倲←
 
https://lzdz-isv.isvjcloud.com/dingzhi/qqxing/pasture/activity?activityId=90121061401&lng=107.146935&lat=33.255252&sid=cad74d1c843bd47422ae20cadf6fe5aw&un_area=8_573_6627_52446
更新地址：https://raw.githubusercontent.com/Wenmoux/scripts/wen/jd/jd_ddnc_farmpark.js

【原作者 @Wenmoux】

【二次修改 @zero205】

添加：自动喂食；
修改：默认不做加购物车任务，优化黑号处理。By:zero205
需要加购FS_LEVEL=car (或者card,仓库内很多脚本都是这个变量,card=开卡+加购,car=只加购)
环境变量:
CowKeep:保留食物的数量(低于这个才喂食物)
============Quantumultx===============
[task_local]
#星系牧场
45 0,6-23/2 * * * https://raw.githubusercontent.com/Wenmoux/scripts/wen/jd/jd_qqxing.js, tag=星系牧场, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true
*/
const $ = new Env('QQ星系牧场');
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const randomCount = $.isNode() ? 20 : 5;
const notify = $.isNode() ? require('./sendNotify') : '';
let merge = {}
let codeList = []
Exchange = $.isNode() ? (process.env.Cowexchange ? process.env.Cowexchange : false) : ($.getdata("Cowexchange") ? $.getdata("Cowexchange") : false);
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [],
    cookie = '';
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

const JD_API_HOST = `https://api.m.jd.com/client.action`;
message = ""
$.shareuuid = ["8cec00a4917e4af6ae49f8f4f9e7b58d", "f9e36b5518074c85a59abc6451d6216f","2d4ce1b209d7442aaf1a114752277e85"][Math.floor((Math.random() * 3))];
!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
            "open-url": "https://bean.m.jd.com/"
        });
        return;
    }
    console.log(`\n【原作者 @Wenmoux】\nBy:zero205\n添加：自动喂食\n修改：跳过加购物车任务，优化黑号处理\n`);
    console.log(`\n活动入口：QQ星儿童牛奶京东自营旗舰店->我的->星系牧场\n\n懒人直达口令：16:/￥PB4H36E5f6NaPa%，星系牧场养牛牛，可获得DHA专属奶！\n\n【注意】Response code 493 (undefined)报错是正常情况，活动抽风而已，请勿反馈！！！\n`)
    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i];
        if (cookie) {
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.index = i + 1;
            $.cando = true
            $.canrun = true
            $.cow = ""
            $.openCard = true
            $.isLogin = true;
            $.needhelp = true
            $.foodNum = 0
            $.nickName = '';
            $.drawresult = ""
            $.exchange = 0
            console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
                    "open-url": "https://bean.m.jd.com/bean/signIndex.action"
                });
                if ($.isNode()) {
                    await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                }
                continue
            }
            await genToken()
            await getActCk()
            await getToken2()
            await getshopid()
            await getMyPin()
            if (!$.canrun) continue
            await adlog()
            await getUserInfo()
            if ($.cando) {
                await getUid($.shareuuid)
                await getinfo()
                taskList = [...$.taskList, ...$.taskList2]
                for (j = 0; j < taskList.length; j++) {
                    task = taskList[j]
                    console.log(task.taskname)
                    if (task.taskid == "interact") {
                        for (l = 0; l < 20 - task.curNum; l++) {
                            await dotask(task.taskid, task.params)
                            await $.wait(5000)
                        }
                    } else if (task.taskid == "scansku") {
                        await getproduct()
                        await writePersonInfo($.vid)
                        await dotask(task.taskid, $.pparam)
                    } else if (task.taskid == "add2cart") {
                        if(['card','car'].includes(process.env.FS_LEVEL)){
                            await dotask(task.taskid, $.pparam)
                        }else{
                            console.log(`跳过加购物车任务`)
                        }
                    } else {
                        await dotask(task.taskid, task.params)
                        await $.wait(5000)
                    }
                }
                await getinfo()
                await $.wait(3000)
                if ($.score < 50000) {
                let th = $.isNode() ? (process.env.CowKeep ? process.env.CowKeep : 100) : ($.getdata("CowKeep") ? $.getdata("CowKeep") : 100)
                th = Math.max(100,th)
                console.log(`【准备喂食,当前设置食物>${th}则喂食物,可通过设置环境变量CowKeep进行更改,需要大于100】`)
                let boundry = 100
                while($.foodNum >= th && boundry--) {
                    await feed()
                    await $.wait(3000)
                    // await getinfo2()
                    // await $.wait(3000)
                }
            } else {
                console.log(`\n【已升至最高等级，无需喂食，攒饲料兑换奖品吧】\n`)
            }
                for (k = 0; k < $.drawchance; k++) {
                    await draw()
                    await $.wait(2000)
                }
                let exchanges = Math.floor($.foodNum / 3000)
                console.log(`可兑换 ${exchanges} 次 50京🐶`)
                for (q = 0; q < exchanges && Exchange; q++) {
                    await exchange(14)    //16是100豆
                }
                await getinfo()
                if (!Exchange) { console.log("你 默认 不兑换东西,请自行进去活动兑换") }
                message += `【京东账号${$.index}】${$.nickName || $.UserName}\n${$.cow} 兑换京🐶 ${$.exchange}  ${$.drawresult}\n\n`
                if ($.index % 3 === 0) {
                    await $.wait(60 * 1000)
                    console.log("休息休息~")
                }
            } else {
                $.msg($.name, "", "跑不起来了~请自己进去一次牧场")
            }
        }
    }
    if (message.length != 0 && new Date().getHours() == 11) {
        if ($.isNode()) {
            await notify.sendNotify("星系牧场", `${message}\n牧场入口：QQ星儿童牛奶京东自营旗舰店->星系牧场\n\n吹水群：https://t.me/wenmouxx`);
        } else {
            $.msg($.name, "", '星系牧场' + message)
        }
    }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())
//获取活动信息



//genToken
function genToken() {
    let config = {
        url: 'https://api.m.jd.com/client.action?functionId=genToken&clientVersion=10.0.5&build=88679&client=android&d_brand=Xiaomi&d_model=RedmiK30&osVersion=11&screen=2175*1080&partner=xiaomi001&oaid=b30cf82cacfa8972&openudid=290955c2782e1c44&eid=eidAef5f8122a0sf2tNlFbi9TV+3rtJ+jl5UptrTZo/Aq5MKUEaXcdTZC6RfEBt5Jt3Gtml2hS+ZvrWoDvkVv4HybKpJJVMdRUkzX7rGPOis1TRFRUdU&sdkVersion=30&lang=zh_CN&uuid=290955c2782e1c44&aid=290955c2782e1c44&area=8_573_6627_52446&networkType=wifi&wifiBssid=unknown&uts=0f31TVRjBSv3jTHxm2nVw0TY2tLLC%2BbMUWTL7l1wiidLQvx5ZA%2FtBqu04oDVd%2BAlgB%2FjTkTFhNHNpAgtViMD%2FiXVmOPPYYRQmRjsyK4Z61d%2BWQHH%2B3z7HGBUCyPLkYM%2Bb6QgeLXtFB%2FZVoGMidghf8RwpjmGNEtCcEY3WFFPvfKnNZKXPzwSJfkIsVes9jUE6bkyM4YGvjNk24i1yafg5g%3D%3D&uemps=0-0&st=1624319523639&sign=344ece5825b6f9623131c3bcfa42e9bd&sv=122',
        body: 'body=%7B%22action%22%3A%22to%22%2C%22to%22%3A%22https%253A%252F%252Flzdz-isv.isvjcloud.com%252Fdingzhi%252Fqqxing%252Fpasture%252Factivity%252F9559009%253FactivityId%253D90121061401%2526shareUuid%253D8cec00a4917e4af6ae49f8f4f9e7b58d%2526adsource%253Dnull%2526shareuserid4minipg%253DqvjNiWQ2yv8K3NDiWv3DDE7oeVP9kq2pYSH90mYt4m3fwcJlClpxrfmVYaGKuquQkdK3rLBQpEQH9V4tdrrh0w%25253D%25253D%2526shopid%253Dundefined%22%7D&',
        headers: {
            'Host': 'api.m.jd.com',
            'accept': '*/*',
            'user-agent': 'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)',
            'accept-language': 'zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6',
            'content-type': 'application/x-www-form-urlencoded',
            'Cookie': cookie
        }
    }
    return new Promise(resolve => {
        $.post(config, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${$.name} API请求失败，请检查网路重试`);
                    console.log(`${JSON.stringify(err)}`)
                } else {
                    data = JSON.parse(data);
                    $.isvToken = data['tokenKey']
                    //   console.log($.isvToken)
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

//获取pin需要用到
function getToken2() {
    let config = {
        url: 'https://api.m.jd.com/client.action?functionId=isvObfuscator&clientVersion=10.0.4&build=88641&client=android&d_brand=Xiaomi&d_model=RedmiK30&osVersion=11&screen=2175*1080&partner=xiaomi001&oaid=b30cf82cacfa8972&openudid=290955c2782e1c44&eid=eidAef5f8122a0sf2tNlFbi9TV+3rtJ+jl5UptrTZo/Aq5MKUEaXcdTZC6RfEBt5Jt3Gtml2hS+ZvrWoDvkVv4HybKpJJVMdRUkzX7rGPOis1TRFRUdU&sdkVersion=30&lang=zh_CN&uuid=290955c2782e1c44&aid=290955c2782e1c44&area=8_573_6627_52446&networkType=wifi&wifiBssid=unknown&uts=0f31TVRjBSu9ApHUouD8ZP%2BCIJSPfALzaaOxqgfonS67U6HheQNiBOrPSrSFlb95oI9qzuPuELmi%2F%2FXuuWZaM43r%2BL4Fk5d2eLpAtYb0ncWIZn0RtPoGD13HYTyZvdEv4lbuDE3%2Ffs5unT6u6fNdyKyT4khBw%2BCv4LL9n30ljoHX428ThOV2iwP1bxn0hTFM1Yyl%2BracFlZv6oNKsBWeaA%3D%3D&uemps=0-0&st=1624067570330&sign=189b90a2a6ac9cbd6c1017085f1baec2&sv=111',
        body: 'body=%7B%22id%22%3A%22%22%2C%22url%22%3A%22https%3A%2F%2Flzdz-isv.isvjcloud.com%22%7D&',
        headers: {
            'Host': 'api.m.jd.com',
            'accept': '*/*',
            'user-agent': 'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)',
            'accept-language': 'zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6',
            'content-type': 'application/x-www-form-urlencoded',
            'Cookie': cookie
        }
    }
    return new Promise(resolve => {
        $.post(config, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    $.token2 = data['token']
                    //     console.log($.token2)
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}




//抄的书店的 不过不加好像也能进去
function getActCk() {
    return new Promise(resolve => {
        $.get(taskUrl("/dingzhi/qqxing/pasture/activity", `activityId=90121061401&lng=107.146945&lat=33.255267&sid=cad74d1c843bd47422ae20cadf6fe5aw&un_area=27_2442_2444_31912`), (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${$.name} getActCk API请求失败，请检查网路重试`)
                } else {
                    if ($.isNode())
                        for (let ck of resp['headers']['set-cookie']) {
                            cookie = `${cookie}; ${ck.split(";")[0]};`
                        }
                    else {
                        for (let ck of resp['headers']['Set-Cookie'].split(',')) {
                            cookie = `${cookie}; ${ck.split(";")[0]};`
                        }
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

//获取我的pin
function getshopid() {
    let config = taskPostUrl("/dz/common/getSimpleActInfoVo", "activityId=90121061401")
    return new Promise(resolve => {
        $.post(config, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} getshopid API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    if (data.result) {
                        $.shopid = data.data.shopId
                        //    console.log($.shopid)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

//获取我的pin
function getMyPin() {
    let config = taskPostUrl("/customer/getMyPing", `userId=${$.shopid}&token=${encodeURIComponent($.token2)}&fromType=APP`)
    //   console.log(config)
    return new Promise(resolve => {
        $.post(config, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} getMyPin API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    if (data.data && data.data == 400001) {
                        console.log(`${data.errorMessage}\n`);
                        $.canrun = false
                    } else {
                        if (data.data && data.data.secretPin) {
                            $.pin = data.data.secretPin
                            $.nickname = data.data.nickname
                            console.log(`欢迎回来~  ${$.nickname}`);
                        }
                        if ($.isNode())
                            for (let ck of resp['headers']['set-cookie']) {
                                cookie = `${cookie}; ${ck.split(";")[0]};`
                            } else {
                            for (let ck of resp['headers']['Set-Cookie'].split(',')) {
                                cookie = `${cookie}; ${ck.split(";")[0]};`
                            }
                        }
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

function adlog() {
    let config = taskPostUrl("/common/accessLogWithAD", `venderId=1000361242&code=99&pin=${encodeURIComponent($.pin)}&activityId=90121061401&pageUrl=https%3A%2F%2Flzdz-isv.isvjcloud.com%2Fdingzhi%2Fqqxing%2Fpasture%2Factivity%3FactivityId%3D90121061401%26lng%3D107.146945%26lat%3D33.255267%26sid%3Dcad74d1c843bd47422ae20cadf6fe5aw%26un_area%3D27_2442_2444_31912&subType=app&adSource=`)
    //   console.log(config)
    return new Promise(resolve => {
        $.post(config, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    //  data = JSON.parse(data);
                    // if ($.isNode())
                    //     for (let ck of resp['headers']['set-cookie']) {
                    //         cookie = `${cookie}; ${ck.split(";")[0]};`
                    //     }
                    // else {
                    //     for (let ck of resp['headers']['Set-Cookie'].split(',')) {
                    //         cookie = `${cookie}; ${ck.split(";")[0]};`
                    //     }
                    // }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}



// 获得用户信息  
function getUserInfo() {
    return new Promise(resolve => {
        let body = `pin=${encodeURIComponent($.pin)}`
        let config = taskPostUrl('/wxActionCommon/getUserInfo', body)
        //   console.log(config)
        $.post(config, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    if (data.data) {
                        $.userId = data.data.id
                        $.pinImg = data.data.yunMidImageUrl
                        $.nick = data.data.nickname
                    } else {
                        $.cando = false
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

function getUid() {
    return new Promise(resolve => {
        let body = `activityId=90121061401&pin=${encodeURIComponent($.pin)}&pinImg=${$.pinImg}&nick=${encodeURIComponent($.nick)}&cjyxPin=&cjhyPin=&shareUuid=${$.shareuuid}`
        $.post(taskPostUrl('/dingzhi/qqxing/pasture/activityContent', body), async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    if (data.result) {
                        if (data.data.openCardStatus != 3) {
                            console.log("当前未开卡,无法助力和兑换奖励哦")
                        }
                        $.shareuuid = data.data.uid
                        console.log(`\n【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${$.shareuuid}\n`);
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

//获取任务列表
function getinfo() {
    let config = taskPostUrl("/dingzhi/qqxing/pasture/myInfo", `activityId=90121061401&pin=${encodeURIComponent($.pin)}&pinImg=${$.pinImg}&nick=${$.nick}&cjyxPin=&cjhyPin=&shareUuid=${$.shareuuid}`)
    return new Promise(resolve => {
        $.post(config, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} getinfo API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    if (data.result) {
                        $.taskList = data.data.task.filter(x => (x.maxNeed == 1 && x.curNum == 0) || x.taskid == "interact")
                        $.taskList2 = data.data.task.filter(x => x.maxNeed != 1 && x.type == 0)
                        $.draw = data.data.bags.filter(x => x.bagId == 'drawchance')[0]
                        $.food = data.data.bags.filter(x => x.bagId == 'food')[0]
                        $.sign = data.data.bags.filter(x => x.bagId == 'signDay')[0]
                        $.score = data.data.score
                        //    console.log(data.data.task)
                        let helpinfo = data.data.task.filter(x => x.taskid == 'share2help')[0]
                        if (helpinfo) {
                            console.log(`今天已有${helpinfo.curNum}人为你助力啦`)
                            if (helpinfo.curNum == 20) {
                                $.needhelp = false
                            }
                        }
                        $.cow = `当前🐮🐮成长值：${$.score}  饲料：${$.food.totalNum - $.food.useNum}  抽奖次数：${$.draw.totalNum - $.draw.useNum}  签到天数：${$.sign.totalNum}`
                        $.foodNum = $.food.totalNum - $.food.useNum
                        console.log($.cow)
                        $.drawchance = $.draw.totalNum - $.draw.useNum
                    } else {
                        $.cando = false
                        //     console.log(data)
                        console.log(data.errorMessage)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })

}

// 获取浏览商品
function getproduct() {
    return new Promise(resolve => {
        let body = `type=4&activityId=90121061401&pin=${encodeURIComponent($.pin)}&actorUuid=${$.uuid}&userUuid=${$.uuid}`
        $.post(taskPostUrl('/dingzhi/qqxing/pasture/getproduct', body), async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    // console.log(data)
                    if (data.data && data.data[0]) {
                        $.pparam = data.data[0].id
                        $.vid = data.data[0].venderId
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

// 获取浏览商品
function writePersonInfo(vid) {
    return new Promise(resolve => {
        let body = `jdActivityId=1404370&pin=${encodeURIComponent($.pin)}&actionType=5&venderId=${vid}&activityId=90121061401`

        $.post(taskPostUrl('/interaction/write/writePersonInfo', body), async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    console.log("浏览：" + $.vid)
                    console.log(data)
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

function feed() {
    return new Promise(resolve => {
        let body = `activityId=90121061401&pin=${encodeURIComponent($.pin)}&actorUuid=${$.uuid}&userUuid=${$.uuid}`
        $.post(taskPostUrl('/dingzhi/qqxing/pasture/feed', body), async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    if (data.data && data.result) {
                        console.log(`喂食成功`)
                        $.foodNum -= 100
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

//兑换商品
function exchange(id) {
    return new Promise(resolve => {
        let body = `pid=${id}&activityId=90121061401&pin=${encodeURIComponent($.pin)}&actorUuid=&userUuid=`
        $.post(taskPostUrl('/dingzhi/qqxing/pasture/exchange?_', body), async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    //   console.log()
                    if (data.result) {
                        console.log(`兑换 ${data.data.rewardName}成功`)
                        $.exchange += 20
                    } else {
                        console.log(JSON.stringify(data))
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

function dotask(taskId, params) {
    let config = taskPostUrl("/dingzhi/qqxing/pasture/doTask", `taskId=${taskId}&${params ? ("param=" + params + "&") : ""}activityId=90121061401&pin=${encodeURIComponent($.pin)}&actorUuid=${$.uuid}&userUuid=${$.shareuuid}`)
    //     console.log(config)
    return new Promise(resolve => {
        $.post(config, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    if (data.result) {
                        if (data.data.food) {
                            console.log("操作成功,获得饲料： " + data.data.food + "  抽奖机会：" + data.data.drawChance + "  成长值：" + data.data.growUp)
                        }
                    } else {
                        console.log(data.errorMessage)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })

}

function draw() {
    let config = taskPostUrl("/dingzhi/qqxing/pasture/luckydraw", `activityId=90121061401&pin=${encodeURIComponent($.pin)}&actorUuid=&userUuid=`)
    //  console.log(config)
    return new Promise(resolve => {
        $.post(config, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    if (data.result) {
                        if (Object.keys(data.data).length == 0) {
                            console.log("抽奖成功,恭喜你抽了个寂寞： ")
                        } else {
                            console.log(`恭喜你抽中 ${data.data.prize.rewardName}`)
                            $.drawresult += `恭喜你抽中 ${data.data.prize.rewardName} `
                        }
                    } else {
                        console.log(data.errorMessage)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}
function taskUrl(url, body) {
    const time = Date.now();
    //  console.log(cookie)
    return {
        url: `https://lzdz-isv.isvjcloud.com${url}?${body}`,
        headers: {
            'Host': 'lzdz-isv.isvjcloud.com',
            'Accept': 'application/json',
            //     'X-Requested-With': 'XMLHttpRequest',
            'Referer': 'https://lzdz-isv.isvjcloud.com/dingzhi/qqxing/pasture/activity/6318274?activityId=90121061401&shareUuid=15739046ca684e8c8fd303c8a14e889a&adsource=null&shareuserid4minipg=Ej42XlmwUZpSlF8TzjHBW2Sy3WQlSnqzfk0%2FaZMj9YjTmBx5mleHyWG1kOiKkz%2Fk&shopid=undefined&lng=107.146945&lat=33.255267&sid=cad74d1c843bd47422ae20cadf6fe5aw&un_area=8_573_6627_52446',
            'user-agent': 'jdapp;android;10.0.4;11;2393039353533623-7383235613364343;network/wifi;model/Redmi K30;addressid/138549750;aid/290955c2782e1c44;oaid/b30cf82cacfa8972;osVer/30;appBuild/88641;partner/xiaomi001;eufv/1;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 11; Redmi K30 Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045537 Mobile Safari/537.36',
            'content-type': 'application/x-www-form-urlencoded',
            'Cookie': `${cookie} IsvToken=${$.IsvToken};AUTH_C_USER=${$.pin}`,
        }
    }
}



function taskPostUrl(url, body) {
    return {
        url: `https://lzdz-isv.isvjcloud.com${url}`,
        body: body,
        headers: {
            'Host': 'lzdz-isv.isvjcloud.com',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': 'https://lzdz-isv.isvjcloud.com/dingzhi/qqxing/pasture/activity/6318274?activityId=90121061401&shareUuid=15739046ca684e8c8fd303c8a14e889a&adsource=null&shareuserid4minipg=Ej42XlmwUZpSlF8TzjHBW2Sy3WQlSnqzfk0%2FaZMj9YjTmBx5mleHyWG1kOiKkz%2Fk&shopid=undefined&lng=107.146945&lat=33.255267&sid=cad74d1c843bd47422ae20cadf6fe5aw&un_area=8_573_6627_52446',
            'user-agent': 'jdapp;android;10.0.4;11;2393039353533623-7383235613364343;network/wifi;model/Redmi K30;addressid/138549750;aid/290955c2782e1c44;oaid/b30cf82cacfa8972;osVer/30;appBuild/88641;partner/xiaomi001;eufv/1;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 11; Redmi K30 Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045537 Mobile Safari/537.36',
            'content-type': 'application/x-www-form-urlencoded',
            'Cookie': `${cookie} IsvToken=${$.IsvToken};AUTH_C_USER=${$.pin};`,
        }
    }
}




function jsonParse(str) {
    if (typeof str == "string") {
        try {
            return JSON.parse(str);
        } catch (e) {
            console.log(e);
            $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
            return [];
        }
    }
}
// prettier-ignore
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
