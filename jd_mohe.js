/*
5G超级盲盒，可抽奖获得京豆，建议在凌晨0点时运行脚本，白天抽奖基本没有京豆，4小时运行一次收集热力值
活动地址: https://blindbox5g.jd.com
活动时间：2021-06-2到2021-07-31
更新时间：2021-06-3 12:00
脚本兼容: QuantumultX, Surge,Loon, JSBox, Node.js
=================================Quantumultx=========================
[task_local]
#5G超级盲盒
0 0,1-23/3 * * * https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_mohe.js, tag=5G超级盲盒, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true

=================================Loon===================================
[Script]
cron "0 0,1-23/3 * * *" script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_mohe.js,tag=5G超级盲盒

===================================Surge================================
5G超级盲盒 = type=cron,cronexp="0 0,1-23/3 * * *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_mohe.js

====================================小火箭=============================
5G超级盲盒 = type=cron,script-path=https://raw.githubusercontent.com/Aaron-lv/sync/jd_scripts/jd_mohe.js, cronexpr="0 0,1-23/3 * * *", timeout=3600, enable=true
 */
const $ = new Env('5G超级盲盒');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let jdNotify = true;//是否关闭通知，false打开通知推送，true关闭通知推送
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message, allMessage = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

const JD_API_HOST = 'https://api.m.jd.com/api';
//邀请码一天一变化，已确定
$.shareId = [];
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  console.log('5G超级盲盒，可抽奖获得京豆，建议在凌晨0点时运行脚本，白天抽奖基本没有京豆，3小时运行一次收集热力值\n' +
      '活动地址: https://blindbox5g.jd.com\n' +
      '活动时间：2021-8-2到2021-10-29\n' +
      '更新时间：2021-8-8 19:00');
  $.http.get({url: 'https://purge.jsdelivr.net/gh/Aaron-lv/updateTeam@master/shareCodes/jd_shareCodes.json'}).then((resp) => {}).catch((e) => console.log('刷新CDN异常', e));
  await $.wait(1000)
  await updateShareCodesCDN('https://cdn.jsdelivr.net/gh/Aaron-lv/updateTeam@master/shareCodes/jd_shareCodes.json')
  await $.wait(1000)
  await getShareCode()
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await shareUrl();
      await getCoin();//领取每三小时自动生产的热力值
      await Promise.all([
        task0()
      ])
      await taskList();
      await getAward();//抽奖
    }
  }
  if (allMessage) {
    if ($.isNode()) await notify.sendNotify($.name, allMessage);
    $.msg($.name, '', allMessage, {"open-url": "https://blindbox5g.jd.com"})
  }
  $.shareId = [...($.shareId || []), ...($.updatePkActivityIdRes || []), ...($.zero205Code || [])];
  for (let v = 0; v < cookiesArr.length; v++) {
    cookie = cookiesArr[v];
    $.index = v + 1;
    $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
    console.log(`\n\n自己账号内部互助`);
    for (let item of $.shareId) {
      console.log(`账号 ${$.index} ${$.UserName} 开始给 ${item}进行助力`)
      const res = await addShare(item);
      if (res && res['code'] === 2005) {
        console.log(`次数已用完，跳出助力`)
        break
      }
    }
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })

