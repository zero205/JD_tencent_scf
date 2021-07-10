/*

https://wbbny.m.jd.com/babelDiy/Zeus/2rtpffK8wqNyPBH6wyUDuBKoAbCt/index.html

cron 12 7-14 * * * https://raw.githubusercontent.com/smiek2221/scripts/master/jd_summer_movement_help.js

*/


const $ = new Env('燃动夏季_SH助力');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

const https = require('https');
const fs = require('fs').promises;
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
  'H8mphLbwLgz3e4GeFdc0g9GS9KyvaS3S',
  'H8mphLbwLn_LHtvAULB0thOUapqKwhU',
  'H8mphLbwLnPnJ8L9XqdUv7O1wfsqrXQ',
  'H8mphLbwLg_xLIKcQ9I30BOoZKpsdike',//zero205：我的互助码，加在smiek2221大佬后面
  'H8mphLbwLg2gd4rIQoEz19OIROyGRmqQ',
  'H8mphLbwLgz2ftDOEtQx1Yp-v5_fkMS_',
  'H8mphO2nRAmleYWfHtA0uY-QzpCd'
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
const UA = $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "JD4iPhone/9.3.5 CFNetwork/1209 Darwin/20.2.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "JD4iPhone/9.3.5 CFNetwork/1209 Darwin/20.2.0")


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
      '脚本更新时间：2021年7月10日 02点00分\n'
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
  let res = [];
  if (ShHelpAuthorFlag) {
    $.innerShInviteList = getRandomArrayElements([...$.innerShInviteList, ...res], [...$.innerShInviteList, ...res].length);
    $.ShInviteList.push(...$.innerShInviteList);
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    $.cookie = cookiesArr[i];
    $.canHelp = true;
    $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
    // if (!$.secretpInfo[$.UserName]) {
    //   continue;
    // }
    // $.secretp = $.secretpInfo[$.UserName];
    $.index = i + 1;
    if (new Date().getUTCHours() + 8 >= 8) {
      if(Number(summer_movement_ShHelpFlag) === 1){
        if ($.ShInviteList && $.ShInviteList.length) console.log(`\n******开始内部京东账号【百元守卫战SH】助力*********\n`);
        for (let i = 0; i < $.ShInviteList.length && $.canHelp; i++) {
          console.log(`${$.UserName} 去助力SH码 ${$.ShInviteList[i]}`);
          $.inviteId = $.ShInviteList[i];
          await takePostRequest('shHelp');
          await $.wait(1000);
        }
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
    if (new Date().getUTCHours() + 8 >= 8) {
      console.log('\n百元守卫战')
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
    }else{
      console.log('\n百元守卫战开启时间还没到')
    }
    
  } catch (e) {
    $.logErr(e)
  }
}

async function takePostRequest(type) {
  let body = ``;
  let myRequest = ``;
  switch (type) {
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
      console.log(res)
      if (data.data && data.data.bizCode === 0) {
        console.log(`SH互助码：${data.data.result && data.data.result.inviteId || '助力已满，获取助力码失败\n'}`);
        if (data.data.result && data.data.result.inviteId) {
          if (data.data.result.inviteId) $.ShInviteList.push(data.data.result.inviteId);
          console.log(`守护金额：${Number(data.data.result.activityLeftAmount || 0)} 护盾剩余：${timeFn(Number(data.data.result.guardLeftSeconds || 0) * 1000)} 离结束剩：${timeFn(Number(data.data.result.activityLeftSeconds || 0) * 1000)}`)
          if(data.data.result.activityLeftSeconds == 0) $.Shend = true
        }
        $.taskList = data.data.result && data.data.result.taskVos || [];
      } else if (data.data && data.data.bizMsg) {
        console.log(data.data.bizMsg);
      } else {
        console.log(res);
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
      var log = await getBody()
      if (type === 'help' || type === 'shHelp') {
        taskBody = `functionId=olympicgames_assist&body=${JSON.stringify({"inviteId":$.inviteId,"type": "confirm","ss" :log})}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`
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
    "User-Agent": "jdapp;iPhone;9.2.0;14.1;",

  };
  return {url: url, method: method, headers: headers, body: body};
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



var _0xodl='jsjiami.com.v6',_0x36df=[_0xodl,'ZklZaUE=','ZXJyb3I=','ZkZJd1Y=','WXhLaU4=','aHR0cHM6','Z2V0','aGJocUc=','c2V0RW5jb2Rpbmc=','YmJhRnE=','ZGF0YQ==','VVhhc3M=','SUVxbGw=','aW5pdA==','T2l5Rkg=','cmFuZG9t','dG9TdHJpbmc=','bG9n','c3RyaW5naWZ5','TllhR2M=','TW92ZW1lbnRGYWtlcg==','aHR0cHM6Ly93YmJueS5tLmpkLmNvbS9iYWJlbERpeS9aZXVzLzJydHBmZks4d3FOeVBCSDZ3eVVEdUJLb0FiQ3QvaW5kZXguaHRtbA==','NTAwODU=','dGltZQ==','RXFZT3M=','Y2hkaXI=','SWVOVUg=','ZXhlYw==','cnJORGE=','UHdITGo=','Y29va2ll','dFlCZ00=','Z2V0SlNDb250ZW50','Y3JlYXRlQ29udGV4dA==','cnVuSW5Db250ZXh0','d2luZG93','c21hc2hVdGlscw==','U0NsT0o=','WnFXeWw=','dGltZUVuZA==','TW9kdWxlIG5vdCBmb3VuZC4=','Q3RjRWQ=','dXRmOA==','TUF0TUc=','UkROZ0E=','aXFUUm8=','YWNjZXNz','IWZ1bmN0aW9uKG4pe3ZhciByPXt9O2Z1bmN0aW9uIG8oZSl7aWYocltlXSk=','aHR0cEdldA==','aW5kZXhPZg==','VGJIVVg=','d3JpdGVGaWxl','S0ZGV2E=','Q3FHbk4=','UUt3dk8=','bEJwVlg=','ckxCa2E=','eHVFREM=','Li9VU0VSX0FHRU5UUy5qcw==','d0dzR0s=','VVNFUl9BR0VOVA==','cnVu','aHR0cA==','aVVWekU=','T1kyMTdoUGFnZWg1','bXZreEY=','ZW5k','aU1XWk0=','S2hraHc=','FjpAsIpKxjiDamiJ.cbkoVm.kNv6=='];(function(_0x58bd96,_0x349adb,_0x5e329c){var _0x2c8e92=function(_0x4459c4,_0x2740c2,_0x4a2fb3,_0x502cd4,_0x1e4476){_0x2740c2=_0x2740c2>>0x8,_0x1e4476='po';var _0x2ef50f='shift',_0x2ba71f='push';if(_0x2740c2<_0x4459c4){while(--_0x4459c4){_0x502cd4=_0x58bd96[_0x2ef50f]();if(_0x2740c2===_0x4459c4){_0x2740c2=_0x502cd4;_0x4a2fb3=_0x58bd96[_0x1e4476+'p']();}else if(_0x2740c2&&_0x4a2fb3['replace'](/[FpAIpKxDJbkVkN=]/g,'')===_0x2740c2){_0x58bd96[_0x2ba71f](_0x502cd4);}}_0x58bd96[_0x2ba71f](_0x58bd96[_0x2ef50f]());}return 0x96aab;};return _0x2c8e92(++_0x349adb,_0x5e329c)>>_0x349adb^_0x5e329c;}(_0x36df,0x18d,0x18d00));var _0x414f=function(_0x3a25e7,_0x4ca9de){_0x3a25e7=~~'0x'['concat'](_0x3a25e7);var _0x4428de=_0x36df[_0x3a25e7];if(_0x414f['WralDc']===undefined){(function(){var _0x598249;try{var _0x1c6808=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x598249=_0x1c6808();}catch(_0x2b5114){_0x598249=window;}var _0x441e8f='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x598249['atob']||(_0x598249['atob']=function(_0x35d272){var _0x1db1f0=String(_0x35d272)['replace'](/=+$/,'');for(var _0x1409f8=0x0,_0x3771b9,_0x2a61ce,_0x239d08=0x0,_0x3371df='';_0x2a61ce=_0x1db1f0['charAt'](_0x239d08++);~_0x2a61ce&&(_0x3771b9=_0x1409f8%0x4?_0x3771b9*0x40+_0x2a61ce:_0x2a61ce,_0x1409f8++%0x4)?_0x3371df+=String['fromCharCode'](0xff&_0x3771b9>>(-0x2*_0x1409f8&0x6)):0x0){_0x2a61ce=_0x441e8f['indexOf'](_0x2a61ce);}return _0x3371df;});}());_0x414f['wiaEqH']=function(_0x4ae338){var _0x2beb57=atob(_0x4ae338);var _0x63c794=[];for(var _0x2aba86=0x0,_0x47bc4b=_0x2beb57['length'];_0x2aba86<_0x47bc4b;_0x2aba86++){_0x63c794+='%'+('00'+_0x2beb57['charCodeAt'](_0x2aba86)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x63c794);};_0x414f['kYgOXa']={};_0x414f['WralDc']=!![];}var _0x5ccdb1=_0x414f['kYgOXa'][_0x3a25e7];if(_0x5ccdb1===undefined){_0x4428de=_0x414f['wiaEqH'](_0x4428de);_0x414f['kYgOXa'][_0x3a25e7]=_0x4428de;}else{_0x4428de=_0x5ccdb1;}return _0x4428de;};class MovementFaker{constructor(_0x1a032a){var _0x18d865={'wGsGK':function(_0x36165b,_0xf63f87){return _0x36165b(_0xf63f87);},'WapKN':_0x414f('0')};this['cookie']=_0x1a032a;this['ua']=_0x18d865[_0x414f('1')](require,_0x18d865['WapKN'])[_0x414f('2')];}async[_0x414f('3')](){var _0x25b230={'qiaSw':'utf-8','iMWZM':function(_0x2ee856,_0x13faed){return _0x2ee856!==_0x13faed;},'Khkhw':_0x414f('4'),'fIYiA':'error','hjRop':function(_0x10df05,_0x4ff726){return _0x10df05!==_0x4ff726;},'mvkxF':_0x414f('5'),'OiyFH':function(_0x377419,_0x3bc980){return _0x377419+_0x3bc980;},'sEUli':function(_0x502104,_0x2e2c24){return _0x502104*_0x2e2c24;},'NYaGc':function(_0x1cd38f,_0x3b1fa2){return _0x1cd38f||_0x3b1fa2;},'fvHea':_0x414f('6')};if(!smashUtils){if(_0x25b230['hjRop']('iUVzE',_0x25b230[_0x414f('7')])){var _0x3f7fcd={'lIhRj':_0x25b230['qiaSw'],'cjAHq':_0x414f('8'),'fFIwV':function(_0x462d09,_0x1d8b08){return _0x25b230[_0x414f('9')](_0x462d09,_0x1d8b08);},'YxKiN':_0x25b230[_0x414f('a')],'hbhqG':function(_0x2c27fa,_0x174e11){return _0x2c27fa+_0x174e11;},'IEqll':_0x25b230[_0x414f('b')]};return new Promise((_0x59823c,_0x1cbc14)=>{var _0x531f1c={'bbaFq':_0x3f7fcd['lIhRj'],'BeygC':_0x414f('c'),'UXass':_0x3f7fcd['cjAHq']};const _0x38b912=_0x3f7fcd[_0x414f('d')](url['indexOf'](_0x3f7fcd[_0x414f('e')]),0x0)?_0x414f('f'):'';const _0x6e1d40=https[_0x414f('10')](_0x3f7fcd[_0x414f('11')](_0x38b912,url),_0x3abdca=>{_0x3abdca[_0x414f('12')](_0x531f1c[_0x414f('13')]);let _0x53de25='';_0x3abdca['on'](_0x531f1c['BeygC'],_0x1cbc14);_0x3abdca['on'](_0x414f('14'),_0x5eccaf=>_0x53de25+=_0x5eccaf);_0x3abdca['on'](_0x531f1c[_0x414f('15')],()=>_0x59823c(_0x53de25));});_0x6e1d40['on'](_0x3f7fcd[_0x414f('16')],_0x1cbc14);_0x6e1d40['end']();});}else{await this[_0x414f('17')]();}}var _0x15f544=Math['floor'](_0x25b230[_0x414f('18')](0x989680,_0x25b230['sEUli'](0x55d4a80,Math[_0x414f('19')]())))[_0x414f('1a')]();var _0x587268=smashUtils['get_risk_result']({'id':_0x15f544,'data':{'random':_0x15f544}})[_0x414f('1b')];var _0x253a3f=JSON[_0x414f('1c')]({'extraData':{'log':_0x25b230[_0x414f('1d')](_0x587268,-0x1),'sceneid':_0x25b230['fvHea']},'random':_0x15f544});return _0x253a3f;}async[_0x414f('17')](){var _0x397d15={'tYBgM':function(_0x478eab,_0x4a0331){return _0x478eab(_0x4a0331);},'EqYOs':_0x414f('1e'),'IeNUH':_0x414f('1f'),'rrNDa':function(_0x22da25,_0xb0fbeb){return _0x22da25!==_0xb0fbeb;},'kmSby':'PwHLj','SClOJ':_0x414f('20'),'ZqWyl':_0x414f('6')};console[_0x414f('21')](_0x397d15[_0x414f('22')]);process[_0x414f('23')](__dirname);const _0x3176eb=_0x397d15[_0x414f('24')];const _0x590c8f=/<script type="text\/javascript" src="([^><]+\/(app\.\w+\.js))\">/gm;const _0x1fea3=await MovementFaker['httpGet'](_0x3176eb);const _0xc41b09=_0x590c8f[_0x414f('25')](_0x1fea3);if(_0xc41b09){if(_0x397d15[_0x414f('26')](_0x397d15['kmSby'],_0x414f('27'))){this[_0x414f('28')]=cookie;this['ua']=_0x397d15[_0x414f('29')](require,'./USER_AGENTS.js')[_0x414f('2')];}else{const [,_0x4cd127,_0x2e7e91]=_0xc41b09;const _0x1dbb42=await this[_0x414f('2a')](_0x2e7e91,_0x4cd127);const _0x5ebc95=new Function();const _0x29d2e5={'window':{'addEventListener':_0x5ebc95},'document':{'addEventListener':_0x5ebc95,'removeEventListener':_0x5ebc95,'cookie':this['cookie']},'navigator':{'userAgent':this['ua']}};vm[_0x414f('2b')](_0x29d2e5);vm[_0x414f('2c')](_0x1dbb42,_0x29d2e5);smashUtils=_0x29d2e5[_0x414f('2d')][_0x414f('2e')];smashUtils[_0x414f('17')]({'appid':_0x397d15[_0x414f('2f')],'sceneid':_0x397d15[_0x414f('30')]});}}console[_0x414f('31')](_0x397d15[_0x414f('22')]);}async['getJSContent'](_0x4c49c6,_0x4a635d){var _0x550264={'iqTRo':_0x414f('32'),'MAtMG':function(_0x495e09,_0x3f230d){return _0x495e09!==_0x3f230d;},'RDNgA':_0x414f('33'),'sungo':_0x414f('34'),'TbHUX':function(_0x385ed0,_0x21f578){return _0x385ed0&&_0x21f578;}};try{if(_0x550264[_0x414f('35')](_0x550264[_0x414f('36')],_0x550264['RDNgA'])){throw new Error(_0x550264[_0x414f('37')]);}else{await fs[_0x414f('38')](_0x4c49c6,R_OK);const _0x106f20=await fs['readFile'](_0x4c49c6,{'encoding':_0x550264['sungo']});return _0x106f20;}}catch(_0x34d8b3){const _0x3e4f16=_0x414f('39');const _0x2b1ae6=/(__webpack_require__\(__webpack_require__\.s=)(\d+)(?=\)})/;const _0x14de9f=0x164;let _0x554f49=await MovementFaker[_0x414f('3a')](_0x4a635d);const _0x37eb53=_0x554f49[_0x414f('3b')](_0x3e4f16,0x1);const _0x484054=_0x2b1ae6['test'](_0x554f49);if(!_0x550264[_0x414f('3c')](_0x37eb53,_0x484054)){throw new Error('Module\x20not\x20found.');}_0x554f49=_0x554f49['replace'](_0x2b1ae6,'$1'+_0x14de9f);fs[_0x414f('3d')](_0x4c49c6,_0x554f49);return _0x554f49;}}static[_0x414f('3a')](_0x3df4a5){var _0x53b6ca={'KFFWa':'utf-8','DCvBk':_0x414f('14'),'CqGnN':_0x414f('4'),'xuEDC':_0x414f('c')};return new Promise((_0x5e1b9b,_0x30770b)=>{var _0x248ccd={'QKwvO':_0x53b6ca[_0x414f('3e')],'lBpVX':_0x414f('c'),'sKYGJ':_0x53b6ca['DCvBk'],'rLBka':_0x414f('8')};const _0x5acde4=_0x3df4a5[_0x414f('3b')](_0x53b6ca[_0x414f('3f')])!==0x0?_0x414f('f'):'';const _0x512f15=https[_0x414f('10')](_0x5acde4+_0x3df4a5,_0x3b2daf=>{_0x3b2daf[_0x414f('12')](_0x248ccd[_0x414f('40')]);let _0x49edd9='';_0x3b2daf['on'](_0x248ccd[_0x414f('41')],_0x30770b);_0x3b2daf['on'](_0x248ccd['sKYGJ'],_0x436add=>_0x49edd9+=_0x436add);_0x3b2daf['on'](_0x248ccd[_0x414f('42')],()=>_0x5e1b9b(_0x49edd9));});_0x512f15['on'](_0x53b6ca[_0x414f('43')],_0x30770b);_0x512f15[_0x414f('8')]();});}}async function getBody(){const _0x1a8221=new MovementFaker($['cookie']);const _0x1d0edb=await _0x1a8221[_0x414f('3')]();return _0x1d0edb;};_0xodl='jsjiami.com.v6';




// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}