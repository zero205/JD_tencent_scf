/*
爱奇艺会员签到脚本
更新时间: 2022.1.21
脚本兼容: QuantumultX, Surge4, Loon, JsBox, Node.js
电报频道: @NobyDa
问题反馈: @NobyDa_bot
获取Cookie说明：
打开爱奇艺App后(AppStore中国区)，点击"我的", 如通知成功获取cookie, 则可以使用此签到脚本.
获取Cookie后, 请将Cookie脚本禁用并移除主机名，以免产生不必要的MITM.
脚本将在每天上午9:00执行, 您可以修改执行时间。
如果使用Node.js, 需自行安装'request'和'string-random'模块. 例: npm install request -g
JsBox, Node.js用户抓取Cookie说明：
开启抓包, 打开爱奇艺App后(AppStore中国区)，点击"我的" 返回抓包App 搜索请求头关键字 将cookie全部字段写入cookie
提取字母数字混合字段, 到&结束, 填入以下单引号内即可.
*/
/*********************
 QuantumultX 远程脚本配置:
 **********************
 [task_local]
 # 爱奇艺会员签到
 0 9 * * * https://raw.githubusercontent.com/BlueSkyClouds/Script/master/nodejs/iQIYI-bak.js tag=爱奇艺会员签到
 [rewrite_local]
 # 获取Cookie
 ^https?:\/\/iface(\d)?\.iqiyi\.com\/ url script-request-header https://raw.githubusercontent.com/BlueSkyClouds/Script/master/nodejs/iQIYI-bak.js
 [mitm]
 hostname= ifac*.iqiyi.com
 **********************
 Surge 4.2.0+ 脚本配置:
 **********************
 [Script]
 爱奇艺签到 = type=cron,cronexp=0 9 * * *,script-path=https://raw.githubusercontent.com/BlueSkyClouds/Script/master/nodejs/iQIYI-bak.js
 爱奇艺获取Cookie = type=http-request,pattern=^https?:\/\/iface(\d)?\.iqiyi\.com\/,script-path=https://raw.githubusercontent.com/BlueSkyClouds/Script/master/nodejs/iQIYI-bak.js
 [MITM]
 hostname= ifac*.iqiyi.com
 ************************
 Loon 2.1.0+ 脚本配置:
 ************************
 [Script]
 # 爱奇艺签到
 cron "0 9 * * *" script-path=https://raw.githubusercontent.com/BlueSkyClouds/Script/master/nodejs/iQIYI-bak.js
 # 获取Cookie
 http-request ^https?:\/\/iface(\d)?\.iqiyi\.com\/ script-path=https://raw.githubusercontent.com/BlueSkyClouds/Script/master/nodejs/iQIYI-bak.js
 [Mitm]
 hostname= ifac*.iqiyi.com
 */

const $ = new Env('爱奇艺会员签到');
const notify = $.isNode() ? require('./sendNotify') : '';

// 添加环境变量 IQI_COOKIE 全量数据 多账号使用&连接  或者多个同名称环境变量
let cookiesArr = process.env.IQI_COOKIE,allMessage=''
cookiesArr=Array.isArray(cookiesArr)?cookiesArr:cookiesArr.split('&');
let cookie = '';
let P00001 = ''; //无需填写 自动取cookie内容拆分
let P00003 = ''; //无需填写 自动取cookie内容拆分
let dfp = '';    //无需填写 自动取cookie内容拆分

const timestamp = new Date().getTime()
var LogDetails = false; // 响应日志
var tasks = ["8a2186bb5f7bedd4", "b6e688905d4e7184", "acf8adbb5870eb29", "843376c6b3e2bf00", "8ba31f70013989a8", "CHANGE_SKIN"]; //浏览任务号

var out = 10000; // 超时 (毫秒) 如填写, 则不少于3000

var $nobyda = nobyda();


