/*
* 来客有礼小程序
* cron 45 4 * * *
* 至少需要11个ck
* 优先账号内互助，再助力zero205
* */
const $ = new Env('送豆得豆');
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [];
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
$.activityId = 85;
!(async () => {
  $.isLoginInfo = {};
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  let openCount = Math.floor((Number(cookiesArr.length)-1)/10);
  console.log(`\n共有${cookiesArr.length}个账号，前${openCount}个账号可以开团\n`);
  $.openTuanList = [];
  console.log(`前${openCount}个账号开始开团\n`);
  for (let i = 0; i < cookiesArr.length && i < openCount; i++) {
    $.cookie = cookiesArr[i];
    $.UserName = decodeURIComponent($.cookie.match(/pt_pin=(.+?);/) && $.cookie.match(/pt_pin=(.+?);/)[1]);
    $.index = i + 1;
    $.isLogin = true;
    $.nickName = $.UserName;
    await TotalBean();
    console.log(`\n*****开始【京东账号${$.index}】${$.nickName || $.UserName}*****\n`);
    $.isLoginInfo[$.UserName] = $.isLogin;
    if (!$.isLogin) {
      $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
      if ($.isNode()) {
        await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
      }
      continue;
    }
    await openTuan();
  }
  console.log('\n开团信息\n'+JSON.stringify($.openTuanList));
  console.log(`\n开始互助\n`);
  let ckList = getRandomArrayElements(cookiesArr,cookiesArr.length);
  for (let i = 0; i < ckList.length; i++) {
    $.cookie = ckList[i];
    $.UserName = decodeURIComponent($.cookie.match(/pt_pin=(.+?);/) && $.cookie.match(/pt_pin=(.+?);/)[1])
    $.index = i + 1;
    $.isLogin = true;
    if(!$.isLoginInfo[$.UserName]){
      await TotalBean();
      $.isLoginInfo[$.UserName] = $.isLogin;
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue;
      }
    }
    await helpMain();
  }
  console.log(`\n开始帮【zero205】助力\n`);
  await getShareCode()
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    $.UserName = decodeURIComponent($.cookie.match(/pt_pin=(.+?);/) && $.cookie.match(/pt_pin=(.+?);/)[1])
    $.index = i + 1;
    $.isLogin = true;
    $.canHelp = true;
    $.oneTuanInfo = $.authorCode[i];
    if ($.oneTuanInfo['completed']) {
      continue;
    }
    console.log(`${$.UserName}去助力${$.oneTuanInfo['user']}`);
    $.detail = {};
    $.rewardRecordId = '';
    await getActivityDetail();
    if (JSON.stringify($.detail) === '{}') {
      console.log(`获取活动详情失败`);
      return;
    } else {
      $.rewardRecordId = $.detail.rewardRecordId;
      console.log(`获取活动详情成功`);
    }
    await $.wait(3000);
    await help();
    await $.wait(2000);
  }
  console.log(`\n开始领取奖励\n`);
  for (let i = 0; i < cookiesArr.length && i < openCount; i++) {
    $.cookie = cookiesArr[i];
    $.UserName = decodeURIComponent($.cookie.match(/pt_pin=(.+?);/) && $.cookie.match(/pt_pin=(.+?);/)[1])
    $.index = i + 1;
    $.isLogin = true;
    if(!$.isLoginInfo[$.UserName]){
      await TotalBean();
      $.isLoginInfo[$.UserName] = $.isLogin;
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue;
      }
    }
    console.log(`\n*****开始【京东账号${$.index}】${$.UserName}*****\n`);
    await rewardMain();
  }
})().catch((e) => {$.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')}).finally(() => {$.done();});


async function openTuan(){
  $.detail = {};
  $.rewardRecordId = '';
  await getActivityDetail();
  if(JSON.stringify($.detail) === '{}'){
    console.log(`获取活动详情失败`);
    return;
  }else{
    $.rewardRecordId = $.detail.rewardRecordId;
    console.log(`获取活动详情成功`);
  }
  await $.wait(3000);
  if(!$.rewardRecordId){
    if(!$.detail.invited){
      await invite();
      await $.wait(1000);
      await getActivityDetail();
      await $.wait(3000);
      $.rewardRecordId = $.detail.rewardRecordId;
      console.log(`【京东账号${$.index}】${$.UserName} 瓜分ID:${$.rewardRecordId}`);
    }
  }else{
    console.log(`【京东账号${$.index}】${$.UserName} 瓜分ID:${$.rewardRecordId}`);
  }
  $.openTuanList.push({
    'user':$.UserName,
    'rewardRecordId':$.rewardRecordId,
    'completed':$.detail.completed,
    'rewardOk':$.detail.rewardOk
  });
}

async function helpMain(){
  $.canHelp = true;
  for (let j = 0; j < $.openTuanList.length && $.canHelp; j++) {
    $.oneTuanInfo =  $.openTuanList[j];
    if( $.UserName === $.oneTuanInfo['user']){
      continue;
    }
    if( $.oneTuanInfo['completed']){
      continue;
    }
    console.log(`${$.UserName}去助力${$.oneTuanInfo['user']}`);
    $.detail = {};
    $.rewardRecordId = '';
    await getActivityDetail();
    if(JSON.stringify($.detail) === '{}'){
      console.log(`获取活动详情失败`);
      return;
    }else{
      $.rewardRecordId = $.detail.rewardRecordId;
      console.log(`获取活动详情成功`);
    }
    await $.wait(3000);
    await help();
    await $.wait(2000);
  }
}

async function rewardMain(){
  $.detail = {};
  $.rewardRecordId = '';
  await getActivityDetail();
  if(JSON.stringify($.detail) === '{}'){
    console.log(`获取活动详情失败`);
    return;
  }else{
    $.rewardRecordId = $.detail.rewardRecordId;
    console.log(`获取活动详情成功`);
  }
  await $.wait(3000);
  if($.rewardRecordId && $.detail.completed && !$.detail.rewardOk){
    await rewardBean();
    await $.wait(2000);
  }else if($.rewardRecordId && $.detail.completed && $.detail.rewardOk){
    console.log(`奖励已领取`);
  }else{
    console.log(`未满足条件，不可领取奖励`);
  }
}
async function rewardBean(){
  return new Promise((resolve) => {
    let options = {
      "url": `https://draw.jdfcloud.com/common/api/bean/activity/sendBean?rewardRecordId=${$.rewardRecordId}&jdChannelId=&userSource=mp&appId=wxccb5c536b0ecd1bf&invokeKey=qRKHmL4sna8ZOP9F`,
      "headers":  {
        'content-type' : `application/json`,
        'Connection' : `keep-alive`,
        'Accept-Encoding' : `gzip,compress,br,deflate`,
        'App-Id' : `wxccb5c536b0ecd1bf`,
        'Lottery-Access-Signature' : `wxccb5c536b0ecd1bf1537237540544h79HlfU`,
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        'openId' : `oPcgJ4_X7uCMeTgGmar-rmiWst1Y`,
        'Host' : `draw.jdfcloud.com`,
        'Referer' : `https://servicewechat.com/wxccb5c536b0ecd1bf/733/page-frame.html`,
        'cookie' : $.cookie,
      }
    };
    $.get(options, (err, resp, data) => {
      try {
        data = JSON.parse(data);
        if(data.success){
          console.log(`领取豆子奖励成功`);
        }else{
          console.log(JSON.stringify(data));
        }
      } catch (e) {
        console.log(e);
      } finally {
        resolve(data);
      }
    })
  });
}

function getRandomArrayElements(arr, count) {
  var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

async function help() {
  await new Promise((resolve) => {
    let options = {
      "url": `https://draw.jdfcloud.com/common/api/bean/activity/participate?activityId=${$.activityId}&inviteUserPin=${encodeURIComponent($.oneTuanInfo['user'])}&invokeKey=qRKHmL4sna8ZOP9F&timestap=${Date.now()}`,
      "headers":  {
        'content-type' : `application/json`,
        'Connection' : `keep-alive`,
        'Accept-Encoding' : `gzip,compress,br,deflate`,
        'App-Id' : `wxccb5c536b0ecd1bf`,
        'Lottery-Access-Signature' : `wxccb5c536b0ecd1bf1537237540544h79HlfU`,
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        'openId' : `oPcgJ4_X7uCMeTgGmar-rmiWst1Y`,
        'Host' : `draw.jdfcloud.com`,
        'Referer' : `https://servicewechat.com/wxccb5c536b0ecd1bf/733/page-frame.html`,
        'cookie' : $.cookie,
      }
    };
    $.post(options, (err, resp, res) => {
      try {
        if (res) {
          res = JSON.parse(res);
          if(res.data.result === 5){
            $.oneTuanInfo['completed'] = true;
          }else if(res.data.result === 0 || res.data.result === 1){
            $.canHelp = false;
          }
          console.log(JSON.stringify(res));
        }
      } catch (e) {
        console.log(e);
      } finally {
        resolve(res);
      }
    })
  });
}

async function invite() {
  const url = `https://draw.jdfcloud.com/common/api/bean/activity/invite?openId=oPcgJ4_X7uCMeTgGmar-rmiWst1Y&activityId=${$.activityId}&userSource=mp&formId=123&jdChannelId=&fp=&appId=wxccb5c536b0ecd1bf&invokeKey=qRKHmL4sna8ZOP9F`;
  const method = `POST`;
  const headers = {
    'content-type' : `application/json`,
    'Connection' : `keep-alive`,
    'Accept-Encoding' : `gzip,compress,br,deflate`,
    'App-Id' : `wxccb5c536b0ecd1bf`,
    'Lottery-Access-Signature' : `wxccb5c536b0ecd1bf1537237540544h79HlfU`,
    "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
    'openId' : `oPcgJ4_X7uCMeTgGmar-rmiWst1Y`,
    'Host' : `draw.jdfcloud.com`,
    'Referer' : `https://servicewechat.com/wxccb5c536b0ecd1bf/733/page-frame.html`,
    'cookie' : $.cookie,
  };
  const body = `{}`;
  const myRequest = {
    url: url,
    method: method,
    headers: headers,
    body: body
  };
  return new Promise(async resolve => {
    $.post(myRequest, (err, resp, data) => {
      try {
        data = JSON.parse(data);
        if(data.success){
          console.log(`发起瓜分成功`);
        }else{
          console.log(JSON.stringify(data));
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


async function getActivityDetail() {
  const url = `https://draw.jdfcloud.com/common/api/bean/activity/detail?activityId=${$.activityId}&userOpenId=oPcgJ4_X7uCMeTgGmar-rmiWst1Y&timestap=${Date.now()}&userSource=mp&jdChannelId=&appId=wxccb5c536b0ecd1bf&invokeKey=qRKHmL4sna8ZOP9F`;
  const method = `GET`;
  const headers = {
    'cookie' : $.cookie,
    'openId' : `oPcgJ4_X7uCMeTgGmar-rmiWst1Y`,
    'Connection' : `keep-alive`,
    'App-Id' : `wxccb5c536b0ecd1bf`,
    'content-type' : `application/json`,
    'Host' : `draw.jdfcloud.com`,
    'Accept-Encoding' : `gzip,compress,br,deflate`,
    "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
    'Lottery-Access-Signature' : `wxccb5c536b0ecd1bf1537237540544h79HlfU`,
    'Referer' : `https://servicewechat.com/wxccb5c536b0ecd1bf/733/page-frame.html`,
  };
  const myRequest = {url: url, method: method, headers: headers};
  return new Promise(async resolve => {
    $.get(myRequest, (err, resp, data) => {
      try {
        //console.log(data);
        data = JSON.parse(data);
        if(data.success){
          $.detail = data.data;
        }
      } catch (e) {
        //console.log(data);
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

var _0xodF='jsjiami.com.v6',_0x5fb4=[_0xodF,'\x67\x65\x74','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x72\x61\x77\x2e\x66\x61\x73\x74\x67\x69\x74\x2e\x6f\x72\x67\x2f\x7a\x65\x72\x6f\x32\x30\x35\x2f\x75\x70\x64\x61\x74\x65\x54\x65\x61\x6d\x2f\x6d\x61\x69\x6e\x2f\x73\x68\x61\x72\x65\x43\x6f\x64\x65\x73\x2f\x73\x64\x2e\x6a\x73\x6f\x6e','\x4d\x6f\x7a\x69\x6c\x6c\x61\x2f\x35\x2e\x30\x20\x28\x69\x50\x68\x6f\x6e\x65\x3b\x20\x43\x50\x55\x20\x69\x50\x68\x6f\x6e\x65\x20\x4f\x53\x20\x31\x33\x5f\x32\x5f\x33\x20\x6c\x69\x6b\x65\x20\x4d\x61\x63\x20\x4f\x53\x20\x58\x29\x20\x41\x70\x70\x6c\x65\x57\x65\x62\x4b\x69\x74\x2f\x36\x30\x35\x2e\x31\x2e\x31\x35\x20\x28\x4b\x48\x54\x4d\x4c\x2c\x20\x6c\x69\x6b\x65\x20\x47\x65\x63\x6b\x6f\x29\x20\x56\x65\x72\x73\x69\x6f\x6e\x2f\x31\x33\x2e\x30\x2e\x33\x20\x4d\x6f\x62\x69\x6c\x65\x2f\x31\x35\x45\x31\x34\x38\x20\x53\x61\x66\x61\x72\x69\x2f\x36\x30\x34\x2e\x31\x20\x45\x64\x67\x2f\x38\x37\x2e\x30\x2e\x34\x32\x38\x30\x2e\x38\x38','\x61\x75\x74\x68\x6f\x72\x43\x6f\x64\x65','\x70\x61\x72\x73\x65','\x6c\x6f\x67\x45\x72\x72','\x6a\x73\x71\x4b\x79\x44\x79\x6a\x43\x66\x69\x50\x5a\x61\x78\x4d\x4a\x64\x42\x6d\x69\x2e\x63\x6f\x6d\x2e\x76\x36\x3d\x3d'];var _0x2076=function(_0x5b8159,_0x281a5c){_0x5b8159=~~'0x'['concat'](_0x5b8159);var _0x4dae4e=_0x5fb4[_0x5b8159];return _0x4dae4e;};(function(_0x26286e,_0x2b13b4){var _0x2b526e=0x0;for(_0x2b13b4=_0x26286e['shift'](_0x2b526e>>0x2);_0x2b13b4&&_0x2b13b4!==(_0x26286e['pop'](_0x2b526e>>0x3)+'')['replace'](/[qKyDyCfPZxMJdB=]/g,'');_0x2b526e++){_0x2b526e=_0x2b526e^0x9825a;}}(_0x5fb4,_0x2076));function getShareCode(){return new Promise(_0xe071eb=>{$[_0x2076('0')]({'\x75\x72\x6c':_0x2076('1'),'\x68\x65\x61\x64\x65\x72\x73':{'User-Agent':_0x2076('2')}},async(_0x30a3c6,_0x1b903c,_0x570d82)=>{try{if(_0x30a3c6){}else{$[_0x2076('3')]=JSON[_0x2076('4')](_0x570d82);}}catch(_0x4008ba){$[_0x2076('5')](_0x4008ba,_0x1b903c);}finally{_0xe071eb();}});});};_0xodF='jsjiami.com.v6';

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