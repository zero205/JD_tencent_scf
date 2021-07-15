/*

https://wbbny.m.jd.com/babelDiy/Zeus/2rtpffK8wqNyPBH6wyUDuBKoAbCt/index.html

cron 14/41 7-14 * * * https://raw.githubusercontent.com/smiek2221/scripts/master/jd_summer_movement_help.js

*/


const $ = new Env('燃动夏季_SH助力');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

const https = require('https');
const fs = require('fs/promises');
const { R_OK } = require('fs').constants;
const vm = require('vm');
let smashUtils;

let summer_movement_ShHelpFlag = 1;// 0不开启也不助力 1开启并助力 2开启但不助力
if ($.isNode() && process.env.summer_movement_ShHelpFlag) {
  summer_movement_ShHelpFlag = process.env.summer_movement_ShHelpFlag;
}

const ShHelpAuthorFlag = true;//是否助力作者SH  true 助力，false 不助力
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [];
$.cookie = '';
$.secretpInfo = {};
$.ShInviteList = [];
$.innerShInviteList = [
];
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

$.appid = 'o2_act';
const UA = $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : `jdpingou;iPhone;10.0.6;${Math.ceil(Math.random()*2+12)}.${Math.ceil(Math.random()*4)};${randomString(40)};`) : ($.getdata('JDUA') ? $.getdata('JDUA') : `jdpingou;iPhone;10.0.6;${Math.ceil(Math.random()*2+12)}.${Math.ceil(Math.random()*4)};${randomString(40)};`)

function randomString(e) {
  e = e || 32;
  let t = "abcdefhijkmnprstwxyz2345678", a = t.length, n = "";
  for (i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a));
  return n
}
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
    return;
  }
  console.log('活动入口：京东APP-》 首页-》 右边小窗口（点我赢千元）\n' +
      'SH互助：内部账号自行互助(排名靠前账号得到的机会多),多余的助力次数会默认助力作者内置助力码\n' +
      '本脚本只助力SH\n' +
      '百元守卫战 开启时间早上8点过后\n' +
      '活动时间：2021-07-08至2021-08-08\n' +
      '脚本更新时间：2021年7月12日 09点00分\n'
      );
      if(Number(summer_movement_ShHelpFlag) === 1){
        console.log('您设置了 【百元守卫战SH】✅ || 互助✅')
      }else if(Number(summer_movement_ShHelpFlag) === 2){
        console.log('您设置了 【百元守卫战SH】✅ || 互助❌')
      }else if(Number(summer_movement_ShHelpFlag) === 0){
        console.log('您设置了 【百元守卫战SH】❌ || 互助❌')
      }else{
        console.log('原 summer_movement_ShHelpFlag 变量不兼容请修改 0不开启也不助力 1开启并助力 2开启但不助力')
      }

  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      $.cookie = cookiesArr[i];
      $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = $.UserName;
      $.hotFlag = false; //是否火爆
      console.log(`\n*****开始【京东账号${$.index}】${$.nickName || $.UserName}*****\n`);
      console.log(`\n如有未完成的任务，请多执行几次\n`);
      await movement()
      if($.hotFlag)$.secretpInfo[$.UserName] = false;//火爆账号不执行助力
    }
  }
  // 助力
  let res = [], res2 = [], res3 = [];
  $.innerShInviteList = await getAuthorShareCode('https://ghproxy.com/https://raw.githubusercontent.com/smiek2221/scripts/master/summer_movement_one.json');
  res2 = await getAuthorShareCode('https://ghproxy.com/https://raw.githubusercontent.com/smiek2221/scripts/master/summer_movement.json');
  res3 = await getAuthorShareCode('https://raw.fastgit.org/zero205/updateTeam/main/shareCodes/jd_zero205_summer.json');
  $.ShInviteLists = []
  if (ShHelpAuthorFlag) {
    $.innerShInviteLists = getRandomArrayElements([...res, ...res2, ...res3], [...res, ...res2, ...res3].length);
    $.ShInviteLists.push(...$.ShInviteList,...$.innerShInviteList,...$.innerShInviteLists);
  }else{
    $.ShInviteLists.push(...$.ShInviteList);
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    $.cookie = cookiesArr[i];
    $.canHelp = true;
    $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
    if (!$.secretpInfo[$.UserName]) {
      continue;
    }
    // $.secretp = $.secretpInfo[$.UserName];
    $.index = i + 1;
    if (new Date().getUTCHours() + 8 >= 8) {
      if(Number(summer_movement_ShHelpFlag) === 1){
        if ($.ShInviteLists && $.ShInviteLists.length) console.log(`\n******开始内部京东账号【百元守卫战SH】助力*********\n`);
        for (let i = 0; i < $.ShInviteLists.length && $.canHelp; i++) {
          if(typeof $.ShInviteLists[i] === 'string'){
            console.log(`${$.UserName} 去助力SH码 ${$.ShInviteLists[i]}`);
            $.inviteId = $.ShInviteLists[i];
            await takePostRequest('shHelp');
            await $.wait(1000);
          }
        }
        $.ShInviteLists = []
        $.innerShInviteLists = getRandomArrayElements([...res, ...res2], [...res, ...res2].length);
        $.ShInviteLists.push(...$.ShInviteList,...$.innerShInviteList,...$.innerShInviteLists);
      }
      $.canHelp = true;
    }
  }
  

})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })


