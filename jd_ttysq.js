/*
#天天压岁钱
33 0,13 * * * jd_ttysq.js

#############
PS:(不是玩代码的人，写代码有bug很正常！！)


 */
const $ = new Env('天天压岁钱');
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', secretp = '', joyToken = "";
$.shareCoseList = [];
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
let authorCode = []
const JD_API_HOST = `https://m.jingxi.com`;
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  //await getToken();
  cookiesArr = cookiesArr.map(ck => ck  + `joyytoken=50084${joyToken};`)
  $.CryptoJS = $.isNode() ? require('crypto-js') : CryptoJS
  //做任务
  console.log(`CK1 助力作者！CK1 助力作者！CK1 助力作者！`)
  let res = await getAuthorShareCode('https://raw.githubusercontent.com/zero205/updateTeam/main/shareCodes/ttysq.json')
  if (!res) {
    res = await getAuthorShareCode('https://raw.fastgit.org/zero205/updateTeam/main/shareCodes/ttysq.json')
  }
  if (res) {
    authorCode = res.sort(() => 0.5 - Math.random())
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    if (cookie) {
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        continue
      }
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      //做任务
        if($.index === 1){
            for (let i = 0; i <= authorCode.length; i++) {
                console.log(authorCode[i])
                await task(`jxnhj/WishHelp`, `id=4&shareId=${authorCode[i]}`);
                await $.wait(1000)
                await task(`jxnhj/DoTask`, `taskId=3142&strShareId=${authorCode[i]}&bizCode=jxnhj_task&configExtra=`);
            }            
        }
      await main()
    }
  };

    console.log(`要助力的助理码${JSON.stringify($.shareCoseList.length)}个\n`)
    //助力任务
    for (let i = 1; i < cookiesArr.length; i++) {
        $.canHelp = true
        cookie = cookiesArr[i];
        if (cookie) {
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
                continue
            }
            if ($.shareCoseList.length >= 1) {
                for (let y = 0; y < $.shareCoseList.length; y++){
                    if ($.shareCoseList[y].user === $.UserName){
                        console.log(`不能助力自己，跳过\n`)
                    }else if ($.shareCoseList[y].beHelp === false){
                        //console.log(`助力已满，跳过\n`)
                    }else{
                        console.log(`\n京东账号${$.index} ${$.nickName || $.UserName}去助力${$.shareCoseList[y].user}助力码${$.shareCoseList[y].code}`)
                        console.log(`助力任务`)
                        await task(`jxnhj/DoTask`, `taskId=${$.taskId}&strShareId=${$.shareCoseList[y].code}&bizCode=jxnhj_task&configExtra=`);
                        //if ($.max === true){}
                        await $.wait(3000);
                        if ($.canHelp === false){break}
                    }
                }
            }
        }
    };
    //助力红包
    for (let i = 0; i < cookiesArr.length; i++) {
        $.doHelpTimes = 0
        cookie = cookiesArr[i];
        if (cookie) {
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
                continue
            }
            if ($.shareCoseList.length >= 1) {
                for (let y = 0; y < $.shareCoseList.length && $.doHelpTimes < 5; y++){
                    if ($.shareCoseList[y].user === $.UserName){
                        console.log(`不能助力自己，跳过\n`)
                    }else if ($.shareCoseList[y].beHelp === false){
                        //console.log(`助力已满，跳过\n`)
                    }else{
                        console.log(`\n京东账号${$.index} ${$.nickName || $.UserName}去助力${$.shareCoseList[y].user}助力码${$.shareCoseList[y].code}`)
                        console.log(`助力红包，Id: ${$.shareCoseList[y].redId}`)
                        await task(`jxnhj/WishHelp`, `id=${$.shareCoseList[y].redId}&shareId=${$.shareCoseList[y].code}`);
                        $.doHelpTimes += 1
                        await $.wait(3000);
                    }
                }
            }
        }
    };
  if ($.message) await notify.sendNotify(`${$.name}`, `${message}\n`);
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())