(async () => {
  out = process.env.iQIYI_TimeOut || out
  LogDetails = process.env.iQIYI_LogDetails === "true" ? true : LogDetails
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
    }
    if(cookie){
    if(cookie.includes("__dfp") && cookie.includes("P00001") && cookie.includes("P00003")){
    dfp = cookie.match(/__dfp=(.*?)@/)[1];
    P00001 = cookie.match(/P00001=(.*?);/)[1];
    P00003 = cookie.match(/P00003=(.*?);/)[1];
    }
  }

  if (P00001 !== "" && P00003 !== "" && dfp !== "") {
      $nobyda.data=''
    await login();
    await Checkin();
    await WebCheckin();
    await Lottery(500);
    for (let i = 0; i < tasks.length; i++){
      await joinTask(tasks[i]);
      await notifyTask(tasks[i]);
      await new Promise(r => setTimeout(r, 5000));
      await getTaskRewards(tasks[i]);
    }
    await $nobyda.time();
  } else {
    await notify.sendNotify("爱奇艺会员", "签到终止, 由于爱奇艺更新了新的签到获取Cookie方式有所变更详情查看https://github.com/MayoBlueSky/My-Actions/blob/master/Secrets.md");
  }
  }
  if ($.isNode() && allMessage && $.ctrTemp) {
    await notify.sendNotify(`${$.name}`, `${allMessage}`)
  }
})().finally(() => {
  $nobyda.done();
})
async function showMsg() {
  let iqiNotify = process.env.IQI_NOTIFY
  if ($.isNode() && iqiNotify) {
    $.ctrTemp = `${iqiNotify}` === 'false';
  }
  if ($.ctrTemp) {
    $.msg($.name, subTitle, $nobyda.data, option);
    if ($.isNode()) {
      allMessage += `${subTitle}\n${$nobyda.data}${$nobyda.expire}${$.index !== cookiesArr.length ? '\n\n' : ''}`;
    }
  } else {
    $.log(`\n${$nobyda.data}\n`);
  }
}
function login() {
  return new Promise(resolve => {
    var URL = {
      url: 'https://serv.vip.iqiyi.com/vipgrowth/query.action?P00001=' + P00001,
    }
    $nobyda.get(URL, function(error, response, data) {
      const obj = JSON.parse(data)
      const Details = LogDetails ? data ? `response:\n${data}` : '' : ''
      if (!error && obj.code === "A00000" ) {
        const level = obj.data.level  // VIP等级
        const growthvalue = obj.data.growthvalue  // 当前 VIP 成长值
        const distance = obj.data.distance  // 升级需要成长值
        let deadline = obj.data.deadline  // VIP 到期时间
        const today_growth_value = obj.data.todayGrowthValue
        if(deadline === undefined){deadline = "非 VIP 用户"}
        $nobyda.expire = ("\nVIP 等级: " + level + "\n当前成长值: " + growthvalue + "\n升级需成长值: " + distance + "\n今日成长值: " + today_growth_value + "\nVIP 到期时间: " + deadline)
        //P00003 = data.match(/img7.iqiyipic.com\/passport\/.+?passport_(.*?)_/)[1]   //通过头像链接获取userid P00003
        console.log(`爱奇艺-查询成功: ${$nobyda.expire} ${Details}`)
      } else {
        console.log(`爱奇艺-查询失败${error || ': 无到期数据 ⚠️'} ${Details}`)
      }
      resolve()
    })
    if (out) setTimeout(resolve, out)
  })
}

function Checkin() {
  const stringRandom = require('string-random');
  return new Promise(resolve => {
    const sign_date = {
      agentType: "1",
      agentversion: "1.0",
      appKey: "basic_pcw",
      authCookie: P00001,
      qyid: md5(stringRandom(16)),
      task_code: "natural_month_sign",
      timestamp: timestamp,
      typeCode: "point",
      userId: P00003,
    };
    const post_date = {
	  "natural_month_sign": {
		"agentType": "1",
		"agentversion": "1",
		"authCookie": P00001,
		"qyid": md5(stringRandom(16)),
		"taskCode": "iQIYI_mofhr",
		"verticalCode": "iQIYI"
      }
    };
    const sign = k("UKobMjDMsDoScuWOfp6F", sign_date, {
      split: "|",
      sort: !0,
      splitSecretKey: !0
    });
    var URL = {
      url: 'https://community.iqiyi.com/openApi/task/execute?' + w(sign_date) + "&sign=" + sign,
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify(post_date)
    }
    $nobyda.post(URL, function(error, response, data) {
      if (error) {
        $nobyda.data = "签到失败: 接口请求出错 ‼️"
        console.log(`爱奇艺-${$nobyda.data} ${error}`)
      } else {
        if(!isJSON_test(data)){
          return false;
        }
        const obj = JSON.parse(data)
        const Details = LogDetails ? `response:\n${data}` : ''
        if (obj.code === "A00000") {
          if (obj.data.code === "A0000") {
            var quantity = obj.data.data.rewards[0].rewardCount;
            var continued = obj.data.data.signDays;
            $nobyda.data = "签到成功: 获得积分" + quantity + ", 累计签到" + continued + "天 🎉"
            console.log(`爱奇艺-${$nobyda.data} ${Details}`)
          } else {
            $nobyda.data = "签到失败: " + obj.data.msg + " ⚠️"
            console.log(`爱奇艺-${$nobyda.data} ${Details}`)
          }
        } else {
          $nobyda.data = "签到失败: Cookie无效 ⚠️"
          console.log(`爱奇艺-${$nobyda.data} ${Details}`)
        }
      }
      resolve()
    })
    if (out) setTimeout(resolve, out)
  })
}