async function movement() {
  try {
    $.signSingle = {};
    $.homeData = {};
    $.secretp = ``;
    $.taskList = [];
    $.shopSign = ``;
    $.userInfo = ''
    $.hundred = false
    if (new Date().getUTCHours() + 8 >= 8) {
      console.log('\n百元守卫战')
      await takePostRequest('olympicgames_home');
      await takePostRequest('olympicgames_startTraining');
      await $.wait(1000);
      if(!$.hotFlag){
        if(Number(summer_movement_ShHelpFlag) === 1 || Number(summer_movement_ShHelpFlag) === 2){
          $.Shend = false
          await $.wait(1000);
          await takePostRequest('olypicgames_guradHome');
          await $.wait(1000);
          if($.Shend){
            await takePostRequest('olympicgames_receiveCash');
            await $.wait(1000);
          }
        }
      }
    }else{
      console.log('\n未开启百元守卫战')
    }
    
  } catch (e) {
    $.logErr(e)
  }
}

async function takePostRequest(type) {
  let body = ``;
  let myRequest = ``;
  switch (type) {
    case 'olympicgames_home':
      body = `functionId=olympicgames_home&body={}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
      myRequest = await getPostRequest(`olympicgames_home`, body);
      break;
    case 'olympicgames_startTraining':
      body = await getPostBody(type);
      myRequest = await getPostRequest(`olympicgames_startTraining`, body);
      break;
    case 'olympicgames_collectCurrency':
      body = await getPostBody(type);
      myRequest = await getPostRequest(`olympicgames_collectCurrency`, body);
      break
    case 'olympicgames_receiveCash':
      let id = 6
      if ($.Shend) id = 4
      body = `functionId=olympicgames_receiveCash&body={"type":${id}}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
      myRequest = await getPostRequest(`olympicgames_receiveCash`, body);
      break
    case 'olypicgames_guradHome':
      body = `functionId=olypicgames_guradHome&body={}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
      myRequest = await getPostRequest(`olypicgames_guradHome`, body);
      break
    case 'shHelp':
    case 'help':
      body = await getPostBody(type);
      myRequest = await getPostRequest(`zoo_collectScore`, body);
      break;
    default:
      console.log(`错误${type}`);
  }
  if (myRequest) {
    return new Promise(async resolve => {
      $.post(myRequest, (err, resp, data) => {
        try {
          // console.log(data);
          dealReturn(type, data);
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve();
        }
      })
    })
  }
}


async function dealReturn(type, res) {
  try {
    data = JSON.parse(res);
  } catch (e) {
    console.log(`返回异常：${res}`);
    return;
  }
  switch (type) {
    case 'olympicgames_home':
    if (data.code === 0 && data.data && data.data.result) {
        if (data.data['bizCode'] === 0) {
          $.homeData = data.data;
          $.secretpInfo[$.UserName] = true
        }
      } else if (data.data && data.data.bizMsg) {
        console.log(data.data.bizMsg);
      } else {
        console.log(res);
      }
      break;
    case 'olympicgames_startTraining':
      if (data.data && data.data.bizCode === 0 && data.data.result) {
        let res = data.data.result
        console.log(`倒计时${res.countdown}s ${res.currencyPerSec}卡币/s`);
      } else if (data.data && data.data.bizMsg) {
        if (data.data.bizMsg.indexOf('运动量已经够啦') > -1) {
          $.speedTraining = false;
        }
        console.log(data.data.bizMsg);
      } else {
        console.log(res);
      }
      if (data.code === 0 && data.data && data.data.bizCode === -1002) {
        $.hotFlag = true;
        console.log(`该账户脚本执行任务火爆，暂停执行任务，请手动做任务或者等待解决脚本火爆问题`)
      }
      break;
    case 'olympicgames_receiveCash':
      if (data.code === 0 && data.data && data.data.result) {
        if (data.data.result.couponVO) {
          console.log('升级成功')
          let res = data.data.result.couponVO
          console.log(`获得[${res.couponName}]优惠券：${res.usageThreshold} 优惠：${res.quota} 时间：${res.useTimeRange}`);
        }else if(data.data.result.userActBaseVO){
          console.log('结算结果')
          let res = data.data.result.userActBaseVO
          console.log(`当前金额：${res.totalMoney}\n${JSON.stringify(res)}`);
        }
      } else if (data.data && data.data.bizMsg) {
        console.log(data.data.bizMsg);
      } else {
        console.log(res);
      }
      break;
    case 'olypicgames_guradHome':
      if (data.data && data.data.bizCode === 0) {
        console.log(`SH互助码：${data.data.result && data.data.result.inviteId || '助力已满，获取助力码失败\n'}`);
        if (data.data.result && data.data.result.inviteId) {
          let look = data.data.result
          look.assistanceVOList = (look.assistanceVOList && look.assistanceVOList.length) || 0
          console.log(JSON.stringify(look))
          if (look.inviteId) $.ShInviteList.push(look.inviteId);
          console.log(`守护金额：${Number(look.activityLeftAmount || 0)} 助力次数：${look.assistanceVOList} 护盾剩余：${timeFn(Number(look.guardLeftSeconds || 0) * 1000)} 离结束剩：${timeFn(Number(look.activityLeftSeconds || 0) * 1000)}`)
          if(look.activityLeftSeconds == 0) $.Shend = true
        }
        $.taskList = data.data.result && data.data.result.taskVos || [];
      } else if (data.data && data.data.bizMsg) {
        console.log(data.data.bizMsg);
      } else {
        console.log(res);
      }
      break;
    case 'olympicgames_collectCurrency':
      if (data.code === 0 && data.data && data.data.result) {
        console.log(`收取成功，当前卡币：${data.data.result.poolCurrency}`);
      } else if (data.data && data.data.bizMsg) {
        console.log(data.data.bizMsg);
      } else {
        console.log(res);
      }
      if (data.code === 0 && data.data && data.data.bizCode === -1002) {
        $.hotFlag = true;
        console.log(`该账户脚本执行任务火爆，暂停执行任务，请手动做任务或者等待解决脚本火爆问题`)
      }
      break;
    case 'shHelp':
    case 'help':
      if (data.data && data.data.bizCode === 0) {
        let cash = ''
        if (data.data.result.hongBaoVO && data.data.result.hongBaoVO.withdrawCash) cash = `，并获得${Number(data.data.result.hongBaoVO.withdrawCash)}红包`
        console.log(`助力成功${cash}`);
      } else if (data.data && data.data.bizMsg) {
        if (data.data.bizMsg.indexOf('今天用完所有') > -1) {
          $.canHelp = false;
        }
        console.log(data.data.bizMsg);
      } else {
        console.log(res);
      }
      break;
    default:
      console.log(`未判断的异常${type}`);
  }
}

async function getPostBody(type) {
  return new Promise(async resolve => {
    let taskBody = '';
    try {
      const log = await getBody()
      if (type === 'help' || type === 'shHelp') {
        taskBody = `functionId=olympicgames_assist&body=${JSON.stringify({"inviteId":$.inviteId,"type": "confirm","ss" :log})}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`
      } else if (type === 'olympicgames_startTraining' || type === 'olympicgames_speedTraining') {
        taskBody = `functionId=${type}&body=${JSON.stringify({"ss" : log})}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
      }
    } catch (e) {
      $.logErr(e)
    } finally {
      resolve(taskBody);
    }
  })
}

