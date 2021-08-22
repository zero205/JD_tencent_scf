// @grant    require
/*
cron 8 0 * * * jd_ljd.js
// https://h5.m.jd.com/rn/42yjy8na6pFsq1cx9MJQ5aTgu3kX/index.html

入口：首页-领京豆-升级赚京豆
21 9 * * * https://raw.githubusercontent.com/smiek2221/scripts/master/gua_MMdou.js, tag=MM领京豆, enabled=true

*/

const $ = new Env('MM领京豆');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const jdVersion = '10.0.8'
const iphoneVersion = [Math.ceil(Math.random()*2+12),Math.ceil(Math.random()*4)]
const UA = `jdapp;iPhone;${jdVersion};${Math.ceil(Math.random()*2+12)}.${Math.ceil(Math.random()*4)};${randomString(40)};network/wifi;model/iPhone12,1;addressid/0;appBuild/167741;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS ${iphoneVersion[0]}_${iphoneVersion[1]} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
const UUID = UA.split(';') && UA.split(';')[4] || ''
function randomString(e) {
  e = e || 32;
  let t = "abcdefhijkmnprstwxyz2345678", a = t.length, n = "";
  for (i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a));
  return n
}

let cookiesArr = [];
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

!(async () => {
  if (!cookiesArr[0]) {
    $.msg('【京东账号一】宠汪汪积分兑换奖品失败', '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
    return
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      $.cookie = cookiesArr[i] + '';
      $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      console.log(`\n*****开始【京东账号${$.index}】${$.UserName}****\n`);
      await run();
    }
  }
})()
.catch((e) => {
  $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
}).finally(() => {
  $.done();
})

async function run() {
  try{
    $.taskList = [];
    await takePostRequest('beanTaskList')
    console.log(`做任务\n`);
    if($.viewAppHome && $.viewAppHome.takenTask == false){
      $.IconDoTaskFlag = 0
      console.log(`做任务:${$.viewAppHome.mainTitle};等待完成`);
      await takePostRequest('beanHomeIconDoTask')
      await $.wait(getRndInteger(2500, 3500))
    }
    if($.viewAppHome && $.viewAppHome.doneTask == false){
      $.IconDoTaskFlag = 1
      console.log(`做任务:${$.viewAppHome.mainTitle}`);
      await takePostRequest('beanHomeIconDoTask')
      await $.wait(getRndInteger(1000, 1500))
    }

    do{
      await task()
      await $.wait(getRndInteger(1000, 1500))
      await takePostRequest('beanTaskList1')
    }while ($.taskFlag)

    await $.wait(getRndInteger(1000, 1500))
  }catch (e) {
    console.log(e);
  }
}

async function task() {
  await $.wait(getRndInteger(1000, 1500))
  //做任务
  $.taskFlag = false
  for (let i = 0; i < $.taskList.length; i++) {
    $.oneTask = $.taskList[i];
    if ($.oneTask.status === 1) {
      $.activityInfoList = $.oneTask.subTaskVOS;
      for (let j = 0; j < $.activityInfoList.length; j++) {
        $.taskFlag = true
        $.oneActivityInfo = $.activityInfoList[j];
        console.log(`做任务:${$.oneActivityInfo.title};等待完成`);
        $.actionType = 0
        if($.oneTask.taskType == 9){
          $.actionType = 1
          await takePostRequest('beanDoTask');
          await $.wait(getRndInteger(4000, 5500))
          $.actionType = 0
        }
        await takePostRequest('beanDoTask');
        await $.wait(getRndInteger(2000, 2500))
      }
    }else if ($.oneTask.status === 2){
      console.log(`任务:${$.oneTask.taskName};已完成`);
    }else{
      console.log(`任务:${$.oneTask.taskName};未能完成\n${JSON.stringify($.oneTask)}`);
    }
  }
}

async function takePostRequest(type) {
  let body = ``;
  let myRequest = ``;
  switch (type) {
    case 'beanTaskList':
    case 'beanTaskList1':
      body = `{"viewChannel":"AppHome"}`;
      myRequest = await getGetRequest(`beanTaskList`, escape(body));
      break;
    case 'beanHomeIconDoTask':
      body = `{"flag":"${$.IconDoTaskFlag}","viewChannel":"AppHome"}`;
      myRequest = await getGetRequest(`beanHomeIconDoTask`, escape(body));
      break;
    case 'beanDoTask':
      body = `{"actionType":${$.actionType},"taskToken":"${$.oneActivityInfo.taskToken}"}`;
      myRequest = await getGetRequest(`beanDoTask`, escape(body));
      break;
    default:
      console.log(`错误${type}`);
  }
  if (myRequest) {
    return new Promise(async resolve => {
      $.get(myRequest, (err, resp, data) => {
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
    case 'beanTaskList':
      if (data.code == 0 && data.data) {
        console.log(`当前等级:${data.data.curLevel || 0} 下一级可领取:${data.data.nextLevelBeanNum || 0}京豆`)
        $.taskList = data.data.taskInfos && data.data.taskInfos || [];
        $.viewAppHome = data.data.viewAppHome && data.data.viewAppHome || {};
      } else if (data.data && data.data.bizMsg) {
        console.log(data.data.bizMsg);
      } else {
        console.log(res);
      }
      break;
    case 'beanTaskList1':
      if (data.code == 0 && data.data) {
        $.taskList = data.data.taskInfos && data.data.taskInfos || [];
      } else if (data.data && data.data.bizMsg) {
        console.log(data.data.bizMsg);
      } else {
        console.log(res);
      }
      break;
    case 'beanDoTask':
    case 'beanHomeIconDoTask':
      if (data.data && (data.data.bizMsg || data.data.remindMsg)) {
        console.log((data.data.bizMsg || data.data.remindMsg));
        if(data.data.growthResult && data.data.growthResult.sceneLevelConfig){
          console.log(`获得:${data.data.growthResult.sceneLevelConfig.beanNum || 0}京豆`)
          if(!data.data.growthResult.sceneLevelConfig.beanNum){
            console.log(JSON.stringify(data.data.growthResult.sceneLevelConfig))
          }
        }
      } else {
        console.log(res);
      }
      break;
    default:
      console.log(`未判断的异常${type}`);
  }
}
async function getGetRequest(type, body) {
  let url = `https://api.m.jd.com/client.action?functionId=${type}&body=${body}&appid=ld&client=apple&clientVersion=${jdVersion}&networkType=wifi&osVersion=${iphoneVersion[0]}.${iphoneVersion[1]}&uuid=${UUID}&openudid=${UUID}`;
  const method = `GET`;
  const headers = {
/*
cron 8 0 * * * jd_ljd.js
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-cn",
    'Cookie': $.cookie,
    "Referer": "https://h5.m.jd.com/",
    "User-Agent": UA,
  };
  return {url: url, method: method, headers: headers};
}
// 随机数
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
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



/*
cron 8 0 * * * jd_ljd.js
