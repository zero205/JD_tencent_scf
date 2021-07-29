/*
* 最新特务活动为冲榜活动，由于奖品较少且只有排名靠前的才有奖励，故此脚本只会给作者助力，感谢运行此脚本；
* 希望大家踊跃助力，帮助作者提升排名
* cron 14 14,17 * * *
* */
const $ = new Env('特务Z');
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let cookiesArr = [];
$.allInvite = [];
$.helpEncryptAssignmentId = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  });
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [
    $.getdata("CookieJD"),
    $.getdata("CookieJD2"),
    ...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie)].filter((item) => !!item);
}
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  let res = [];
  try{res = await getAuthorShareCode('https://raw.githubusercontent.com/star261/jd/main/code/ProductZ4Brand.json');}catch (e) {}
  if(!res){
    try{res = await getAuthorShareCode('https://cdn.jsdelivr.net/gh/star261/jd@main/code/ProductZ4Brand.json');}catch (e) {}
    if(!res){res = [];}
  }
  if(res.length === 0){console.log(`获取作者助力码失败或者作者已不需要助力，感谢`);return ;}
  console.log(`新版特务为冲榜活动，由于奖品较少且只有排名靠前的才有奖励，故此脚本只会给作者助力，感谢运行此脚本；`);
  $.shareUuid = res[0];
  for (let i = 0; i < cookiesArr.length; i++) {
    $.index = i + 1;
    $.cookie = cookiesArr[i];
    $.cookie2 = cookiesArr[i];
    $.isLogin = true;
    $.nickName = '';
    await TotalBean();
    $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
    console.log(`\n*****开始【京东账号${$.index}】${$.nickName || $.UserName}*****\n`);
    if (!$.isLogin) {
      $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

      if ($.isNode()) {
        await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
      }
      continue
    }
    try{
      await main();
    }catch (e) {
      console.log(JSON.stringify(e));
    }
  }
})().catch((e) => {$.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')}).finally(() => {$.done();})
async function main() {
  await getToken();
  await $.wait(1000)
  console.log('token:'+$.token);
  await getActCookie();
  await $.wait(1000)
  $.myPingInfo = {};
  await getMyPing();
  await $.wait(1000)
  if(JSON.stringify($.myPingInfo) === '{}'){console.log(`初始化失败`);return ;}
  await getUserInfo();
  await $.wait(1000)
  await getMyPing();
  await $.wait(1000)
  await accessLogWithAD();
  await $.wait(1000);
  $.activityInfo = {};
  await getActivityInfo();
  if(JSON.stringify($.activityInfo) === '{}'){console.log(`获取活动详情失败`);return ;}
  await $.wait(1000);
  console.log(`开始助力作者`)
  await help();
}
async function accessLogWithAD(){
  const url = `https://lzdz-isv.isvjcloud.com/common/accessLogWithAD`;
  const method = `POST`;
  const headers = {
    'Host' : `lzdz-isv.isvjcloud.com`,
    'Accept' : `application/json`,
    'Origin' : `https://lzdz-isv.isvjcloud.com`,
    'X-Requested-With' : `XMLHttpRequest`,
    'Accept-Encoding' : `gzip, deflate, br`,
    'Content-Type' : `application/x-www-form-urlencoded`,
    'Connection' : `keep-alive`,
    'User-Agent' : `JD4iPhone/162751 (iPhone; iOS 14.6; Scale/3.00)`,
    'Cookie' : $.cookie ,
    'Referer' : `https://lzdz-isv.isvjcloud.com/dingzhi/pg/phototGame/activity/3656401d=1000004064`,
    'Accept-Language' : `zh-cn`,
  };
  const body = `venderId=1000004064&code=99&pin=${encodeURIComponent($.myPingInfo.secretPin)}&activityId=dz2107100000406401&pageUrl=https%3A%2F%2Flzdz-isv.isvjcloud.com%2Fdingzhi%2Fpg%2FphototGame%2Factivity%3FactivityId%3Ddz2107100000406401%26un_area%3D2_2830_51828_0&subType=app&adSource=`;
  let myRequest = {url: url, method: method, headers: headers, body: body};
  return new Promise(async resolve => {
    $.post(myRequest, (err, resp, data) => {
      try {

      } catch (e) {
        console.log(data);
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
async function help(){
  const url = `https://lzdz-isv.isvjcloud.com/dingzhi/pg/phototGame/share`;
  const method = `POST`;
  const headers = {
    'Host' : `lzdz-isv.isvjcloud.com`,
    'Accept' : `application/json`,
    'Origin' : `https://lzdz-isv.isvjcloud.com`,
    'X-Requested-With' : `XMLHttpRequest`,
    'Accept-Encoding' : `gzip, deflate, br`,
    'Content-Type' : `application/x-www-form-urlencoded`,
    'Connection' : `keep-alive`,
    'User-Agent' : `JD4iPhone/162751 (iPhone; iOS 14.6; Scale/3.00)`,
    'Cookie' : $.cookie ,
    'Referer' : `https://lzdz-isv.isvjcloud.com/dingzhi/pg/phototGame/activity/3656401d=1000004064`,
    'Accept-Language' : `zh-cn`,
  };
  const body = `activityId=dz2107100000406401&actorUuid=${$.activityInfo.actorUuid}&pin=${encodeURIComponent($.myPingInfo.secretPin)}&shareUuid=${$.shareUuid}`;
  let myRequest = {url: url, method: method, headers: headers, body: body};
  return new Promise(async resolve => {
    $.post(myRequest, (err, resp, data) => {
      try {
        console.log(data);
        if(data){
          data = JSON.parse(data);
          if(data.result && data.count===0){
            let info = data.data;
            if(info.assistStatus === 1){
              console.log(`助力成功`);
            }else if(info.assistStatus === 2){
              console.log(`已助力过`);
            }
          }
        }
      } catch (e) {
        console.log(data);
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
async function getActivityInfo(){
  const url = `https://lzdz-isv.isvjcloud.com/dingzhi/pg/phototGame/activityContent`;
  const method = `POST`;
  const headers = {
    'X-Requested-With' : `XMLHttpRequest`,
    'Connection' : `keep-alive`,
    'Accept-Encoding' : `gzip, deflate, br`,
    'Content-Type' : `application/x-www-form-urlencoded`,
    'Origin' : `https://lzdz-isv.isvjcloud.com`,
    'User-Agent' : `JD4iPhone/162751 (iPhone; iOS 14.6; Scale/3.00)`,
    'Cookie' :$.cookie ,
    'Host' : `lzdz-isv.isvjcloud.com`,
    'Referer' : `https://lzdz-isv.isvjcloud.com/dingzhi/pg/phototGame/activity/3656401`,
    'Accept-Language' : `zh-cn`,
    'Accept' : `application/json`
  };
  const body = `activityId=dz2107100000406401&pin=${encodeURIComponent($.myPingInfo.secretPin)}&pinImg=${encodeURIComponent($.attrTouXiang)}&nick=${encodeURIComponent($.myPingInfo.nickname)}&cjyxPin=&cjhyPin=&shareUuid=`;
  let myRequest = {url: url, method: method, headers: headers, body: body};
  return new Promise(async resolve => {
    $.post(myRequest, (err, resp, data) => {
      try {
        if(data){
          data = JSON.parse(data);
          if(data.count === 0 && data.result){
            $.activityInfo = data.data;
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
function getActCookie() {
  let opt = {
    url: `https://lzdz-isv.isvjcloud.com/dingzhi/pg/phototGame/activity?activityId=dz2107100000406401&un_area=2_2830_51828_0`,
    headers : {
      'Host': 'lzdz-isv.isvjcloud.com',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Cookie' : $.cookie ,
      'User-Agent' : `JD4iPhone/162751 (iPhone; iOS 14.6; Scale/3.00)`,
      'Accept-Language': 'zh-cn',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
    },
  }
  return new Promise(resolve => {
    $.get(opt, (err, resp, data) => {
      try {
        if (err) {
         // console.log(`${JSON.stringify(err)}`)
        } else {
          if ($.isNode())
            for (let sk of resp['headers']['set-cookie']) {
              $.cookie = `${$.cookie}${sk.split(";")[0]};`
            }
          else {
            for (let ck of resp['headers']['Set-Cookie'].split(',')) {
              $.cookie = `${$.cookie}${ck.split(";")[0]};`
            }
          }
        }
      } catch (e) {
        console.log(e)
      } finally {
        resolve();
      }
    })
  })
}
async function getUserInfo() {
  const url = `https://lzdz-isv.isvjcloud.com/wxActionCommon/getUserInfo`;
  const method = `POST`;
  const headers = {
    'X-Requested-With' : `XMLHttpRequest`,
    'Connection' : `keep-alive`,
    'Accept-Encoding' : `gzip, deflate, br`,
    'Content-Type' : `application/x-www-form-urlencoded`,
    'Origin' : `https://lzdz-isv.isvjcloud.com`,
    'User-Agent' : `JD4iPhone/162751 (iPhone; iOS 14.6; Scale/3.00)`,
    'Cookie' : $.cookie ,
    'Host' : `lzdz-isv.isvjcloud.com`,
    'Referer' : `https://lzdz-isv.isvjcloud.com/dingzhi/pg/phototGame/activity/3656401d=1000004064`,
    'Accept-Language' : `zh-cn`,
    'Accept' : `application/json`
  };
  const body = `pin=${encodeURIComponent($.myPingInfo.secretPin)}`;
  let myRequest = {url: url, method: method, headers: headers, body: body};
  return new Promise(resolve => {
    $.post(myRequest, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
        }
        else {
          if(data){
            data = JSON.parse(data);
            if(data.count === 0 && data.result){
              $.attrTouXiang = data.data.yunMidImageUrl
              != data.data.yunMidImageUrl ? $.attrTouXiang = data.data.yunMidImageUrl : $.attrTouXiang = "https://img10.360buyimg.com/imgzone/jfs/t1/7020/27/13511/6142/5c5138d8E4df2e764/5a1216a3a5043c5d.png"
            }
          }
        }
      } catch (e) {
        console.log(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
async function getMyPing(){
  const url = `https://lzdz-isv.isvjcloud.com/customer/getMyPing`;
  const method = `POST`;
  const headers = {
    'X-Requested-With' : `XMLHttpRequest`,
    'Connection' : `keep-alive`,
    'Accept-Encoding' : `gzip, deflate, br`,
    'Content-Type' : `application/x-www-form-urlencoded`,
    'Origin' : `https://lzdz-isv.isvjcloud.com`,
    'User-Agent' : `JD4iPhone/162751 (iPhone; iOS 14.6; Scale/3.00)`,
    'Cookie' : $.cookie ,
    'Host' : `lzdz-isv.isvjcloud.com`,
    'Referer' : `https://lzdz-isv.isvjcloud.com/dingzhi/pg/phototGame/activity/3656401d=1000004064`,
    'Accept-Language' : `zh-cn`,
    'Accept' : `application/json`
  };
  const body = `userId=1000004064&token=${$.token}&fromType=APP`;
  let myRequest = {url: url, method: method, headers: headers, body: body};
  return new Promise(async resolve => {
    $.post(myRequest, (err, resp, data) => {
      try {
        $.cookie2 = `${$.cookie2}IsvToken=${$.token};`
        for (let sk of resp['headers']['set-cookie']) {
          $.cookie2 = `${$.cookie2}${sk.split(";")[0]};`
        }
        if(data){
          data = JSON.parse(data);
          if(data.count === 0 && data.result){
            $.myPingInfo = data.data;
          }
        }
      } catch (e) {
        console.log(data);
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
async function getToken(){
  const url = `https://api.m.jd.com/client.action?functionId=isvObfuscator`;
  const method = `POST`;
  const headers = {
    'Accept-Encoding' : `gzip, deflate, br`,
    'Cookie' : $.cookie ,
    'Connection' : `keep-alive`,
    'Content-Type' : `application/x-www-form-urlencoded`,
    'Accept' : `*/*`,
    'Host' : `api.m.jd.com`,
    'User-Agent' : `JD4iPhone/162751 (iPhone; iOS 14.6; Scale/3.00)`,
    'Referer' : ``,
    'Accept-Language' : `zh-Hans-CN;q=1, en-CN;q=0.9`
  };
  const body = `area=2_2830_51828_0&body=%7B%22url%22%3A%22https%3A%5C/%5C/lzdz-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&client=apple&clientVersion=10.0.8&openudid=5a8a5743a5d2a4110a8ed396bb047471ea120c6a&sign=e7d54d5a1ee1afc8938063490ec5641e&st=1627424031538&sv=121&uemps=0-0&uts=&uuid=&wifiBssid=`;
  let myRequest = {url: url, method: method, headers: headers, body: body};
  return new Promise(async resolve => {
    $.post(myRequest, (err, resp, data) => {
      try {
        if(data){
          data = JSON.parse(data);
          if(data.code === '0' && data.token){
            $.token = data.token;
            $.cookie = `${$.cookie}IsvToken=${$.token};`
          }
        }
      } catch (e) {
        console.log(data);
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function getAuthorShareCode(url) {
  return new Promise(async resolve => {
    const options = {
      "url": `${url}`,
      "timeout": 10000,
      "headers": {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }
    };
    if ($.isNode() && process.env.TG_PROXY_HOST && process.env.TG_PROXY_PORT) {
      const tunnel = require("tunnel");
      const agent = {
        https: tunnel.httpsOverHttp({
          proxy: {
            host: process.env.TG_PROXY_HOST,
            port: process.env.TG_PROXY_PORT * 1
          }
        })
      }
      Object.assign(options, { agent })
    }
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
        } else {
          if (data) data = JSON.parse(data)
        }
      } catch (e) {
        // $.logErr(e, resp)
      } finally {
        resolve(data || []);
      }
    })
    await $.wait(10000)
    resolve();
  })
}
function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
      headers: {
        Host: "me-api.jd.com",
        Accept: "*/*",
        Connection: "keep-alive",
        Cookie: $.cookie,
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        "Accept-Language": "zh-cn",
        "Referer": "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          $.logErr(err)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === "1001") {
              $.isLogin = false; //cookie过期
              return;
            }
            if (data['retcode'] === "0" && data.data && data.data.hasOwnProperty("userInfo")) {
              $.nickName = data.data.userInfo.baseInfo.nickname;
            }
          } else {
            $.log('京东服务器返回空数据');
          }
        }
      } catch (e) {
        $.logErr(e)
      } finally {
        resolve();
      }
    })
  })
}
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