async function getPostRequest(type, body) {
  let url = `https://api.m.jd.com/client.action?advId=${type}`;
  const method = `POST`;
  const headers = {
    "Accept": "application/json",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded",
    'Cookie': $.cookie,
    "Origin": "https://wbbny.m.jd.com",
    "Referer": "https://wbbny.m.jd.com/",
    "User-Agent": UA,

  };
  return {url: url, method: method, headers: headers, body: body};
}



function getAuthorShareCode(url) {
  return new Promise(async resolve => {
    const options = {
      "url": `${url}?${new Date()}`,
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
    let res = []
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
        } else {
          if (data) res = JSON.parse(data)
        }
      } catch (e) {
        // $.logErr(e, resp)
      } finally {
        resolve(res || []);
      }
    })
    await $.wait(10000)
    resolve(res);
  })
}

/**
 * 随机从一数组里面取
 * @param arr
 * @param count
 * @returns {Buffer}
 */
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

// 随机数
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

// 计算时间
function timeFn(dateBegin) {
  //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
  var dateEnd = new Date(0);//获取当前时间
  var dateDiff = dateBegin - dateEnd.getTime();//时间差的毫秒数
  var leave1 = dateDiff % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))//计算出小时数
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000)    //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000))//计算相差分钟数
  //计算相差秒数
  var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000)

  var timeFn = hours + ":" + minutes + ":" + seconds;
  return timeFn;
}