function WebCheckin() {
  return new Promise(resolve => {
    const web_sign_date = {
      agenttype: "1",
      agentversion: "0",
      appKey: "basic_pca",
      appver: "0",
      authCookie: P00001,
      channelCode: "sign_pcw",
      dfp: dfp,
      scoreType: "1",
      srcplatform: "1",
      typeCode: "point",
      userId: P00003,
      user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
      verticalCode: "iQIYI"
    };

    const sign = k("DO58SzN6ip9nbJ4QkM8H", web_sign_date, {
      split: "|",
      sort: !0,
      splitSecretKey: !0
    });
    var URL = {
      url: 'https://community.iqiyi.com/openApi/score/add?' + w(web_sign_date) + "&sign=" + sign
    }
    $nobyda.get(URL, function(error, response, data) {
      if (error) {
        $nobyda.data = "网页端签到失败: 接口请求出错 ‼️"
        console.log(`爱奇艺-${$nobyda.data} ${error}`)
      } else {
        if(!isJSON_test(data)){
          return false;
        }
        const obj = JSON.parse(data)
        const Details = LogDetails ? `response:\n${data}` : ''
        if (obj.code === "A00000") {
          if (obj.data[0].code === "A0000") {
            var quantity = obj.data[0].score;
            var continued = obj.data[0].continuousValue;
            $nobyda.data = "网页端签到成功: 获得积分" + quantity + ", 累计签到" + continued + "天 🎉"
            console.log(`爱奇艺-${$nobyda.data} ${Details}`)
          } else {
            $nobyda.data = "网页端签到失败: " + obj.data[0].message + " ⚠️"
            console.log(`爱奇艺-${$nobyda.data} ${Details}`)
          }
        } else {
          $nobyda.data = "网页端签到失败: Cookie无效 ⚠️"
          console.log(`爱奇艺-${$nobyda.data} ${Details}`)
        }
      }
      resolve()
    })
    if (out) setTimeout(resolve, out)
  })
}

function Lottery(s) {
  return new Promise(resolve => {
    $nobyda.times++
      const URL = {
        url: 'https://iface2.iqiyi.com/aggregate/3.0/lottery_activity?app_k=0&app_v=0&platform_id=0&dev_os=0&dev_ua=0&net_sts=0&qyid=0&psp_uid=0&psp_cki=' + P00001 + '&psp_status=0&secure_p=0&secure_v=0&req_sn=0'
      }
    setTimeout(() => {
      $nobyda.get(URL, async function(error, response, data) {
        if (error) {
          $nobyda.data += "\n抽奖失败: 接口请求出错 ‼️"
          console.log(`爱奇艺-抽奖失败: 接口请求出错 ‼️ ${error} (${$nobyda.times})`)
        } else {
          const obj = JSON.parse(data);
          const Details = LogDetails ? `response:\n${data}` : ''
          $nobyda.last = !!data.match(/(机会|已经)用完/)
          if (obj.awardName && obj.code === 0) {
            $nobyda.data += !$nobyda.last ? `\n抽奖成功: ${obj.awardName.replace(/《.+》/, "未中奖")} 🎉` : `\n抽奖失败: 今日已抽奖 ⚠️`
            console.log(`爱奇艺-抽奖明细: ${obj.awardName.replace(/《.+》/, "未中奖")} 🎉 (${$nobyda.times}) ${Details}`)
          } else if (data.match(/\"errorReason\"/)) {
            const msg = data.match(/msg=.+?\)/) ? data.match(/msg=(.+?)\)/)[1].replace(/用户(未登录|不存在)/, "Cookie无效") : ""
            $nobyda.data += `\n抽奖失败: ${msg || `未知错误 Cookie疑似失效`} ⚠️`
            console.log(`爱奇艺-抽奖失败: ${msg || `未知错误 Cookie疑似失效`} ⚠️ (${$nobyda.times}) ${msg ? Details : `response:\n${data}`}`)
            console.log(data)
            s = s + 500;
            if(s <= 4500){
              await Lottery(s)
            }
          } else {
            $nobyda.data += "\n抽奖错误: 已输出日志 ⚠️"
            console.log(`爱奇艺-抽奖失败: \n${data} (${$nobyda.times})`)
          }
        }
        if (!$nobyda.last && $nobyda.times < 3) {
          await Lottery(s)
        } else {
          const expires = $nobyda.expire ? $nobyda.expire.replace(/\u5230\u671f/, "") : "获取失败 ⚠️"
          if ($.isNode) await notify.sendNotify("爱奇艺", "到期时间: " + expires, $nobyda.data);
        }
        resolve()
      })
    }, s)
    if (out) setTimeout(resolve, out + s)
  })
}

