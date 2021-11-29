/*
活动入口：京东金融-天天提鹅
定时收鹅蛋,兑换金币
已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#天天提鹅
10 * * * * https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_daily_egg.js, tag=天天提鹅, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jdte.png, enabled=true

================Loon==============
[Script]
cron "10 * * * *" script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_daily_egg.js,tag=天天提鹅

===============Surge=================
天天提鹅 = type=cron,cronexp="10 * * * *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_daily_egg.js

============小火箭=========
天天提鹅 = type=cron,script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_daily_egg.js, cronexpr="10 * * * *", timeout=3600, enable=true
 */
const $ = new Env('天天提鹅');
let cookiesArr = [], cookie = '';
const JD_API_HOST = 'https://ms.jr.jd.com/gw/generic/uc/h5/m';
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const dailyEggUrl = "https://active.jd.com/forever/btgoose/?channelLv=yxjh&jrcontainer=h5&jrlogin=true"
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const { JSDOM } = $.isNode() ? require('jsdom') : '';
const { window } = new JSDOM(``, { url: dailyEggUrl, runScripts: "outside-only", pretentToBeVisual: true, resources: "usable" })
const Faker = require('./JDSignValidator.js')
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  window.eval(await downloadUrl(`https://storage.360buyimg.com/rama/common/btgoose/aar.min.js`))
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      $.stopNext = false
      await TotalBean();
      console.log(`\n***********开始【京东账号${$.index}】${$.nickName || $.UserName}********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      const fakerBody = Faker.getBody(dailyEggUrl)
      $.fp = fakerBody.fp
      $.eid = await getClientData(fakerBody)
      $.token = (await downloadUrl("https://gia.jd.com/m.html")).match(/var\s*?jd_risk_token_id\s*?=\s*["`'](\S*?)["`'];?/)?.[1] || ""
      await jdDailyEgg();
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })
async function jdDailyEgg() {
  await toDailyHome()
  if ($.stopNext) return
  if ($.isFirstLogin) {
    await toDailySignIn()
  }
  await toWithdraw()
  await doTask()
  await toGoldExchange();
}

async function doTask(funcMissionId = null) {
  let errMissionID = [3410]
  errMissionID = [...errMissionID, ...errMissionID.map(x => x.toString())]
  const taskWaitTime = 15
  let res
  let taskList = (await doApi("queryGooseTaskList", false))?.data ?? []
  taskList = taskList.filter(x => [-1, 0, 1].includes(x.status) && !errMissionID.includes(x.missionId))
  if (funcMissionId) taskList = taskList.filter(x => x.missionId === funcMissionId)
  for (let task of taskList) {
    let { doLink, missionId, awards, name, position, status } = task
    switch (status) {
      case -1:
        res = await doApi("receiveGooseTask", false, { missionId })
        console.log(`领任务'${name}'结果：${res.code === "0000" ? "成功！" : `失败！原因：${res.msg}`}`)
        await $.wait(3000)
        if (res.code === "0000") {
          await doTask(missionId)
          return
        }
        break
      // 正在做
      case 0:
        var tempBody = {}
        Object.assign(tempBody, { missionId: doLink.getValByKey("missionId"), readTime: +(doLink.getValByKey("readTime") || "-1") })
        if (tempBody.missionId && typeof tempBody.readTime !== -1) {
          res = await doApi("queryMissionReceiveAfterStatus", false, { missionId: tempBody.missionId })
          await $.wait(tempBody.readTime * 1e3)
          res = await doApi("finishReadMission", false, tempBody)
          if (res.code === "0000") {
            await doTask(missionId)
          } else {
            console.log(`做任务'${name}'结果：失败！原因：${res.msg}`)
          }
          return
        } else if (doLink.getValByKey("juid")) {
          res = await doApi("getJumpInfo", false, { juid: doLink.getValByKey("juid") })
          if (res.code === "0000") {
            await doTask(missionId)
          } else {
            console.log(`做任务'${name}'结果：失败！原因：${res.msg}`)
          }
          return
        }
        break
      // 领奖状态
      case 1:
        awards = awards[0] ?? awards
        let { awardRealNum, awardName } = awards
        let msg = []
        msg.push(funcMissionId ? `做任务'${name}'结果：成功！` : `任务'${name}'已可领奖。`)
        msg.push("领奖励结果：")
        res = await doApi("receiveGooseTaskReward", false, { missionId })
        msg.push(res.code === "0000" ? `成功！获得${awardRealNum}${awardName.replace(/^个?/, "个")}` : `失败！原因：${res.msg}`)
        console.log(msg.join(""))
        break
      // 已完成
      case 2:
      default:
    }
  }
}