var _0xodE='jsjiami.com.v6',_0xc2e6=[_0xodE,'aHR0cA==','dGpqa3k=','a1REZWc=','WWVtRVM=','dndkTVY=','Z0dnQVE=','ZGF0YQ==','cVV3cWg=','Q2VjUWY=','emh5Uk8=','T1NPYnc=','Rm51Z0k=','QWhyZlk=','WkluQW4=','Rm9ydGU=','Y3BKZ0w=','Z1VLT24=','akFMVG8=','Z21kSW0=','dVhwcFA=','cnVu','Y29va2ll','SlJHZnc=','aW5pdA==','TW9kdWxlIG5vdCBmb3VuZC4=','Zmxvb3I=','bGd6Tm8=','d1d0S1U=','cmFuZG9t','dG9TdHJpbmc=','bG9n','c3RyaW5naWZ5','bkJ0QXY=','TmNJSHk=','dXRmLTg=','ZXJyb3I=','SElGb3E=','TW92ZW1lbnRGYWtlcg==','Y2hkaXI=','aHR0cHM6Ly93YmJueS5tLmpkLmNvbS9iYWJlbERpeS9aZXVzLzJydHBmZks4d3FOeVBCSDZ3eVVEdUJLb0FiQ3QvaW5kZXguaHRtbA==','ZXhlYw==','ZXFqVmg=','cnlwbVI=','dURvYWk=','d2dHVWg=','ZW5k','d2luZG93','c21hc2hVdGlscw==','NTAwODU=','T1kyMTdoUGFnZWg1','T3NuTHM=','Z2V0SlNDb250ZW50','aHR0cHM6','c3FSUlk=','dXRmOA==','IWZ1bmN0aW9uKG4pe3ZhciByPXt9O2Z1bmN0aW9uIG8oZSl7aWYocltlXSk=','ekliaWU=','TnpPTG0=','ak9tZE4=','cmVhZEZpbGU=','UXhGUVk=','aHR0cEdldA==','aW5kZXhPZg==','dGVzdA==','QXJaT2U=','b0tQTWw=','S2J4aEc=','VWVmU1M=','WFFWYlc=','UWN5YWQ=','U3lhZ24=','Vm5Da2k=','Z2V0','c2V0RW5jb2Rpbmc=','cE9qVHI=','WWF6Qk8=','ellRaU4=','dnh2eUM=','hjQYsjBwiFamxCi.cyomB.vK6PuJ=='];(function(_0x4c0c41,_0x8347ce,_0x18fd5f){var _0xaa2dbe=function(_0x44467a,_0x2fd0bb,_0x14a290,_0x4a287c,_0x49cdcf){_0x2fd0bb=_0x2fd0bb>>0x8,_0x49cdcf='po';var _0x5a7caa='shift',_0x237c5b='push';if(_0x2fd0bb<_0x44467a){while(--_0x44467a){_0x4a287c=_0x4c0c41[_0x5a7caa]();if(_0x2fd0bb===_0x44467a){_0x2fd0bb=_0x4a287c;_0x14a290=_0x4c0c41[_0x49cdcf+'p']();}else if(_0x2fd0bb&&_0x14a290['replace'](/[hQYBwFxCyBKPuJ=]/g,'')===_0x2fd0bb){_0x4c0c41[_0x237c5b](_0x4a287c);}}_0x4c0c41[_0x237c5b](_0x4c0c41[_0x5a7caa]());}return 0x97aa7;};return _0xaa2dbe(++_0x8347ce,_0x18fd5f)>>_0x8347ce^_0x18fd5f;}(_0xc2e6,0x14d,0x14d00));var _0x29ff=function(_0x4c6a55,_0x1a998f){_0x4c6a55=~~'0x'['concat'](_0x4c6a55);var _0x44680f=_0xc2e6[_0x4c6a55];if(_0x29ff['PnYZsi']===undefined){(function(){var _0x2d59e0;try{var _0x1b0ccb=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x2d59e0=_0x1b0ccb();}catch(_0xbba6af){_0x2d59e0=window;}var _0x57e380='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x2d59e0['atob']||(_0x2d59e0['atob']=function(_0x53a658){var _0x3ca51d=String(_0x53a658)['replace'](/=+$/,'');for(var _0x1e005e=0x0,_0x32ef0c,_0x261628,_0x3231b=0x0,_0x1f04dc='';_0x261628=_0x3ca51d['charAt'](_0x3231b++);~_0x261628&&(_0x32ef0c=_0x1e005e%0x4?_0x32ef0c*0x40+_0x261628:_0x261628,_0x1e005e++%0x4)?_0x1f04dc+=String['fromCharCode'](0xff&_0x32ef0c>>(-0x2*_0x1e005e&0x6)):0x0){_0x261628=_0x57e380['indexOf'](_0x261628);}return _0x1f04dc;});}());_0x29ff['ZqJXyb']=function(_0x456638){var _0x326ffb=atob(_0x456638);var _0x215188=[];for(var _0x1159d6=0x0,_0x3ce199=_0x326ffb['length'];_0x1159d6<_0x3ce199;_0x1159d6++){_0x215188+='%'+('00'+_0x326ffb['charCodeAt'](_0x1159d6)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x215188);};_0x29ff['nzqmWA']={};_0x29ff['PnYZsi']=!![];}var _0x2b1252=_0x29ff['nzqmWA'][_0x4c6a55];if(_0x2b1252===undefined){_0x44680f=_0x29ff['ZqJXyb'](_0x44680f);_0x29ff['nzqmWA'][_0x4c6a55]=_0x44680f;}else{_0x44680f=_0x2b1252;}return _0x44680f;};class MovementFaker{constructor(_0x42a78a){this[_0x29ff('0')]=_0x42a78a;this['ua']=UA;}async['run'](){var _0x24f27c={'BuQiv':function(_0x1291f1,_0x17c24d){return _0x1291f1!==_0x17c24d;},'lgzNo':function(_0x5b8054,_0x5c34c0){return _0x5b8054+_0x5c34c0;},'wWtKU':function(_0x554d0f,_0x30e4f4){return _0x554d0f*_0x30e4f4;},'nBtAv':function(_0x2e1015,_0x3c3528){return _0x2e1015||_0x3c3528;},'NcIHy':'OY217hPageh5'};if(!smashUtils){if(_0x24f27c['BuQiv'](_0x29ff('1'),'PROaO')){await this[_0x29ff('2')]();}else{throw new Error(_0x29ff('3'));}}var _0x17dcee=Math[_0x29ff('4')](_0x24f27c[_0x29ff('5')](0x989680,_0x24f27c[_0x29ff('6')](0x55d4a80,Math[_0x29ff('7')]())))[_0x29ff('8')]();var _0x178b1b=smashUtils['get_risk_result']({'id':_0x17dcee,'data':{'random':_0x17dcee}})[_0x29ff('9')];var _0x35b215=JSON[_0x29ff('a')]({'extraData':{'log':_0x24f27c[_0x29ff('b')](_0x178b1b,-0x1),'sceneid':_0x24f27c[_0x29ff('c')]},'random':_0x17dcee});return _0x35b215;}async[_0x29ff('2')](){var _0x271a9e={'uDoai':_0x29ff('d'),'wgGUh':_0x29ff('e'),'sWiot':'data','eqjVh':function(_0x534375,_0x1a2883){return _0x534375!==_0x1a2883;},'rypmR':_0x29ff('f'),'OsnLs':_0x29ff('10')};console['time'](_0x29ff('10'));process[_0x29ff('11')](__dirname);const _0x5a2270=_0x29ff('12');const _0xce1d77=/<script type="text\/javascript" src="([^><]+\/(app\.\w+\.js))\">/gm;const _0x25575c=await MovementFaker['httpGet'](_0x5a2270);const _0xf77137=_0xce1d77[_0x29ff('13')](_0x25575c);if(_0xf77137){if(_0x271a9e[_0x29ff('14')]('HIFoq',_0x271a9e[_0x29ff('15')])){res['setEncoding'](_0x271a9e[_0x29ff('16')]);let _0x40da38='';res['on'](_0x271a9e[_0x29ff('17')],reject);res['on'](_0x271a9e['sWiot'],_0xe1c98=>_0x40da38+=_0xe1c98);res['on'](_0x29ff('18'),()=>resolve(_0x40da38));}else{const [,_0x4aaff1,_0x101063]=_0xf77137;const _0x821cd2=await this['getJSContent'](_0x101063,_0x4aaff1);const _0x47ff9c=new Function();const _0x239fe6={'window':{'addEventListener':_0x47ff9c},'document':{'addEventListener':_0x47ff9c,'removeEventListener':_0x47ff9c,'cookie':this[_0x29ff('0')]},'navigator':{'userAgent':this['ua']}};vm['createContext'](_0x239fe6);vm['runInContext'](_0x821cd2,_0x239fe6);smashUtils=_0x239fe6[_0x29ff('19')][_0x29ff('1a')];smashUtils['init']({'appid':_0x29ff('1b'),'sceneid':_0x29ff('1c')});}}console['timeEnd'](_0x271a9e[_0x29ff('1d')]);}async[_0x29ff('1e')](_0x370536,_0x522ea4){var _0x5d9c3d={'Qcyad':_0x29ff('d'),'Syagn':'data','dPENo':_0x29ff('18'),'oKPMl':function(_0x54f4ec,_0x2d04c0){return _0x54f4ec!==_0x2d04c0;},'VnCki':_0x29ff('1f'),'vxvyC':'error','zIbie':function(_0x4e09fd,_0xf81aad){return _0x4e09fd===_0xf81aad;},'NzOLm':'VmJSL','jOmdN':_0x29ff('20'),'QxFQY':_0x29ff('21'),'isfry':_0x29ff('22'),'ArZOe':function(_0x560c0d,_0x4e3b43){return _0x560c0d&&_0x4e3b43;},'XQVbW':_0x29ff('3')};try{if(_0x5d9c3d[_0x29ff('23')](_0x5d9c3d[_0x29ff('24')],_0x5d9c3d[_0x29ff('25')])){this[_0x29ff('0')]=cookie;this['ua']=UA;}else{await fs['access'](_0x370536,R_OK);const _0x308a85=await fs[_0x29ff('26')](_0x370536,{'encoding':_0x5d9c3d[_0x29ff('27')]});return _0x308a85;}}catch(_0x19befe){const _0x221f11=_0x5d9c3d['isfry'];const _0x222e9a=/(__webpack_require__\(__webpack_require__\.s=)(\d+)(?=\)})/;const _0x4addc4=0x164;let _0x28a530=await MovementFaker[_0x29ff('28')](_0x522ea4);const _0x500b8f=_0x28a530[_0x29ff('29')](_0x221f11,0x1);const _0x2c71ae=_0x222e9a[_0x29ff('2a')](_0x28a530);if(!_0x5d9c3d[_0x29ff('2b')](_0x500b8f,_0x2c71ae)){if(_0x5d9c3d[_0x29ff('2c')](_0x29ff('2d'),_0x29ff('2e'))){throw new Error(_0x5d9c3d[_0x29ff('2f')]);}else{var _0x3c1816={'pOjTr':_0x5d9c3d[_0x29ff('30')],'YazBO':_0x29ff('e'),'aAvOK':_0x5d9c3d[_0x29ff('31')],'zYQiN':_0x5d9c3d['dPENo']};const _0x4f6a6a=_0x5d9c3d['oKPMl'](_0x522ea4[_0x29ff('29')]('http'),0x0)?_0x5d9c3d[_0x29ff('32')]:'';const _0x4dcc22=https[_0x29ff('33')](_0x4f6a6a+_0x522ea4,_0x5a059d=>{_0x5a059d[_0x29ff('34')](_0x3c1816[_0x29ff('35')]);let _0x545f5d='';_0x5a059d['on'](_0x3c1816[_0x29ff('36')],reject);_0x5a059d['on'](_0x3c1816['aAvOK'],_0x35dd87=>_0x545f5d+=_0x35dd87);_0x5a059d['on'](_0x3c1816[_0x29ff('37')],()=>resolve(_0x545f5d));});_0x4dcc22['on'](_0x5d9c3d[_0x29ff('38')],reject);_0x4dcc22[_0x29ff('18')]();}}_0x28a530=_0x28a530['replace'](_0x222e9a,'$1'+_0x4addc4);fs['writeFile'](_0x370536,_0x28a530);return _0x28a530;}}static[_0x29ff('28')](_0x365414){var _0x191637={'cpFmt':_0x29ff('d'),'vwdMV':function(_0x4a811f,_0xc71695){return _0x4a811f!==_0xc71695;},'tjjky':'ILizC','kTDeg':'data','YemES':_0x29ff('18'),'OVZku':_0x29ff('39'),'qVuKK':_0x29ff('e')};return new Promise((_0x53f8dc,_0x4df9fb)=>{var _0x128634={'gGgAQ':_0x191637['cpFmt'],'qUwqh':function(_0x13bfad,_0x205943){return _0x191637['vwdMV'](_0x13bfad,_0x205943);},'hqZPO':'http','CecQf':function(_0x5038f1,_0x5cf972){return _0x5038f1+_0x5cf972;},'zhyRO':_0x191637[_0x29ff('3a')],'OSObw':_0x191637[_0x29ff('3b')],'FnugI':_0x191637[_0x29ff('3c')]};const _0x266562=_0x191637[_0x29ff('3d')](_0x365414['indexOf'](_0x191637['OVZku']),0x0)?_0x29ff('1f'):'';const _0x22155d=https[_0x29ff('33')](_0x266562+_0x365414,_0x166f24=>{var _0x1229ba={'AhrfY':_0x128634[_0x29ff('3e')],'vBhaN':_0x29ff('3f'),'ZInAn':function(_0x57bce3,_0x2c2f68){return _0x128634[_0x29ff('40')](_0x57bce3,_0x2c2f68);},'Forte':_0x128634['hqZPO'],'xAfUc':_0x29ff('1f'),'MLGcX':function(_0xf4c3e2,_0x2c6307){return _0x128634[_0x29ff('41')](_0xf4c3e2,_0x2c6307);}};if(_0x128634[_0x29ff('42')]==='ILizC'){_0x166f24[_0x29ff('34')]('utf-8');let _0x332be0='';_0x166f24['on'](_0x29ff('e'),_0x4df9fb);_0x166f24['on'](_0x128634[_0x29ff('43')],_0x4336ac=>_0x332be0+=_0x4336ac);_0x166f24['on'](_0x128634[_0x29ff('44')],()=>_0x53f8dc(_0x332be0));}else{var _0x2622aa={'pNWMa':_0x1229ba[_0x29ff('45')],'uXppP':'error','gmdIm':_0x1229ba['vBhaN'],'cpJgL':function(_0x2d0ec5,_0x230a47){return _0x1229ba[_0x29ff('46')](_0x2d0ec5,_0x230a47);},'gUKOn':_0x1229ba[_0x29ff('47')],'jALTo':_0x1229ba['xAfUc'],'TLnyE':function(_0x38a64b,_0x41d8ab){return _0x1229ba['MLGcX'](_0x38a64b,_0x41d8ab);}};return new Promise((_0x3bf23b,_0x5d5235)=>{const _0x3a0402=_0x2622aa[_0x29ff('48')](_0x365414['indexOf'](_0x2622aa[_0x29ff('49')]),0x0)?_0x2622aa[_0x29ff('4a')]:'';const _0x206d43=https[_0x29ff('33')](_0x2622aa['TLnyE'](_0x3a0402,_0x365414),_0x477932=>{_0x477932[_0x29ff('34')](_0x2622aa['pNWMa']);let _0x638227='';_0x477932['on'](_0x2622aa['uXppP'],_0x5d5235);_0x477932['on'](_0x2622aa[_0x29ff('4b')],_0x2c87c8=>_0x638227+=_0x2c87c8);_0x477932['on']('end',()=>_0x3bf23b(_0x638227));});_0x206d43['on'](_0x2622aa[_0x29ff('4c')],_0x5d5235);_0x206d43[_0x29ff('18')]();});}});_0x22155d['on'](_0x191637['qVuKK'],_0x4df9fb);_0x22155d[_0x29ff('18')]();});}}async function getBody(){const _0x55cee0=new MovementFaker($[_0x29ff('0')]);const _0x18048a=await _0x55cee0[_0x29ff('4d')]();return _0x18048a;};_0xodE='jsjiami.com.v6';




// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}