function joinTask(task) {
  return new Promise(resolve => {
    $nobyda.get('https://tc.vip.iqiyi.com/taskCenter/task/joinTask?taskCode=' + task + '&lang=zh_CN&platform=0000000000000000&P00001=' + P00001, function (error, response, data) {resolve()})
    if (out) setTimeout(resolve, out)
  })
}

function notifyTask(task) {
  return new Promise(resolve => {
    $nobyda.get('https://tc.vip.iqiyi.com/taskCenter/task/notify?taskCode=' + task + '&lang=zh_CN&platform=0000000000000000&P00001=' + P00001, function (error, response, data) {resolve()})
    if (out) setTimeout(resolve, out)
  })
}

function getTaskRewards(task) {
  return new Promise(resolve => {
    $nobyda.get('https://tc.vip.iqiyi.com/taskCenter/task/getTaskRewards?taskCode=' + task + '&lang=zh_CN&platform=0000000000000000&P00001=' + P00001, function (error, response, data) {
      if (error) {
        $nobyda.data += "\n浏览奖励失败: 接口请求出错 ‼️"
        console.log(`爱奇艺-抽奖失败: \n${data} (${$nobyda.times})`)
      } else {
        const obj = JSON.parse(data)
        const Details = LogDetails ? `response:\n${data}` : ''
        if (obj.msg === "成功") {
          if (obj.code === "A00000") {
            if(obj.dataNew[0] !== undefined){ //任务未完成
              $nobyda.data += `\n浏览奖励成功: ${obj.dataNew[0].name + obj.dataNew[0].value} 🎉`
              console.log(`爱奇艺-浏览奖励成功: ${obj.dataNew[0].name + obj.dataNew[0].value} 🎉`)
            }
          } else {
            $nobyda.data += `\n浏览奖励失败: ${obj.msg} ⚠️`
            console.log(`爱奇艺-抽奖失败: ${obj.msg || `未知错误`} ⚠️ (${$nobyda.times}) ${msg ? Details : `response:\n${data}`}`)
          }
        } else {
          $nobyda.data += "\n浏览奖励失败: Cookie无效/接口失效 ⚠️"
          console.log(`爱奇艺-浏览奖励失败: \n${data}`)
        }
        resolve()
      }
    })
    if (out) setTimeout(resolve, out)
  })
}