function getAuthorShareCode(url) {
  return new Promise(async resolve => {
    const options = {
      url: `${url}?${new Date()}`, "timeout": 10000, headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }
    };
    $.get(options, async (err, resp, data) => {
      try {
        resolve(JSON.parse(data))
      } catch (e) {
        // $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
    await $.wait(10000)
    resolve();
  })
}

async function main() {
    try{
        await task(`jxnhj/GetUserInfo`, `strInviteId=&nopopup=0`, show = true)
        await $.wait(500)
        await task(`jxnhj/BestWishes`)
        await $.wait(500)
        await task(`jxnhj/GetTaskList`)
        await $.wait(500)
        if(!$.allTaskList){
            console.log(`获取任务列表失败`)
        }else{
            for(let i = 0; i < $.allTaskList.length; i++){
                $.oneTask = $.allTaskList[i];
                if ([2, 14].includes($.oneTask.taskType) && $.oneTask.status === 1 && $.oneTask.awardStatus === 2) {
                    $.taskId = $.oneTask.taskId;
                    $.taskName = $.oneTask.taskName
                    console.log(`去做${$.taskName}`)
                    await task(`jxnhj/DoTask`, `taskId=${$.taskId}&strShareId=&bizCode=jxnhj_task&configExtra=`)
                    console.log(`等待5秒`)
                    await $.wait(5100)
                    await task(`newtasksys/newtasksys_front/Award`, `taskId=${$.taskId}&bizCode=jxnhj_task&source=jxnhj_task`)
                }
                if ([4].includes($.oneTask.taskType) && $.oneTask.status === 1 && $.oneTask.awardStatus === 2) {
                    $.taskId = $.oneTask.taskId;
                    $.shareCoseList.push(
                        {
                            "user": $.UserName,
                            "code": $.shareId,
                            "redId": $.redId,
                            "beHelp": true,
                            "helpId": $.taskId
                        }
                    )
                }
            }
        }
        await task(`jxnhj/GetUserInfo`, `strInviteId=&nopopup=0`, show = false)
        if ($.lotteryNum >= 1){
            for (let w = 0; w < $.lotteryNum; w++){
                console.log(`可以抽奖${$.lotteryNum}次 ==>>第${w+1}次抽奖`)
                await task(`jxnhj/GreetUpgrade`)
                await $.wait(1000)
            }
        }
    }catch (e) {
    $.logErr(e)
    }

}


function task(function_name, body, show = false) {
  return new Promise((resolve) => {
    $.get(taskUrl(function_name, body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} ${function_name} API请求失败，请检查网路重试`)
        } else {
            data = JSON.parse(data);
            if (function_name === "jxnhj/GetUserInfo") {
                if (data.iRet === 0){
                    $.goodsNum = data.myInfo.goodsNum;    //年货
                    $.level = data.myInfo.level;          //等级
                    $.levelCost = data.myInfo.levelCost   //每次消耗年货
                    $.luckyNum = data.myInfo.luckyNum     //红包份数
                    $.luckyWorth = data.myInfo.luckyWorth //预计分的红包金额
                    $.shareId = data.myInfo.shareId       //助力码
                    $.lotteryNum = Math.floor($.goodsNum / $.levelCost) //消耗年货升等级次数
                    if (show === true){
                        console.log(`现在等级${$.level},年货值有${$.goodsNum},有${$.luckyNum}份红包，预计分的${$.luckyWorth}元,可抽奖次数${$.lotteryNum}`)
                        console.log(`助力码：${$.shareId}\n`)
                    }
                }else{
                    console.log(`${function_name}：${JSON.stringify(data)}`)
                }
            }else if (function_name === "jxnhj/BestWishes") {
                //console.log(JSON.stringify(data))
                if (data.sErrMsg === "ok"){
                    $.allPagesList = data.data.pages
                    for (let q = $.allPagesList.length - 1; q !==0; q--){
                        if ($.allPagesList[q].status === 1){
                            $.redId = $.allPagesList[q].id
                        }
                    }
                }else{
                    console.log(`${function_name}：${JSON.stringify(data)}`)
                }
            //任务列表
            }else if (function_name === "jxnhj/GetTaskList") {
                //console.log(JSON.stringify(data))
                if (data.sErrMsg === "ok"){
                    $.allTaskList = data.data.taskList
                }else{
                    console.log(`${function_name}：${JSON.stringify(data)}`)
                }
            //做任务
            }else if (function_name === "jxnhj/DoTask") {
                //console.log(JSON.stringify(data))
                if (data.iRet === 0  && data.data.prizeInfo.length === 0){
                    console.log(`领取任务`)
                    //console.log(JSON.stringify(data))
                }else if (data.iRet === 0 && data.data.prizeInfo.length > 0){
                    console.log(`助力成功获得：${data.data.prizeInfo[0].prizeName}元红包\n`)
                }else if (data.iRet === 1009){
                    console.log(`${data.sErrMsg}\n`)
                    $.max = true
                }else if (data.iRet === 4001){
                    console.log(`${data.sErrMsg}\n`)
                    $.canHelp = false
                }else if (data.iRet === 4007){
                    console.log(`${data.sErrMsg}\n`)
                    $.canHelp = false
                }else{
                    console.log(`${function_name}：${JSON.stringify(data)}`)
                }
            //任务奖励
            }else if (function_name === "newtasksys/newtasksys_front/Award") {
                //console.log(JSON.stringify(data))
                if (data.ret === 0){
                    console.log(`任务完成${JSON.parse(data.data.prizeInfo).ddwAward}年货\n`)
                }else{
                    console.log(`${function_name}：${JSON.stringify(data)}`)
                }
            //助力红包
            }else if (function_name === "jxnhj/WishHelp") {
                //console.log(JSON.stringify(data))
                if (data.iRet === 0 && data.sErrMsg === "ok"){
                    console.log(`助力成功获得${data.data.prizeName}红包\n`)
                }else{
                    console.log(`${function_name}：${JSON.stringify(data)}`)
                }
            }else if (function_name === "jxnhj/GreetUpgrade") {
                //console.log(JSON.stringify(data))
                if (data.iRet === 0 && data.sErrMsg === "ok"){
                    console.log(`抽奖获得${data.prizeInfo[0].prizeName}红包\n`)
                }else{
                    console.log(`${function_name}：${JSON.stringify(data)}`)
                }
            } else {
            console.log(`无类型判断${JSON.stringify(data)}\n`);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}    



function getToken(timeout = 0){
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://bh.m.jd.com/gettoken`,
        headers : {
          'Content-Type' : `text/plain;charset=UTF-8`
        },
        body : `content={"appname":"50084","whwswswws":"","jdkey":"","body":{"platform":"1"}}`
      }
      $.post(url, async (err, resp, data) => {
        try {
          data = JSON.parse(data);
          joyToken = data.joyytoken;
          console.log(`joyToken = ${data.joyytoken}`)
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

function taskUrl(function_path, body = '', dwEnv = 7) {
  let url = `${JD_API_HOST}/${function_path}?__t=${Date.now()}&dwEnv=${dwEnv}&${body}&_stk=__t%2CbizCode%2CconfigExtra%2CdwEnv%2CstrShareId%2CtaskId&_ste=1`;
  url += `&h5st=${Date.now(), '', '', url}&_=${Date.now() + 2}&sceneval=2&g_login_type=1&g_ty=ajax`;
  return {
    url,
    headers: {
      Cookie: cookie,
      Accept: "application/json",
      Connection: "keep-alive",
      Referer:"https://st.jingxi.com/promote/2022/spring2022/index.html?ptag=139419.6.28&sceneval=2",
      "Accept-Encoding": "gzip, deflate, br",
      "origin": "https://st.jingxi.com",
      "User-Agent": "jdpingou;android;5.17.0;appBuild/19876;session/414;pap/JA2019_3111789;ef/1;ep/%7B%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22ts%22%3A1642052542608%2C%22ridx%22%3A-1%2C%22cipher%22%3A%7B%22bd%22%3A%22%22%2C%22ad%22%3A%22EJVwZwYmYJq4DWU5YwO3CG%3D%3D%22%2C%22sv%22%3A%22CJO%3D%22%2C%22od%22%3A%22DJPrDzVvYJTrZNVwCtq2CK%3D%3D%22%2C%22ud%22%3A%22EJVwZwYmYJq4DWU5YwO3CG%3D%3D%22%7D%2C%22ciphertype%22%3A5%2C%22version%22%3A%221.2.0%22%2C%22appname%22%3A%22com.jd.pingou%22%7D;Mozilla/5.0 (Linux; Android 11; M2007J3SC Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0.4664.92 Mobile Safari/537.36",
      "Accept-Language": "zh-cn",
    },
    timeout: 10000
  };
};

function taskPostUrl(functionId, body = {}) {
  return {
    url: `${JD_API_HOST}?functionId=${functionId}`,
    body: `functionId=${functionId}&body=${JSON.stringify(body)}&_t=${Date.now()}&appid=activities_platform&client=wh5&clientVersion=1.0.0`,
    headers: {
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Host': 'api.m.jd.com',
      'Cookie': cookie,
      'Origin': 'https://pro.m.jd.com',
      'Referer': 'https://pro.m.jd.com/mall/active/j8U2SMhmw3aKgfWwYQfoRR4idTT/index.html?',
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

function decrypt(time, stk, type, url) {
  stk = stk || (url ? getUrlData(url, '_stk') : '')
  if (stk) {
    const timestamp = new Date(time).Format("yyyyMMddhhmmssSSS");
    let hash1 = '';
    if ($.fingerprint && $.token && $.enCryptMethodJD) {
      hash1 = $.enCryptMethodJD($.token, $.fingerprint.toString(), timestamp.toString(), $.appId.toString(), $.CryptoJS).toString($.CryptoJS.enc.Hex);
    } else {
      const random = '5gkjB6SpmC9s';
      $.token = `tk01wcdf61cb3a8nYUtHcmhSUFFCfddDPRvKvYaMjHkxo6Aj7dhzO+GXGFa9nPXfcgT+mULoF1b1YIS1ghvSlbwhE0Xc`;
      $.fingerprint = 5287160221454703;
      const str = `${$.token}${$.fingerprint}${timestamp}${$.appId}${random}`;
      hash1 = $.CryptoJS.SHA512(str, $.token).toString($.CryptoJS.enc.Hex);
    }
    let st = '';
    stk.split(',').map((item, index) => {
      st += `${item}:${getUrlData(url, item)}${index === stk.split(',').length -1 ? '' : '&'}`;
    })
    const hash2 = $.CryptoJS.HmacSHA256(st, hash1.toString()).toString($.CryptoJS.enc.Hex);
    // console.log(`\nst:${st}`)
    // console.log(`h5st:${["".concat(timestamp.toString()), "".concat(fingerprint.toString()), "".concat($.appId.toString()), "".concat(token), "".concat(hash2)].join(";")}\n`)
    return encodeURIComponent(["".concat(timestamp.toString()), "".concat($.fingerprint.toString()), "".concat($.appId.toString()), "".concat($.token), "".concat(hash2)].join(";"))
  } else {
    return '20210318144213808;8277529360925161;10001;tk01w952a1b73a8nU0luMGtBanZTHCgj0KFVwDa4n5pJ95T/5bxO/m54p4MtgVEwKNev1u/BUjrpWAUMZPW0Kz2RWP8v;86054c036fe3bf0991bd9a9da1a8d44dd130c6508602215e50bb1e385326779d'
  }
}

function getUrlData(url, name) {
  if (typeof URL !== "undefined") {
    let urls = new URL(url);
    let data = urls.searchParams.get(name);
    return data ? data : '';
  } else {
    const query = url.match(/\?.*/)[0].substring(1)
    const vars = query.split('&')
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=')
      if (pair[0] === name) {
        // return pair[1];
        return vars[i].substr(vars[i].indexOf('=') + 1);
      }
    }
    return ''
  }
}
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