function toGoldExchange() {
  return new Promise(async resolve => {
    const body = getBody()
    $.get(taskUrl('toGoldExchange', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // console.log(data)
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.code === '0000') {
                console.log(`兑换金币:${data.resultData.data.cnumber}`);
                console.log(`当前总金币:${data.resultData.data.goldTotal}`);
              } else if (data.resultData.code !== '0000') {
                console.log(`兑换金币失败:${data.resultData.msg}`)
              }
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function toWithdraw() {
  return new Promise(async resolve => {
    const body = getBody()
    $.get(taskUrl('toWithdraw', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // console.log(data)
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.code === '0000') {
                console.log(`收取鹅蛋:${data.resultData.data.eggTotal}个成功`);
                console.log(`当前总鹅蛋数量:${data.resultData.data.userLevelDto.userHaveEggNum}`);
              } else if (data.resultData.code !== '0000') {
                console.log(`收取鹅蛋失败:${data.resultData.msg}`)
              }
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function toDailyHome() {
  $.isFirstLogin = false
  return new Promise(async resolve => {
    const body = getBody(true)
    $.get(taskUrl('toDailyHome', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // console.log(data)
            data = JSON.parse(data);
            if (data.resultData.code !== "0000") {
              $.stopNext = true
              console.log($.name + `（${arguments.callee.name}）` + "：" + data.resultData.msg)
              return
            }
            let shareUuid = data?.resultData?.data?.shareUuid
            if (!$.shareUuid && typeof shareUuid === 'string') Object.assign($, { shareUuid })
            let isFirstLogin = data?.resultData?.data?.isFristLogin
            if (typeof isFirstLogin === 'string') {
              $.isFirstLogin = (() => { try { return JSON.parse(isFirstLogin) } catch (e) { return false } })()
            } else if (typeof isFirstLogin === 'boolean') {
              Object.assign($, { isFirstLogin })
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function ots(t) {
  if (typeof t === 'object') {
    return JSON.stringify(t)
  }
  return t
}
async function doApi(functionId = "", withSign = false, preBody = {}, preUrl = "") {
  let body = { ...preBody, ...getBody(withSign) }
  switch (functionId) {
    case "receiveGooseTask":
      body = {
        missionId: preBody.missionId.toString(),
        shareUuid: $.inviteId ?? "",
        riskDeviceInfo: $.riskDeviceInfo,
        channelLv: "yxjh",
        environment: "jrApp",
      }
      break
    case 'receiveGooseTaskReward':
      body = {
        missionId: preBody.missionId.toString(),
        riskDeviceInfo: $.riskDeviceInfo,
        channelLv: "yxjh",
        environment: "jrApp",
      }
      break
    case 'queryMission':
    case 'queryPlayActiveHelper':
    case 'queryMissionReceiveAfterStatus':
    case 'finishReadMission':
    case 'getJumpInfo':
      preUrl = `https://ms.jr.jd.com/gw/generic/mission/h5/m/${functionId}?reqData=`
      preUrl += JSON.stringify(preBody).replace(/"/g, x => encodeURIComponent(x))
      break
    default:
      break
  }
  const option = taskUrl(functionId, body)
  if (preUrl) {
    Object.assign(option, { url: preUrl })
  }
  return new Promise(resolve => {
    $.get(option, (err, resp, data) => {
      const res = {}
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // console.log(data)
            data = JSON.parse(data);
            if (data.resultCode !== 0) {
              console.log($.name + `（${functionId}）` + "：" + data.resultMsg)
            } else {
              Object.assign(res, data?.resultData ?? {})
            }
          } else {
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(res);
      }
    })
  })
}
function toDailySignIn() {
  const body = getBody()
  return new Promise(resolve => {
    $.get(taskUrl('toDailySignIn', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // console.log(data)
            data = JSON.parse(data);
            if (data.resultData.code !== "0000") {
              $.stopNext = true
              console.log($.name + `（${arguments.callee.name}）` + "：" + data.resultData.msg)
              return
            }
            console.log("每日首次登陆签到礼包：" + ots(data.resultData.data.signAward))
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        $.isFirstLogin = false
        resolve();
      }
    })
  })
}
function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            if (data['retcode'] === 0) {
              $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function getBody(withSign = true) {
  const riskDeviceInfo = $.riskDeviceInfo = JSON.stringify({
    eid: $.eid,
    fp: $.fp,
    token: $.token
  })
  const signData = {
    channelLv: "yxjh",
    environment: "jrApp",
    riskDeviceInfo,
    shareUuid: "uuid",
  }
  if ($.isFirstLogin) {
    delete signData.riskDeviceInfo
  }
  if (!withSign) {
    return {
      ...signData,
      timeSign: Math.random(),
    }
  }
  $.aar = new window.AAR()
  const nonce = $.aar.nonce()
  const signature = $.aar.sign(JSON.stringify(signData), nonce)
  return {
    ...signData,
    timeSign: Math.random(),
    nonce,
    signature,
  }
}

function taskUrl(function_id, body) {
  return {
    url: `${JD_API_HOST}/${function_id}?reqData=${JSON.stringify(body).replace(/"/g, x => encodeURIComponent(x))}`,
    headers: {
      'Accept' : `application/json`,
      'Origin' : `https://active.jd.com`,
      'Accept-Encoding' : `gzip, deflate, br`,
      'Cookie' : cookie,
      'Content-Type' : `application/x-www-form-urlencoded;charset=UTF-8`,
      'Host' : `ms.jr.jd.com`,
      'Connection' : `keep-alive`,
      'User-Agent' : $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Referer' : dailyEggUrl,
      'Accept-Language' : `zh-cn`
    }
  }
}
function getClientData(fakerBody) {
  return new Promise(resolve => {
    const options = {
      url: `https://gia.jd.com/fcf.html?a=${fakerBody.a}`,
      body: `d=${fakerBody.d}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${JSON.stringify(arguments)}: API查询请求失败 ‼️‼️`)
          throw new Error(err);
        } else {
          if (data.indexOf("*_*") > 0) {
            data = data.split("*_*", 2);
            data = JSON.parse(data[1]).eid;
          } else {
            console.log(`京东api返回数据为空，请检查自身原因`)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data || "");
      }
    })
  })
}
function downloadUrl(url) {
  return new Promise(resolve => {
    const options = {
      url, "timeout": 10000, followRedirect: false, headers: {
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      }
    };
    $.get(options, async (err, resp, data) => {
      let res = ""
      try {
        if (err) {
          console.log(`⚠️网络请求失败`);
        } else {
          res = data;
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(res);
      }
    })
  })
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

String.prototype.getValByKey = function (str) {
  const reg = new RegExp(`(^|\\?|&)${str}\=(.*?)(&|$)`)
  let res = ""
  if (reg.test(this)) {
    res = this.match(reg)[2]
  }
  return res
}
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