function nobyda() {
  const times = 0
  const start = Date.now()
  const isRequest = typeof $request != "undefined"
  const isSurge = typeof $httpClient != "undefined"
  const isQuanX = typeof $task != "undefined"
  const isLoon = typeof $loon != "undefined"
  const isJSBox = typeof $app != "undefined" && typeof $http != "undefined"
  const isNode = typeof require == "function" && !isJSBox;
  const node = (() => {
    if (isNode) {
      const request = require('request');
      return ({
        request
      })
    } else {
      return null
    }
  })()
  const notify = (title, subtitle, message) => {
    if (isQuanX) $notify(title, subtitle, message)
    if (isSurge) $notification.post(title, subtitle, message)
    if (isNode) log('\n' + title + '\n' + subtitle + '\n' + message)
    if (isJSBox) $push.schedule({
      title: title,
      body: subtitle ? subtitle + "\n" + message : message
    })
  }
  const write = (value, key) => {
    if (isQuanX) return $prefs.setValueForKey(value, key)
    if (isSurge) return $persistentStore.write(value, key)
  }
  const read = (key) => {
    if (isQuanX) return $prefs.valueForKey(key)
    if (isSurge) return $persistentStore.read(key)
  }
  const adapterStatus = (response) => {
    if (response) {
      if (response.status) {
        response["statusCode"] = response.status
      } else if (response.statusCode) {
        response["status"] = response.statusCode
      }
    }
    return response
  }
  const get = (options, callback) => {
    if (isQuanX) {
      if (typeof options == "string") options = {
        url: options
      }
      options["method"] = "GET"
      $task.fetch(options).then(response => {
        callback(null, adapterStatus(response), response.body)
      }, reason => callback(reason.error, null, null))
    }
    if (isSurge) $httpClient.get(options, (error, response, body) => {
      callback(error, adapterStatus(response), body)
    })
    if (isNode) {
      node.request(options, (error, response, body) => {
        callback(error, adapterStatus(response), body)
      })
    }
    if (isJSBox) {
      if (typeof options == "string") options = {
        url: options
      }
      options["header"] = options["headers"]
      options["handler"] = function(resp) {
        let error = resp.error;
        if (error) error = JSON.stringify(resp.error)
        let body = resp.data;
        if (typeof body == "object") body = JSON.stringify(resp.data);
        callback(error, adapterStatus(resp.response), body)
      };
      $http.get(options);
    }
  }
  const post = (options, callback) => {
    if (isQuanX) {
      if (typeof options == "string") options = {
        url: options
      }
      options["method"] = "POST"
      $task.fetch(options).then(response => {
        callback(null, adapterStatus(response), response.body)
      }, reason => callback(reason.error, null, null))
    }
    if (isSurge) {
      options.headers['X-Surge-Skip-Scripting'] = false
      $httpClient.post(options, (error, response, body) => {
        callback(error, adapterStatus(response), body)
      })
    }
    if (isNode) {
      node.request.post(options, (error, response, body) => {
        callback(error, adapterStatus(response), body)
      })
    }
    if (isJSBox) {
      if (typeof options == "string") options = {
        url: options
      }
      options["header"] = options["headers"]
      options["handler"] = function(resp) {
        let error = resp.error;
        if (error) error = JSON.stringify(resp.error)
        let body = resp.data;
        if (typeof body == "object") body = JSON.stringify(resp.data)
        callback(error, adapterStatus(resp.response), body)
      }
      $http.post(options);
    }
  }

  const log = (message) => console.log(message)
  const time = () => {
    const end = ((Date.now() - start) / 1000).toFixed(2)
    await showMsg();
    return console.log('\n签到用时: ' + end + ' 秒')
  }
  const done = (value = {}) => {
    if (isQuanX) return $done(value)
    if (isSurge) isRequest ? $done(value) : $done()
  }
  return {
    isRequest,
    isNode,
    notify,
    write,
    read,
    get,
    post,
    log,
    time,
    times,
    done
  }
};

function isJSON_test(str) {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            //console.log('转换成功：'+obj);
            return true;
        } catch(e) {
            console.log('no json');
            console.log('error：'+str+'!!!'+e);
            return false;
        }
    }
    //console.log('It is not a string!')
}

function k(e, t) {
  var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}
    , n = a.split
    , c = void 0 === n ? "|" : n
    , r = a.sort
    , s = void 0 === r || r
    , o = a.splitSecretKey
    , i = void 0 !== o && o
    , l = s ? Object.keys(t).sort() : Object.keys(t)
    , u = l.map((function (e) {
      return "".concat(e, "=").concat(t[e])
    }
    )).join(c) + (i ? c : "") + e;
  return md5(u)
}
function md5(date){
  const crypto = require('crypto');
  return crypto.createHash("md5").update(date, "utf8").digest("hex")
}
function w(){
  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
    , t = [];
  return Object.keys(e).forEach((function (a) {
    t.push("".concat(a, "=").concat(e[a]))
  }
  )),
    t.join("&")
}

// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}