async function task0() {
  const confRes = await conf();
  if (confRes.code === 200) {
    const { brandList, skuList } = confRes.data;
    if (skuList && skuList.length > 0) {
      for (let item of skuList) {
        if (item.state === 0) {
          let homeGoBrowseRes = await homeGoBrowse(0, item.id);
          console.log('商品', homeGoBrowseRes);
          await $.wait(1000);
          const taskHomeCoin0Res = await taskHomeCoin(0, item.id);
          console.log('商品领取金币', taskHomeCoin0Res);
          // if (homeGoBrowseRes.code === 200) {
          //   await $.wait(1000);
          //   await taskHomeCoin(0, item.id);
          // }
        } else {
          console.log('精选好物任务已完成')
        }
      }
    }
  }
}
function addShare(shareId) {
  return new Promise((resolve) => {
    const body = {"shareId":shareId,"apiMapping":"/active/addShare"}
    $.post(taskurl(body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data['code'] === 200) {
            console.log(`助力好友【${data.data}】成功\n`);
          } else {
            console.log(`助力失败：${data.msg}`);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function conf() {
  return new Promise((resolve) => {
    const body = {"apiMapping":"/active/conf"};
    $.post(taskurl(body), (err, resp, data) => {
      try {
        data = JSON.parse(data);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function homeGoBrowse(type, id) {
  return new Promise((resolve) => {
    const body = {"type":type,"id":id,"apiMapping":"/active/homeGoBrowse"}
    $.post(taskurl(body), (err, resp, data) => {
      try {
        data = JSON.parse(data);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function taskHomeCoin(type, id) {
  return new Promise((resolve) => {
    const body = {"type":type,"id":id,"apiMapping":"/active/taskHomeCoin"}
    $.post(taskurl(body), (err, resp, data) => {
      try {
        data = JSON.parse(data);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function getCoin() {
  return new Promise((resolve) => {
    const body = {"apiMapping":"/active/getCoin"}
    $.post(taskurl(body), (err, resp, data) => {
      try {
        data = JSON.parse(data);
        if (data.code === 1001) {
          console.log(data.msg);
          $.msg($.name, '领取失败', `${data.msg}`);
          $.done();
        } else {
          console.log(`成功领取${data.data}热力值`)
          resolve(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}

async function taskList() {
  return new Promise(async (resolve) => {
    const body = {"apiMapping":"/active/taskList"}
    $.post(taskurl(body), async (err, resp, data) => {
      try {
        data = JSON.parse(data);
        if (data.code === 200) {
          const { task8, task4, task1, task2, task5 } = data.data;
          //浏览商品
          if (task4.finishNum < task4.totalNum) {
            await browseProduct(task4.skuId);
            await $.wait(2000)
            await taskCoin(task4.type);
            await $.wait(2000)
          }
          //浏览会场
          if (task1.finishNum < task1.totalNum) {
            await strollActive((task1.finishNum + 1));
            await $.wait(2000)
            await taskCoin(task1.type);
            await $.wait(2000)
          }
          //关注或浏览店铺
          if (task2.finishNum < task2.totalNum) {
            await followShop(task2.shopId);
            await $.wait(2000)
            await taskCoin(task2.type);
            await $.wait(2000)
          }
          // if (task5.finishNum < task5.totalNum) {
          //   console.log(`\n\n分享好友助力 ${task5.finishNum}/${task5.totalNum}\n\n`)
          // } else {
          //   console.log(`\n\n分享好友助力 ${task5.finishNum}/${task5.totalNum}\n\n`)
          // }
          if (task4.state === 2 && task1.state === 2 && task2.state === 2) {
            console.log('\n\n----taskList的任务全部做完了---\n\n')
            console.log(`分享好友助力 ${task5.finishNum}/${task5.totalNum}\n\n`)
          } else {
            console.log(`请继续等待,正在做任务,不要退出哦`)
            await taskList();
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
//浏览商品
function browseProduct(skuId) {
  return new Promise((resolve) => {
    const body = {"skuId":skuId,"apiMapping":"/active/browseProduct"}
    $.post(taskurl(body), (err, resp, data) => {
      try {
        data = JSON.parse(data);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
// 浏览会场
function strollActive(index) {
  return new Promise((resolve) => {
    const body = {"activeId":index,"apiMapping":"/active/strollActive"}
    $.post(taskurl(body), (err, resp, data) => {
      try {
        data = JSON.parse(data);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
//关注或浏览店铺
function followShop(shopId) {
  return new Promise((resolve) => {
    const body = {"shopId":shopId,"apiMapping":"/active/followShop"}
    $.post(taskurl(body), (err, resp, data) => {
      try {
        data = JSON.parse(data);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
//领取任务奖励
function taskCoin(type) {
  return new Promise((resolve) => {
    const body = {"type":type,"apiMapping":"/active/taskCoin"}
    $.post(taskurl(body), (err, resp, data) => {
      try {
        data = JSON.parse(data);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
async function getAward() {
  const coinRes = await coin();
  if (coinRes.code === 200) {
    const { total, need } = coinRes.data;
    if (total > need) {
      const times = Math.floor(total / need);
      for (let i = 0; i < times; i++) {
        await $.wait(2000);
        let lotteryRes = await lottery();
        if (lotteryRes.code === 200) {
          console.log(`====抽奖结果====,${JSON.stringify(lotteryRes.data)}`);
          console.log(lotteryRes.data.name);
          console.log(lotteryRes.data.beanNum);
          if (lotteryRes.data['prizeId'] && (lotteryRes.data['type'] !== '99' && lotteryRes.data['type'] !== '3' && lotteryRes.data['type'] !== '8'  && lotteryRes.data['type'] !== '9')) {
            message += `抽奖获得：${lotteryRes.data.name}\n`;
          }
        } else if (lotteryRes.code === 4001) {
          console.log(`抽奖失败,${lotteryRes.msg}`);
          break;
        }
      }
      if (message) allMessage += `京东账号${$.index} ${$.nickName}\n${message}抽奖详情查看 https://blindbox5g.jd.com/#/myPrize${$.index !== cookiesArr.length ? '\n\n' : ''}`
    } else {
      console.log(`目前热力值${total},不够抽奖`)
    }
  }
}
//获取有多少热力值
function coin() {
  return new Promise((resolve) => {
    const body = {"apiMapping":"/active/coin"}
    $.post(taskurl(body), (err, resp, data) => {
      try {
        data = JSON.parse(data);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
//抽奖API
function lottery() {
  return new Promise((resolve) => {
    const body = {"apiMapping":"/prize/lottery"}
    $.post(taskurl(body), (err, resp, data) => {
      try {
        data = JSON.parse(data);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function shareUrl() {
  return new Promise((resolve) => {
    const body = {"apiMapping":"/active/shareUrl"}
    $.post(taskurl(body), async (err, resp, data) => {
      try {
        data = JSON.parse(data);
        if (data['code'] === 5000) {
          console.log(`尝试多次运行脚本即可获取好友邀请码`)
        }
        if (data['code'] === 200) {
          if (data['data']) $.shareId.push(data['data']);
          console.log(`\n【京东账号${$.index}（${$.nickName || $.UserName}）的${$.name}好友互助码】${data['data']}\n`);
          console.log(`此邀请码一天一变化，旧的不可用`)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function taskurl(body = {}) {
  return {
    'url': `${JD_API_HOST}?appid=blind-box&functionId=blindbox_prod&body=${JSON.stringify(body)}&t=${Date.now()}&loginType=2`,
    'headers': {
      "accept": "application/json, text/plain, */*",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "zh-cn",
      "content-type": "application/x-www-form-urlencoded",
      'origin': 'https://blindbox5g.jd.com',
      "cookie": cookie,
      "referer": "https://blindbox5g.jd.com",
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
    }
  }
}
function updateShareCodesCDN(url) {
  return new Promise(resolve => {
    const options = {
      url: `${url}?${new Date()}`, "timeout": 10000, headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }
    };
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          $.updatePkActivityIdRes = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function getShareCode() {
  return new Promise(resolve => {
    $.get({
      url: "https://raw.fastgit.org/zero205/updateTeam/main/shareCodes/jd_mohe.json",
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }
    }, async (err, resp, data) => {
      try {
        if (err) {
        } else {
          $.zero205Code = JSON.parse(data) || []
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
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
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1"
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
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
