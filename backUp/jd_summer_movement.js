/*

https://wbbny.m.jd.com/babelDiy/Zeus/2rtpffK8wqNyPBH6wyUDuBKoAbCt/index.html

cron 12 0,6-23/2 * * * https://raw.githubusercontent.com/smiek2221/scripts/master/jd_summer_movement.js

*/


const $ = new Env('燃动夏季');
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

$.joyytoken = "";
let joyytoken_count = 1
let summer_movement_joinjoinjoinhui = false;//是否入会  true 入会，false 不入会
if ($.isNode() && process.env.summer_movement_joinjoinjoinhui) {
  summer_movement_joinjoinjoinhui = process.env.summer_movement_joinjoinjoinhui;
}

// 百元守卫战SH
let summer_movement_ShHelpFlag = 1;// 0不开启也不助力 1开启并助力 2开启但不助力
if ($.isNode() && process.env.summer_movement_ShHelpFlag) {
  summer_movement_ShHelpFlag = process.env.summer_movement_ShHelpFlag;
}

// 邀请助力
let summer_movement_HelpHelpHelpFlag = false;// 是否只执行邀请助力  true 是，false 不是
if ($.isNode() && process.env.summer_movement_HelpHelpHelpFlag) {
  summer_movement_HelpHelpHelpFlag = process.env.summer_movement_HelpHelpHelpFlag;
}


const ShHelpAuthorFlag = true;//是否助力作者SH  true 助力，false 不助力
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [];
$.cookie = '';
$.inviteList = [];
$.secretpInfo = {};
$.ShInviteList = [];
$.innerShInviteList = [
  'H8mphLbwLgz3e4GeFdc0g9GS9KyvaS3S',
  'H8mphLbwLn_LHtvAULB0thOUapqKwhU',
  'H8mphLbwLnPnJ8L9XqdUv7O1wfsqrXQ'
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
let UA = `jdapp;android;10.0.2;9;${randomString(28)}-73D2164353034363465693662666;network/wifi;model/MI 8;addressid/138087843;aid/0a4fc8ec9548a7f9;oaid/3ac46dd4d42fa41c;osVer/28;appBuild/88569;partner/jingdong;eufv/1;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 9; MI 8 Build/PKQ1.180729.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045715 Mobile Safari/537.36;`
let UUID = UA.split(';') && UA.split(';')[4] || ''
function randomString(e) {
  e = e || 32;
  let t = "1234567890",
    a = t.length,
    n = "";
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
    '邀请好友助力：内部账号自行互助(排名靠前账号得到的机会多)\n' +
    'SH互助：内部账号自行互助(排名靠前账号得到的机会多),多余的助力次数会默认助力作者内置助力码\n' +
    '店铺任务 已添加\n' +
    '新增 入会环境变量 默认不入会\n' +
    '新增 微信任务\n' +
    '新增活动火爆不做任务处理\n' +
    '活动时间：2021-07-08至2021-08-08\n' +
    '脚本更新时间：2021年7月13日 18点00分\n'
  );
  if (`${summer_movement_joinjoinjoinhui}` === "true") console.log('您设置了入会\n')
  if (`${summer_movement_HelpHelpHelpFlag}` === "true") console.log('您设置了只执行邀请助力\n')
  if (Number(summer_movement_ShHelpFlag) === 1) {
    console.log('您设置了 【百元守卫战SH】✅ || 互助✅')
  } else if (Number(summer_movement_ShHelpFlag) === 2) {
    console.log('您设置了 【百元守卫战SH】✅ || 互助❌')
  } else if (Number(summer_movement_ShHelpFlag) === 0) {
    console.log('您设置了 【百元守卫战SH】❌ || 互助❌')
  } else {
    console.log('原 summer_movement_ShHelpFlag 变量不兼容请修改 0不开启也不助力 1开启并助力 2开启但不助力')
  }

  console.log('\n\n该脚本启用了[正道的光]模式\n执行 做任务、做店铺任务 会有几率不执行\n本脚本不让任务一次全部做完\n您可以多跑几次\n北京时间18时后是正常模式\n\n🐸\n')

      
  console.log(`注意：若执行失败，则请手动删除脚本目录下的“app.*.js”文件，然后重新执行脚本`);
  console.log(`类似 app.5c2472d1.js、app.c7364f20.js 等都删除\n不用每次删 执行失败再删`);
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      $.cookie = cookiesArr[i];
      $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = $.UserName;
      $.hotFlag = false; //是否火爆
      UA = `jdapp;android;10.0.2;9;${randomString(28)}-73D2164353034363465693662666;network/wifi;model/MI 8;addressid/138087843;aid/0a4fc8ec9548a7f9;oaid/3ac46dd4d42fa41c;osVer/28;appBuild/88569;partner/jingdong;eufv/1;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 9; MI 8 Build/PKQ1.180729.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045715 Mobile Safari/537.36;`
      UUID = UA.split(';') && UA.split(';')[4] || ''
      $.joyytoken = ''
      joyytoken_count = 1
      console.log(`\n*****开始【京东账号${$.index}】${$.nickName || $.UserName}*****\n`);
      console.log(`\n如有未完成的任务，请多执行几次\n`);
      await movement()
      if($.hotFlag)$.secretpInfo[$.UserName] = false;//火爆账号不执行助力
    }
  }
  // 助力
  for (let i = 0; i < cookiesArr.length; i++) {
    $.cookie = cookiesArr[i];
    $.canHelp = true;
    $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
    if (!$.secretpInfo[$.UserName]) {
      continue;
    }
    // $.secretp = $.secretpInfo[$.UserName];
    $.index = i + 1;
    if ($.inviteList && $.inviteList.length) console.log(`\n******开始内部京东账号【邀请好友助力】*********\n`);
    for (let j = 0; j < $.inviteList.length && $.canHelp; j++) {
      $.oneInviteInfo = $.inviteList[j];
      if ($.oneInviteInfo.ues === $.UserName || $.oneInviteInfo.max) {
        continue;
      }
      $.inviteId = $.oneInviteInfo.inviteId;
      console.log(`${$.UserName}去助力${$.oneInviteInfo.ues},助力码${$.inviteId}`);
      await takePostRequest('help');
      await $.wait(2000);
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
    await takePostRequest('olympicgames_home');
    if($.homeData.result) $.userInfo = $.homeData.result.userActBaseInfo
    if($.userInfo){
      if($.homeData.result.popWindows) {
        let res = $.homeData.result.popWindows
        if(res.type == 'continued_sign_pop'){
          console.log(`签到获得: ${JSON.stringify($.homeData.result.popWindows.data || '')}`)
        }else if(res.type == 'limited_time_hundred_pop'){
          console.log(`百元守卫战: ${JSON.stringify($.homeData.result.popWindows || '')}`)
        }else{
          console.log(`弹窗信息: ${JSON.stringify($.homeData.result.popWindows)}`)
        }
      }
      // console.log(JSON.stringify($.homeData.result.trainingInfo))
      console.log(`\n签到${$.homeData.result.continuedSignDays}天 待兑换金额：${Number($.userInfo.poolMoney)} 当前等级:${$.userInfo.medalLevel}  ${$.userInfo.poolCurrency}/${$.userInfo.exchangeThreshold}(攒卡领${Number($.userInfo.cash)}元)\n`);
      await $.wait(1000);
      if($.userInfo && typeof $.userInfo.sex == 'undefined'){
        await takePostRequest('olympicgames_tiroGuide');
        await $.wait(1000);
      }
      $.userInfo = $.homeData.result.userActBaseInfo;
      if (Number($.userInfo.poolCurrency) >= Number($.userInfo.exchangeThreshold)) {
        console.log(`满足升级条件，去升级`);
        await takePostRequest('olympicgames_receiveCash');
        await $.wait(1000);
      }
      bubbleInfos = $.homeData.result.bubbleInfos;
      for(let item of bubbleInfos){
        if(item.type != 7){
          $.collectId = item.type
          await takePostRequest('olympicgames_collectCurrency');
          await $.wait(1000);
        }
      }
      if($.homeData.result.pawnshopInfo && $.homeData.result.pawnshopInfo.betGoodsList){
        $.Reward = []
        for(let i in $.homeData.result.pawnshopInfo.betGoodsList){
          $.Reward = $.homeData.result.pawnshopInfo.betGoodsList[i]
          if($.Reward.status == 1){
            console.log(`开奖：${$.Reward.skuName}`)
            await takePostRequest('olympicgames_pawnshopRewardPop');
          }
        }
      }
    }

    console.log('\n运动\n')
    $.speedTraining = true;
    if(!$.hotFlag){
      await takePostRequest('olympicgames_startTraining');
      await $.wait(1000);
      for(let i=0;i<=3;i++){
        if($.speedTraining){
          await takePostRequest('olympicgames_speedTraining');
          await $.wait(1000);
        }else{
          break;
        }
      }
    }
    
    console.log(`\n做任务\n`);
    if(!$.hotFlag) await takePostRequest('olympicgames_getTaskDetail');
    if(`${summer_movement_HelpHelpHelpFlag}` === "true") return
    await $.wait(1000);
    //做任务
    for (let i = 0; i < $.taskList.length && !$.hotFlag; i++) {
      $.oneTask = $.taskList[i];
      if(!aabbiill()) continue;
      if ([1, 3, 5, 7, 9, 21, 26].includes($.oneTask.taskType) && $.oneTask.status === 1) {
        $.activityInfoList = $.oneTask.shoppingActivityVos || $.oneTask.brandMemberVos || $.oneTask.followShopVo || $.oneTask.browseShopVo;
        for (let j = 0; j < $.activityInfoList.length; j++) {
          $.oneActivityInfo = $.activityInfoList[j];
          if ($.oneActivityInfo.status !== 1 || !$.oneActivityInfo.taskToken) {
            continue;
          }
          $.callbackInfo = {};
          console.log(`做任务：${$.oneActivityInfo.title || $.oneActivityInfo.taskName || $.oneActivityInfo.shopName};等待完成`);
          if ($.oneTask.taskType === 21 && `${summer_movement_joinjoinjoinhui}` === "true"){
            let channel = $.oneActivityInfo.memberUrl.match(/channel=(\d+)/) ? $.oneActivityInfo.memberUrl.match(/channel=(\d+)/)[1] : '';
            const jiarubody = {
              venderId: $.oneActivityInfo.vendorIds,
              shopId: $.oneActivityInfo.ext.shopId,
              bindByVerifyCodeFlag: 1,
              registerExtend: {},
              writeChildFlag: 0,
              channel: channel
            }
            let url = `https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=bindWithVender&body=${encodeURIComponent(JSON.stringify(jiarubody))}&client=H5&clientVersion=9.2.0&uuid=88888`
            await joinjoinjoinhui(url,$.oneActivityInfo.memberUrl)
            await $.wait(2000);
          }
          await takePostRequest('olympicgames_doTaskDetail');
          if ($.callbackInfo.code === 0 && $.callbackInfo.data && $.callbackInfo.data.result && $.callbackInfo.data.result.taskToken) {
            await $.wait(getRndInteger(7000, 8000));
            let sendInfo = encodeURIComponent(`{"dataSource":"newshortAward","method":"getTaskAward","reqParams":"{\\"taskToken\\":\\"${$.callbackInfo.data.result.taskToken}\\"}","sdkVersion":"1.0.0","clientLanguage":"zh"}`)
            await callbackResult(sendInfo)
          } else if ($.oneTask.taskType === 5 || $.oneTask.taskType === 3 || $.oneTask.taskType === 26) {
            await $.wait(getRndInteger(1000, 2000));
            console.log(`任务完成`);
          } else if ($.oneTask.taskType === 21) {
            let data = $.callbackInfo
            if(data.data && data.data.bizCode === 0){
              console.log(`获得：${data.data.result.score}`);
            }else if(data.data && data.data.bizMsg){
              console.log(data.data.bizMsg);
            }else{
            console.log(JSON.stringify($.callbackInfo));
            }
            await $.wait(getRndInteger(1000, 2000));
          } else {
            console.log($.callbackInfo);
            console.log(`任务失败`);
            await $.wait(getRndInteger(2000, 3000));
          }
          if($.hotFlag) break
        }
      } else if ($.oneTask.taskType === 2 && $.oneTask.status === 1 && $.oneTask.scoreRuleVos[0].scoreRuleType === 2){
        console.log(`做任务：${$.oneTask.taskName};等待完成 (实际不会添加到购物车)`);
        $.taskId = $.oneTask.taskId;
        $.feedDetailInfo = {};
        await takePostRequest('olympicgames_getFeedDetail');
        let productList = $.feedDetailInfo.productInfoVos;
        let needTime = Number($.feedDetailInfo.maxTimes) - Number($.feedDetailInfo.times);
        for (let j = 0; j < productList.length && needTime > 0; j++) {
          if(productList[j].status !== 1){
            continue;
          }
          $.taskToken = productList[j].taskToken;
          console.log(`加购：${productList[j].skuName}`);
          await takePostRequest('add_car');
          await $.wait(getRndInteger(1000, 2000));
          needTime --;
          if($.hotFlag) break
        }
      }else if ($.oneTask.taskType === 2 && $.oneTask.status === 1 && $.oneTask.scoreRuleVos[0].scoreRuleType === 0){
        $.activityInfoList = $.oneTask.productInfoVos ;
        for (let j = 0; j < $.activityInfoList.length; j++) {
          $.oneActivityInfo = $.activityInfoList[j];
          if ($.oneActivityInfo.status !== 1 || !$.oneActivityInfo.taskToken) {
            continue;
          }
          $.callbackInfo = {};
          console.log(`做任务：浏览${$.oneActivityInfo.skuName};等待完成`);
          await takePostRequest('olympicgames_doTaskDetail');
          if ($.oneTask.taskType === 2) {
            await $.wait(getRndInteger(1000, 2000));
            console.log(`任务完成`);
          } else {
            console.log($.callbackInfo);
            console.log(`任务失败`);
            await $.wait(getRndInteger(2000, 3000));
          }
          if($.hotFlag) break
        }
      }
      if($.hotFlag) break
    }
    
    //==================================微信任务========================================================================
    $.wxTaskList = [];
    if(!$.hotFlag) await takePostRequest('wxTaskDetail');
    for (let i = 0; i < $.wxTaskList.length; i++) {
      $.oneTask = $.wxTaskList[i];
      if($.oneTask.taskType === 2 || $.oneTask.status !== 1){continue;} //不做加购
      $.activityInfoList = $.oneTask.shoppingActivityVos || $.oneTask.brandMemberVos || $.oneTask.followShopVo || $.oneTask.browseShopVo;
      for (let j = 0; j < $.activityInfoList.length; j++) {
        $.oneActivityInfo = $.activityInfoList[j];
        if ($.oneActivityInfo.status !== 1 || !$.oneActivityInfo.taskToken) {
          continue;
        }
        $.callbackInfo = {};
        console.log(`做任务：${$.oneActivityInfo.title || $.oneActivityInfo.taskName || $.oneActivityInfo.shopName};等待完成`);
        await takePostRequest('olympicgames_doTaskDetail');
        if ($.callbackInfo.code === 0 && $.callbackInfo.data && $.callbackInfo.data.result && $.callbackInfo.data.result.taskToken) {
          await $.wait(getRndInteger(7000, 9000));
          let sendInfo = encodeURIComponent(`{"dataSource":"newshortAward","method":"getTaskAward","reqParams":"{\\"taskToken\\":\\"${$.callbackInfo.data.result.taskToken}\\"}","sdkVersion":"1.0.0","clientLanguage":"zh"}`)
          await callbackResult(sendInfo)
        } else  {
          await $.wait(getRndInteger(1000, 2000));
          console.log(`任务完成`);
        }
        if($.hotFlag) break
      }
      if($.hotFlag) break
    }

    // 店铺
    console.log(`\n去做店铺任务\n`);
    $.shopInfoList = [];
    if(!$.hotFlag) await takePostRequest('qryCompositeMaterials');
    for (let i = 0; i < $.shopInfoList.length; i++) {
      let taskbool = false
      if(!aabbiill()) continue;
      $.shopSign = $.shopInfoList[i].extension.shopId;
      console.log(`执行第${i+1}个店铺任务：${$.shopInfoList[i].name} ID:${$.shopSign}`);
      $.shopResult = {};
      await takePostRequest('olympicgames_shopLotteryInfo');
      await $.wait(getRndInteger(1000, 2000));
      if(JSON.stringify($.shopResult) === `{}`) continue;
      $.shopTask = $.shopResult.taskVos || [];
      for (let i = 0; i < $.shopTask.length; i++) {
        $.oneTask = $.shopTask[i];
        if($.oneTask.taskType === 21 || $.oneTask.taskType === 14 || $.oneTask.status !== 1){continue;}  //不做入会//不做邀请
        taskbool = true
        $.activityInfoList = $.oneTask.brandMemberVos || $.oneTask.followShopVo || $.oneTask.shoppingActivityVos || $.oneTask.browseShopVo || $.oneTask.simpleRecordInfoVo;
        if($.oneTask.taskType === 12){//签到
          $.oneActivityInfo =  $.activityInfoList;
          console.log(`店铺签到`);
          await takePostRequest('olympicgames_bdDoTask');
          continue;
        }
        for (let j = 0; j < $.activityInfoList.length; j++) {
          $.oneActivityInfo = $.activityInfoList[j];
          if ($.oneActivityInfo.status !== 1 || !$.oneActivityInfo.taskToken) {
            continue;
          }
          $.callbackInfo = {};
          console.log(`做任务：${$.oneActivityInfo.subtitle || $.oneActivityInfo.title || $.oneActivityInfo.taskName || $.oneActivityInfo.shopName};等待完成`);
          await takePostRequest('olympicgames_doTaskDetail');
          if ($.callbackInfo.code === 0 && $.callbackInfo.data && $.callbackInfo.data.result && $.callbackInfo.data.result.taskToken) {
            await $.wait(getRndInteger(7000, 9000));
            let sendInfo = encodeURIComponent(`{"dataSource":"newshortAward","method":"getTaskAward","reqParams":"{\\"taskToken\\":\\"${$.callbackInfo.data.result.taskToken}\\"}","sdkVersion":"1.0.0","clientLanguage":"zh"}`)
            await callbackResult(sendInfo)
          } else  {
            await $.wait(getRndInteger(2000, 3000));
            console.log(`任务完成`);
          }
          if($.hotFlag) break
        }
        if($.hotFlag) break
      }
      if(taskbool) await $.wait(1000);
      let boxLotteryNum = $.shopResult.boxLotteryNum;
      for (let j = 0; j < boxLotteryNum; j++) {
        console.log(`开始第${j+1}次拆盒`)
        //抽奖
        await takePostRequest('olympicgames_boxShopLottery');
        await $.wait(3000);
        if($.hotFlag) break
      }
      // let wishLotteryNum = $.shopResult.wishLotteryNum;
      // for (let j = 0; j < wishLotteryNum; j++) {
      //   console.log(`开始第${j+1}次能量抽奖`)
      //   //抽奖
      //   await takePostRequest('zoo_wishShopLottery');
      //   await $.wait(3000);
      // }
      if(taskbool) await $.wait(3000);
      if($.hotFlag) break
    }
    $.wait(2000);

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
    case 'olympicgames_getTaskDetail':
      body = `functionId=${type}&body={"taskId":"","appSign":"1"}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
      myRequest = await getPostRequest(`olympicgames_getTaskDetail`, body);
      break;
    case 'olympicgames_doTaskDetail':
      body = await getPostBody(type);
      myRequest = await getPostRequest(`olympicgames_doTaskDetail`, body);
      break;
    case 'olympicgames_getFeedDetail':
      body = `functionId=olympicgames_getFeedDetail&body={"taskId":"${$.taskId}"}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
      myRequest = await getPostRequest(`olympicgames_getFeedDetail`, body);
      break;
    case 'add_car':
      body = await getPostBody(type);
      myRequest = await getPostRequest(`olympicgames_doTaskDetail`, body);
      break;
    case 'shHelp':
    case 'help':
      body = await getPostBody(type);
      myRequest = await getPostRequest(`zoo_collectScore`, body);
      break;
    case 'olympicgames_startTraining':
      body = await getPostBody(type);
      myRequest = await getPostRequest(`olympicgames_startTraining`, body);
      break;
    case 'olympicgames_speedTraining':
      body = await getPostBody(type);
      myRequest = await getPostRequest(`olympicgames_speedTraining`, body);
      break;
    case 'olympicgames_tiroGuide':
      let sex = getRndInteger(0, 2)
      let sportsGoal = getRndInteger(1, 4)
      body = `functionId=olympicgames_tiroGuide&body={"sex":${sex},"sportsGoal":${sportsGoal}}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
      myRequest = await getPostRequest(`olympicgames_tiroGuide`, body);
      break;
    case 'olympicgames_shopLotteryInfo':
      body = `functionId=olympicgames_shopLotteryInfo&body={"channelSign":"1","shopSign":${$.shopSign}}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
      myRequest = await getPostRequest(`olympicgames_shopLotteryInfo`, body);
      break;
    case 'qryCompositeMaterials':
      body = `functionId=qryCompositeMaterials&body={"qryParam":"[{\\"type\\":\\"advertGroup\\",\\"id\\":\\"05371960\\",\\"mapTo\\":\\"logoData\\"}]","openid":-1,"applyKey":"big_promotion"}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`qryCompositeMaterials`, body);
      break;
    case 'olympicgames_bdDoTask':
      body = await getPostBody(type);
      myRequest = await getPostRequest(`olympicgames_bdDoTask`, body);
      break;
    case 'olympicgames_boxShopLottery':
      body = `functionId=olympicgames_boxShopLottery&body={"shopSign":${$.shopSign}}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
      myRequest = await getPostRequest(`olympicgames_boxShopLottery`,body);
      break;
    case 'wxTaskDetail':
      body = `functionId=olympicgames_getTaskDetail&body={"taskId":"","appSign":"2"}&client=wh5&clientVersion=1.0.0&loginWQBiz=businesst1&appid=${$.appid}`;
      myRequest = await getPostRequest(`olympicgames_getTaskDetail`,body);
      break;
    case 'olympicgames_pawnshopRewardPop':
      body = `functionId=olympicgames_pawnshopRewardPop&body={"skuId":${$.Reward.skuId}}&client=wh5&clientVersion=1.0.0&appid=${$.appid}`;
      myRequest = await getPostRequest(`olympicgames_pawnshopRewardPop`,body);
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
    case 'olympicgames_getTaskDetail':
      if (data.data && data.data.bizCode === 0) {
        console.log(`互助码：${data.data.result && data.data.result.inviteId || '助力已满，获取助力码失败'}\n`);
        if (data.data.result && data.data.result.inviteId) {
          $.inviteList.push({
            'ues': $.UserName,
            // 'secretp': $.secretp,
            'inviteId': data.data.result.inviteId,
            'max': false
          });
        }
        $.taskList = data.data.result && data.data.result.taskVos || [];
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
          if (data.data.result.inviteId) $.ShInviteList.push(data.data.result.inviteId);
          console.log(`守护金额：${Number(data.data.result.activityLeftAmount || 0)} 护盾剩余：${timeFn(Number(data.data.result.guardLeftSeconds || 0) * 1000)} 离结束剩：${timeFn(Number(data.data.result.activityLeftSeconds || 0) * 1000)}`)
          if(data.data.result.activityLeftSeconds == 0) $.Shend = true
        }
        $.taskList = data.data.result && data.data.result.taskVos || [];
      } else if (data.data && data.data.bizMsg) {
        if(data.data.bizMsg.indexOf('活动太火爆') > -1){
          $.hotFlag = true;
        }
        console.log(data.data.bizMsg);
      } else {
        console.log(res);
      }
      break;
    case 'olympicgames_doTaskDetail':
      if (data.data && data.data.bizCode === 0) {
        if (data.data.result && data.data.result.taskToken) {
          $.callbackInfo = data;
        }else if(data.data.result && data.data.result.successToast){
          console.log(data.data.result.successToast);
        }
      } else if (data.data && data.data.bizMsg) {
        if(data.data.bizMsg.indexOf('活动太火爆') > -1){
          $.hotFlag = true;
        }
        console.log(data.data.bizMsg);
      } else {
        console.log(res);
      }
      break;
    case 'olympicgames_getFeedDetail':
      if (data.code === 0) {
        $.feedDetailInfo = data.data.result.addProductVos[0] || [];
      }else if(data.data && data.data.bizMsg){
        console.log(data.data.bizMsg);
        if(data.data.bizMsg.indexOf('活动太火爆') > -1){
          $.hotFlag = true;
        }
      }
      break;
    case 'add_car':
      if (data.code === 0) {
        if (data.data && data.data.bizCode === 0 && data.data.result && data.data.result.acquiredScore) {
          let acquiredScore = data.data.result.acquiredScore;
          if (Number(acquiredScore) > 0) {
            console.log(`加购成功,获得金币:${acquiredScore}`);
          } else {
            console.log(`加购成功`);
          }
        } else if (data.data && data.data.bizMsg) {
          console.log(data.data.bizMsg);
        } else {
          console.log(res);
        }
      }
      break
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
    case 'olympicgames_speedTraining':
      if (data.data && data.data.bizCode === 0 && data.data.result) {
        let res = data.data.result
        console.log(`获得[${res.couponName}]优惠券：${res.usageThreshold} 优惠：${res.quota} 时间：${res.useTimeRange}`);
      } else if (data.data && data.data.bizMsg) {
        if (data.data.bizMsg.indexOf('不在运动中') > -1) {
          $.speedTraining = false;
        }else if(data.data.bizMsg.indexOf('活动太火爆') > -1){
          $.hotFlag = true;
        }
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
        }else if(data.data.bizMsg.indexOf('活动太火爆') > -1){
          $.hotFlag = true;
        }
        console.log(data.data.bizMsg);
      } else {
        console.log(res);
      }
      break;
    case 'olympicgames_tiroGuide':
      console.log(res);
      break;
    case 'olympicgames_shopLotteryInfo':
      if (data.code === 0) {
        $.shopResult = data.data.result;
      }else if(data.data && data.data.bizMsg){
        console.log(data.data.bizMsg);
        if(data.data.bizMsg.indexOf('活动太火爆') > -1){
          $.hotFlag = true;
        }
      }
      break;
    case 'qryCompositeMaterials':
      //console.log(data);
      if (data.code === '0') {
        $.shopInfoList = data.data.logoData.list;
        console.log(`获取到${$.shopInfoList.length}个店铺`);
      }
      break
    case 'olympicgames_bdDoTask':
      if(data.data && data.data.bizCode === 0){
        console.log(`签到获得：${data.data.result.score}`);
      }else if(data.data && data.data.bizMsg){
        console.log(data.data.bizMsg);
        if(data.data.bizMsg.indexOf('活动太火爆') > -1){
          $.hotFlag = true;
        }
      }else{
        console.log(data);
      }
      break;
    case 'olympicgames_boxShopLottery':
      if(data.data && data.data.result){
        let result = data.data.result;
        switch (result.awardType) {
          case 8:
            console.log(`获得金币：${result.rewardScore}`);
            break;
          case 5:
            console.log(`获得：adidas能量`);
            break;
          case 2:
          case 3:
            console.log(`获得优惠券：${result.couponInfo.usageThreshold} 优惠：${result.couponInfo.quota}，${result.couponInfo.useRange}`);
            break;
          default:
            console.log(`抽奖获得未知`);
            console.log(JSON.stringify(data));
        }
      } else if (data.data && data.data.bizMsg) {
        console.log(data.data.bizMsg);
        if(data.data.bizMsg.indexOf('活动太火爆') > -1){
          $.hotFlag = true;
        }
      } else {
        console.log(res);
      }
      break
    case 'wxTaskDetail':
      if (data.code === 0) {
        $.wxTaskList = data.data.result && data.data.result.taskVos || [];
      }
      break;
    case 'olympicgames_pawnshopRewardPop':
      if (data.data && data.data.bizCode === 0 && data.data.result) {
        console.log(res)
        console.log(`结果：${data.data.result.currencyReward && '额外奖励' + data.data.result.currencyReward + '卡币' || ''}`)
      } else if (data.data && data.data.bizMsg) {
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
      var random = Math.floor(1e+6 * Math.random()).toString().padEnd(8, '8');
      //random = "21350544";
      var senddata = {
        data: {
          random
        }
      };
      var retn = await smashUtils.get_risk_result(senddata, "50085", UA);
      var log = JSON.stringify({
        extraData: {
          log: retn.log,
          sceneid: "OY217hPageh5"
        },
        random
      });
      var uuid = `&uuid=${UUID}`;
      if (type === 'help' || type === 'shHelp') {
        taskBody = `functionId=olympicgames_assist&body=${JSON.stringify({"inviteId":$.inviteId,"type": "confirm","ss" :log})}&client=wh5&clientVersion=1.0.0${uuid}&appid=${$.appid}`
      } else if (type === 'olympicgames_collectCurrency') {
        taskBody = `functionId=olympicgames_collectCurrency&body=${JSON.stringify({"type":$.collectId,"ss" : log})}&client=wh5&clientVersion=1.0.0${uuid}&appid=${$.appid}`;
      } else if (type === 'olympicgames_startTraining' || type === 'olympicgames_speedTraining') {
        taskBody = `functionId=${type}&body=${JSON.stringify({"ss" : log})}&client=wh5&clientVersion=1.0.0${uuid}&appid=${$.appid}`;
      } else if(type === 'add_car'){
        taskBody = `functionId=olympicgames_doTaskDetail&body=${JSON.stringify({"taskId": $.taskId,"taskToken":$.taskToken,"ss" : log})}&client=wh5&clientVersion=1.0.0${uuid}&appid=${$.appid}`
      }else{
        let actionType = 0
        if([1, 3, 5, 6, 8, 9, 14, 22, 23, 24, 25, 26].includes($.oneTask.taskId)) actionType = 1
        taskBody = `functionId=${type}&body=${JSON.stringify({"taskId": $.oneTask.taskId,"taskToken" : $.oneActivityInfo.taskToken,"ss" : log,"shopSign":$.shopSign,"actionType":actionType,"showErrorToast":false})}&client=wh5&clientVersion=1.0.0${uuid}&appid=${$.appid}`
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
    "x-requested-with": "com.jingdong.app.mall",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    'Cookie': $.cookie + $.joyytoken,
    "Origin": "https://wbbny.m.jd.com",
    "Referer": "https://wbbny.m.jd.com/",
    "User-Agent": UA,

  };
  return {url: url, method: method, headers: headers, body: body};
}


//领取奖励
function callbackResult(info) {
  return new Promise((resolve) => {
    let url = {
      url: `https://api.m.jd.com/?functionId=qryViewkitCallbackResult&client=wh5&clientVersion=1.0.0&body=${info}&_timestamp=` + Date.now(),
      headers: {
        'Origin': `https://bunearth.m.jd.com`,
        'Cookie': $.cookie,
        'Connection': `keep-alive`,
        'Accept': `*/*`,
        'Host': `api.m.jd.com`,
        'User-Agent': UA,
        'Accept-Encoding': `gzip, deflate, br`,
        'Accept-Language': `zh-cn`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://bunearth.m.jd.com'
      }
    }

    $.get(url, async (err, resp, data) => {
      try {
        data = JSON.parse(data);
        console.log(data.toast.subTitle)
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    })
  })
}

// 入会
function joinjoinjoinhui(url,Referer) {
  return new Promise(resolve => {
    let taskjiaruUrl = {
      url: url,
      headers: {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        // "Content-Type": "application/x-www-form-urlencoded",
        "Host": "api.m.jd.com",
        "Referer": Referer,
        "Cookie": $.cookie + $.joyytoken,
        "User-Agent": UA,
      }
    }
    $.get(taskjiaruUrl, async(err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} 入会 API请求失败，请检查网路重试`)
        } else {
          console.log(data)
          if(data){
            data = JSON.parse(data)
            console.log(data.message || JSON.stringify(data))
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

// 正道的光
function aabbiill(){
  let ccdd = 0
  if(new Date().getUTCHours() + 8 >= 18 && new Date().getUTCHours() + 8 < 24){
    ccdd = 1
  }else{
    ccdd = getRndInteger(0,3)
  }
  return ccdd == 1
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


var _0xoda='jsjiami.com.v6',_0x4219=[_0xoda,'WXhqY1M=','THV2YUo=','dnprSEs=','Y2xGVkQ=','Z0FrQm4=','WmpwbVI=','SlVHSFQ=','TWVSSXk=','MDAwMDAwMA==','U2pEY3E=','Zm9vWGo=','UHVjRk8=','SGpWWEE=','ckNaV3U=','UW5PRVk=','bHhUclI=','b3p6Vlc=','Q2pha0M=','dENsSks=','ZEdnQnc=','amNqTlA=','elpGd2E=','TXRjdWg=','ek5idUM=','c3RyaW5naWZ5','aG1HcW4=','Q3JjMzI=','YWRkWmVyb1RvU2V2ZW4=','ZWxpTUc=','c0tjR2k=','dGpUZ0I=','QklBelM=','M3wxfDB8Mnw0fDU=','bnVtYmVy','a0l5Z0k=','a0lwdFM=','bWFw','S3JZUno=','YnR0Vko=','R1N4ZVU=','cFl0Zkk=','SWtpVG4=','b3V0dGltZQ==','ZW5jcnlwdF9pZA==','amp0','WW9USFI=','bUtFc04=','dGltZV9jb3JyZWN0aW9u','ZXhwaXJl','eG9yRW5jcnlwdA==','YUNDSVg=','Z2V0Q3VycmVudFRpbWU=','Y2Zfdg==','Tmx2d2o=','ZU5yQmQ=','W29iamVjdCBPYmplY3Rd','Y2h2YnU=','Tk1RVUo=','W29iamVjdCBBcnJheV0=','RXVuWnI=','ak5xY0w=','SHBZZms=','YWx6QUk=','WVpMZmI=','cUdQWGo=','S3NuQ0U=','T25BSEE=','dmR1dk4=','c29ydA==','SXFhc2s=','SEpWRVU=','aWRkZXg=','RERGbXo=','UmVjdXJzaXZlU29ydGluZw==','aU1ncEs=','enBVUHg=','QmZKdko=','SlllVkw=','a3JmeUQ=','RElEcFU=','UlhqaUI=','akxLQWo=','R3hDY3U=','enRPd0Q=','cnlIVlc=','c0pWRFk=','a055eno=','ek9DS3c=','UVFlVEY=','dXVHbVI=','TXRrd3U=','ZW9LSmM=','enRDU0Y=','d3lXbmc=','cG9w','dW5zaGlmdA==','aXBzQkU=','SFp0S3I=','enlSUVU=','VHBVWFM=','T1Vrdkg=','WFpBRHI=','ZkZSemI=','R2N0Smo=','UkJuTkg=','dVFhbG0=','YnVQeUQ=','Z0VxRlE=','c2p5UUk=','TWhKd0E=','cWlZQ3A=','amlFRHQ=','a2dkRnE=','alhpeUY=','Z2V0TnVtYmVySW5TdHJpbmc=','Z2V0U3BlY2lhbFBvc2l0aW9u','WW5tYm0=','bWludXNCeUJ5dGU=','V1VIdGw=','ZmVwekI=','Y3FrdWg=','RXRQUGs=','ZW5jcnlwdDI=','ZW5jcnlwdDM=','M3wyfDV8MHw0fDE=','eWZhUFA=','cnFUQ3c=','UXRmQ1I=','a1djU2g=','QmpMeGc=','ZGNDSnY=','enhYb2g=','amtaclA=','aHFtemM=','UE1Ka0w=','ZW5jb2RlVVRGOA==','elN5dWs=','WEtOQ1o=','Um1NUG8=','RUNVVlU=','c2V0','YnVmZmVy','ZlRpU3M=','Z2V0VWludDMy','SVVqRmE=','bkFUZnA=','ZlFPU20=','ZE1DS04=','QWNHcVE=','VE5CZkU=','S0tLanE=','T3ByRFQ=','RnZsSHI=','SmF5em4=','eFFBc3M=','bWJpdVI=','SW96ZEI=','b3hTU28=','eEFFUEs=','VGdmYVg=','Wkp2bm8=','a1dJeG0=','dU9McEs=','SW9mRW4=','ZHFZYk8=','TUZIeHk=','VUlKZE8=','T2JpRUg=','b09QbUc=','clpIZlg=','dEppcUs=','RmxTREk=','eGluRGo=','bVlqdEM=','TnRVZGc=','REZWZmo=','aHFrVUw=','UnNkb0M=','QkRRRWc=','Y3dVV1E=','VnhramE=','bUh4alg=','aE9xdXk=','dkFsRk8=','QnhLaE0=','ZFdpVkc=','UFl1dHM=','QVdXbGg=','RmZkTHU=','a2dmYVI=','QXh2Sno=','QWtvcXM=','b1RaZUM=','bG5hQlU=','Vk5WaU4=','YWJFamI=','RlNxa2s=','Z0hMY3Y=','VFNQc00=','QlVWbEs=','SkdBaFE=','eHZtYmg=','Z0dLSWo=','aFlUSEY=','TEJvQmc=','S0N2VlU=','VkpUS3Y=','RkF5dnA=','VVhYV3U=','SWNzYVE=','RllTank=','blhOYXE=','a1dGcUY=','alpEUm8=','aVV0TnM=','VlpOQ1g=','amZMdXg=','YmtCU2o=','U0t4WmU=','VVVQZnQ=','bXVMcmQ=','aEl6Y2U=','Sk1JaWk=','Q3hJeEo=','WklUeGI=','ZVVMdHA=','WEpZVlM=','d3NQTUI=','eXFJZVY=','TmlyWEk=','d0h3aGI=','bVdERmQ=','QnhQa0M=','RU9IUk4=','VVVmVXE=','aEFTdlo=','UUl2d2U=','bFpZZ0g=','S3ZJcGo=','bUl2QmY=','a2F1REQ=','VGNTVnM=','TFd4S2s=','emJZdXA=','c1RYUWI=','UG5mcUw=','eG50c0c=','cWlvRVA=','ZWZCWXM=','U0J1R0g=','VXF5UWs=','VkxmVUg=','SFlhd1c=','WmxPd1g=','YUJ6UEc=','bHFOb2M=','RlhHS2s=','WUpGUXM=','c3NISWE=','VXp4bkI=','Z0VMSmw=','aXpXUWc=','S0ZPaFQ=','b2VSQUY=','RGdHeGU=','U2N4RlE=','Q0JHaEg=','eUxqSXo=','YUdDWGo=','QXR3SnU=','TmVCWnk=','ZmJ4TlQ=','RElMRGQ=','YVhmRFU=','alpYalU=','UlN0ZUs=','SUR4VXo=','YVJGU3k=','bW9nWmY=','dGFZY3E=','TGpPd1g=','TFhrc0g=','am95eXRva2Vu','dzMuMS4w','YTQ0YzQ1M2NkMzkxMDNmZGIxNjljNGEzNzFlZjZiNzM=','ZmZmZmZmdHQ=','LWE0NTA0NmRlOWZiZi0wYTRmYzhlYzk1NDhhN2Y5','ODg1Njk=','TGludXggYWFyY2g2NA==','R29vZ2xlIEluYy4=','MTYyNjk3MDU4MDUwNjQyMTM=','ZmZ0dHR0dWE=','dHR0dHQ=','ZDUtNU0sQVIsNUYzLDEuMDAwLHQ=','ZDctNU0sQVIsNUdTLDEuMDAwLHQ=','ZjRPN1RjMmpCS0dIMWZ0RWFLWlV1U0E9PQ==','TUkgOA==','YW5kcm9pZA==','MTAuMC4y','MTYyNjk3MDU3MDA4NH4xMUpsNkVJckFwTDE0ZTkxZWJiNjMzOTI4YzIzZDVhZmJhYThmOTQ3OTUyfnl+fn5CflNCTkFFQW9SVlY1Y0hWMVlSbGtlVzE5VlZ4WWZFMU1RQ2hFVUhSTlFFZ3NSVVJJZkVrNFFEaEVESEFjZUN4UWRFMGNTQ3hFQUFBc0VHazg9fjA0ZXVuamk=','YmFzZTY0','T2tUdG4=','cGFyc2U=','Z2V0dG9rZW4=','Y29udGVudD17ImFwcG5hbWUiOiI1MDA4NSIsIndod3N3c3d3cyI6IiIsImpka2V5IjoiLWE0NTA0NmRlOWZiZi0wYTRmYzhlYzk1NDhhN2Y5IiwiYm9keSI6eyJwbGF0Zm9ybSI6IjEifX0=','SEpyUHM=','b2JqVG9TdHJpbmcy','ZGVjaXBoZXJKb3lUb2tlbg==','bHNjak0=','WU5Ub24=','Z2V0UmFuZG9tV29yZA==','Z2V0S2V5','JnRva2VuPQ==','JnRpbWU9','Jm5vbmNlX3N0cj0=','JmtleT0=','JmlzX3RydXN0PTE=','c2hhMjU2','ZmJJQms=','dWtSekQ=','ckduck4=','Z2V0Q3JjQ29kZQ==','WnRxTWg=','TGRPanU=','ZE5IVWo=','VExJcUI=','Z2FBV1k=','SklXTFk=','d3RqWnI=','WlpoRW8=','SmN1ZUE=','d0dWZGU=','c1pGYms=','c0pvekk=','eFVsSWc=','Qk9pUkE=','Wm1BT1Q=','and5QUo=','Y1pEQmw=','a0phZ20=','am95eXRva2VuPQ==','RGhCS2o=','dW5kZWZpbmVk','ZHFJeXU=','c3RyaW5n','T2JqZWN0','TWFw','U2V0','QXJndW1lbnRz','akdkSlI=','SVhTR1U=','SW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2UuCkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC4=','aXNBcnJheQ==','Y1lKWWg=','cll4T0Y=','TGxyQXc=','Y2ZGSWo=','aXRlcmF0b3I=','ZnJvbQ==','TklLU3Q=','REVIaVY=','cXlwUm4=','Q25YTWo=','ZFptSWo=','WkljeUc=','QkRnV3Q=','Q21hRXo=','b0t1dlY=','d1ZVeGU=','cHJvdG90eXBl','dG9TdHJpbmc=','Y2FsbA==','c2xpY2U=','ZWdRRXE=','cUNZQ2s=','Y29uc3RydWN0b3I=','bmFtZQ==','dnFLWE8=','VFdWZ3E=','TUdyeXI=','Qk1sV1Y=','Yk94R3I=','elp5dW4=','dGVzdA==','VW90SVU=','ak5SdUY=','dlBtUnU=','cEVERmE=','U2ZHcmI=','Q1BQY3Y=','d05abnk=','SEFnY2U=','RGJ2bkQ=','bGVuZ3Ro','THlCamc=','UG1ibXk=','VmNYeVI=','RnVMS0Q=','dkNzcmQ=','S3dPeVY=','UXVOU1E=','WmhES2U=','dFlCaWg=','VVZycmk=','b2VqSEY=','dFFLWHM=','VFN0b2Y=','ZFVKaXE=','SHB0TG4=','TmJPVGY=','Y0RxQ2Y=','Rk14U0k=','Yk1Pc0o=','ZlptZlo=','RFNyUXA=','aFlkWEg=','VWR4SEk=','VHF4VkI=','QmRBQks=','eGl3U0w=','QW1LZmk=','dFVsclc=','ckJkaW4=','UmlQRXA=','Sk1Vdmc=','bnNlQnA=','Y0ZSZXM=','MDEyMzQ1Njc4OWFiY2RlZg==','Y2ZldnI=','cFFOT0U=','RFlVUkY=','d2VRbFY=','aUpyTUw=','SktPYk8=','TVZyWFA=','YlJWTEY=','Q0lrd3E=','NHwxfDJ8OHwwfDN8NnwxMXw3fDEwfDV8OQ==','akNPdVE=','c3BsaXQ=','MTB8NHw3fDEzfDE1fDN8MTd8NnwxMXwwfDE4fDl8OHw1fDE0fDJ8MTZ8MTl8MXwxMg==','MTB8N3wwfDR8M3w2fDV8OHwxfDl8Mg==','YVFPbmw=','akZqdGw=','QUh0d0k=','WWhNU0c=','R3ZWRFM=','RUtSWVA=','aGt4Smc=','RkZuSkw=','THJ4ZGs=','Vm9kdmo=','Q2FTTGs=','R3VkaUs=','U3NMSG4=','VGNib0E=','SWJLSHA=','b1BLQlY=','dXRmLTg=','ZXJyb3I=','ZGF0YQ==','ZW5k','YmgubS5qZC5jb20=','L2dldHRva2Vu','UE9TVA==','dGV4dC9wbGFpbjtjaGFyc2V0PVVURi04','aHR0cHM6Ly9oNS5tLmpkLmNvbQ==','Y29tLmppbmdkb25nLmFwcC5tYWxs','aHR0cHM6Ly93YmJueS5tLmpkLmNvbS9iYWJlbERpeS9aZXVzLzJydHBmZks4d3FOeVBCSDZ3eVVEdUJLb0FiQ3QvaW5kZXguaHRtbD9iYWJlbENoYW5uZWw9ZmMmbG5nPTEwNC42OTc0NzEmbGF0PTMxLjQ2NjY1OSZzaWQ9YjdhYzAxNTRjMGI4N2EyN2QzNTI5ZWJhY2FiY2JjNncmdW5fYXJlYT0yMl8xOTYwXzM4NTc0XzUxNjc0','aHR0cHM=','S1JaSmY=','VldWbGg=','aXppWWU=','bGJiZmU=','amhwVVc=','R1hmcVI=','bVhtY3Q=','S3BMY1Q=','a1RqZkw=','b1J5TFI=','UFFtZ3k=','d1dmTnE=','REl0SUg=','Y29udGVudD17ImFwcG5hbWUiOiI1MDA4NSIsIndod3N3c3d3cyI6ImY0TzdUYzJqQktHSDFmdEVhS1pVdVNBPT0iLCJqZGtleSI6Ii1hNDUwNDZkZTlmYmYtMGE0ZmM4ZWM5NTQ4YTdmOSIsImJvZHkiOnsicGxhdGZvcm0iOiIxIn19','cWVsclU=','bWhhUWI=','enlURmg=','SWVEak8=','VVdsdkU=','UUx1UmE=','Um5MYXQ=','dVZib1M=','QkNDdUg=','dGRKbnk=','bkdyWEw=','cmVxdWVzdA==','c2V0RW5jb2Rpbmc=','bnlMTEg=','clFrRnI=','QnlVWk4=','RHlrb0I=','d3JpdGU=','dEpKUWM=','Y2hhckNvZGVBdA==','SVdMbFM=','NHw5fDEwfDV8M3w2fDd8OHwyfDExfDB8MQ==','bm13ZlU=','QVNIVko=','cE9sbHM=','YXdiU3g=','VkVnWFM=','SERJQk0=','bHpHR00=','WU9CTkU=','bWF2bE4=','ZkFRSms=','RWx3RWs=','RENGZGo=','WmNRanY=','UnRZWG8=','b0dadFI=','Um5FRGE=','U1pucVg=','RXhmTFQ=','SmhmT3c=','ZEloV00=','YXdaWE8=','TWVEUGY=','VUNsVFQ=','Y2hhckF0','eEpieXA=','UG5RSmo=','Y29uY2F0','aHR0cHM6Ly8=','YmgubS5qZC5jb20vZ2V0dG9rZW4=','aHR0cHM6Ly9ibGFja2hvbGU=','Lm0uamQuY29tL2J5cGFzcw==','UmlTc1I=','UEZYRXo=','dUNYZHE=','dG9VcHBlckNhc2U=','aWhRcnU=','M3w0fDB8MXwy','QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0=','6Kej5a+G6ZSZ6K+v','cUlnclQ=','dE1IZmE=','Z2V0Q3VycmVudERhdGU=','Z2V0VGltZQ==','TklMZHk=','a2xqeXE=','VEdYVUg=','TmZsa04=','WnpRZVg=','UXNDWlE=','ckVJYkQ=','T2lSZGo=','aW5kZXhPZg==','VFVmZVM=','ZFNmeXM=','ZnJvbUNoYXJDb2Rl','c01QeWk=','R0VYcVM=','Wk1IZ04=','YXJCSFI=','YnBvd2U=','QUlkR2I=','eE9CbFY=','UUNWSUw=','eW5aYWw=','cmVwbGFjZQ==','ZnFtSFk=','RHlWYXI=','RmFpbGVkIHRvIGV4ZWN1dGUgJ2J0b2EnIG9uICdXaW5kb3cnOiBUaGUgc3RyaW5nIHRvIGJlIGVuY29kZWQgY29udGFpbnMgY2hhcmFjdGVycyBvdXRzaWRlIG9mIHRoZSBMYXRpbjEgcmFuZ2Uu','PT09','UWpHQXE=','QWVsQUE=','aXVicHU=','SWppWnE=','R0JVaGE=','SmFpUms=','c1NvQ0o=','WXdJaUI=','ZUlIcVc=','eUZnZ1U=','SUdyek0=','YUZ3Qkc=','enhTY28=','bUNHVGk=','SmJiWW0=','eW9KdUg=','RUV2d2k=','Q3ptWXE=','VmtPcWM=','emRQT3E=','QmlISkU=','c3Vic3RyaW5n','RExnTE0=','cXlRTFY=','ZXBtV0g=','b1F3dms=','R29wZmI=','WUtIWnc=','SVBCcFQ=','UXpDZ0w=','ZENQd3Y=','dkhkTVY=','cHVzaA==','am9pbg==','ZUp3S3U=','eUVWQmc=','SkhyemY=','b2dHR0U=','dmRPdGw=','bGVuX0Z1bg==','ZW5jcnlwdDE=','MDAwMDA=','YlVOV2s=','UG1BSU8=','cGhaVWQ=','QXhVZ2g=','c3Vic3Ry','dVlNQk4=','bm90R2c=','T3VpYVc=','SnhSdUI=','dmdxem0=','YWRkWmVyb0JhY2s=','YWRkWmVyb0Zyb250','cnZoeXo=','VGxlRmY=','a2V5cw==','Zm9yRWFjaA==','RVJkalU=','S2RLalg=','YWJz','U2FISUY=','YXRvYlBvbHlmaWxs','ZVVkbEI=','eFV2UXk=','bVN2RmY=','Y2VpbA==','Zmxvb3I=','TWlrZE0=','blBQUHk=','cmFuZG9t','c3Jtc3E=','MDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVo=','dnFzbWM=','Tmtsbnc=','cm91bmQ=','Q29oSHA=','WmxjSmc=','bHRIc2M=','WGdoQ04=','Zm9oVUQ=','TWdwdW4=','WUVIeWk=','dVRSUEc=','UHpUeE4=','WUFaVFY=','T0taWnc=','aGFzT3duUHJvcGVydHk=','Z2V0TGFzdEFzY2lp','VUtEZlI=','eG9DaUs=','bWF4','dG9Bc2NpaQ==','TFhld08=','YWRkMA==','eU5NSks=','Ump6WHE=','MHw0fDJ8M3w1fDE=','MDAwMDAwMDAgNzcwNzMwOTYgRUUwRTYxMkMgOTkwOTUxQkEgMDc2REM0MTkgNzA2QUY0OEYgRTk2M0E1MzUgOUU2NDk1QTMgMEVEQjg4MzIgNzlEQ0I4QTQgRTBENUU5MUUgOTdEMkQ5ODggMDlCNjRDMkIgN0VCMTdDQkQgRTdCODJEMDcgOTBCRjFEOTEgMURCNzEwNjQgNkFCMDIwRjIgRjNCOTcxNDggODRCRTQxREUgMUFEQUQ0N0QgNkREREU0RUIgRjRENEI1NTEgODNEMzg1QzcgMTM2Qzk4NTYgNjQ2QkE4QzAgRkQ2MkY5N0EgOEE2NUM5RUMgMTQwMTVDNEYgNjMwNjZDRDkgRkEwRjNENjMgOEQwODBERjUgM0I2RTIwQzggNEM2OTEwNUUgRDU2MDQxRTQgQTI2NzcxNzIgM0MwM0U0RDEgNEIwNEQ0NDcgRDIwRDg1RkQgQTUwQUI1NkIgMzVCNUE4RkEgNDJCMjk4NkMgREJCQkM5RDYgQUNCQ0Y5NDAgMzJEODZDRTMgNDVERjVDNzUgRENENjBEQ0YgQUJEMTNENTkgMjZEOTMwQUMgNTFERTAwM0EgQzhENzUxODAgQkZEMDYxMTYgMjFCNEY0QjUgNTZCM0M0MjMgQ0ZCQTk1OTkgQjhCREE1MEYgMjgwMkI4OUUgNUYwNTg4MDggQzYwQ0Q5QjIgQjEwQkU5MjQgMkY2RjdDODcgNTg2ODRDMTEgQzE2MTFEQUIgQjY2NjJEM0QgNzZEQzQxOTAgMDFEQjcxMDYgOThEMjIwQkMgRUZENTEwMkEgNzFCMTg1ODkgMDZCNkI1MUYgOUZCRkU0QTUgRThCOEQ0MzMgNzgwN0M5QTIgMEYwMEY5MzQgOTYwOUE4OEUgRTEwRTk4MTggN0Y2QTBEQkIgMDg2RDNEMkQgOTE2NDZDOTcgRTY2MzVDMDEgNkI2QjUxRjQgMUM2QzYxNjIgODU2NTMwRDggRjI2MjAwNEUgNkMwNjk1RUQgMUIwMUE1N0IgODIwOEY0QzEgRjUwRkM0NTcgNjVCMEQ5QzYgMTJCN0U5NTAgOEJCRUI4RUEgRkNCOTg4N0MgNjJERDFEREYgMTVEQTJENDkgOENEMzdDRjMgRkJENDRDNjUgNERCMjYxNTggM0FCNTUxQ0UgQTNCQzAwNzQgRDRCQjMwRTIgNEFERkE1NDEgM0REODk1RDcgQTREMUM0NkQgRDNENkY0RkIgNDM2OUU5NkEgMzQ2RUQ5RkMgQUQ2Nzg4NDYgREE2MEI4RDAgNDQwNDJENzMgMzMwMzFERTUgQUEwQTRDNUYgREQwRDdDQzkgNTAwNTcxM0MgMjcwMjQxQUEgQkUwQjEwMTAgQzkwQzIwODYgNTc2OEI1MjUgMjA2Rjg1QjMgQjk2NkQ0MDkgQ0U2MUU0OUYgNUVERUY5MEUgMjlEOUM5OTggQjBEMDk4MjIgQzdEN0E4QjQgNTlCMzNEMTcgMkVCNDBEODEgQjdCRDVDM0IgQzBCQTZDQUQgRURCODgzMjAgOUFCRkIzQjYgMDNCNkUyMEMgNzRCMUQyOUEgRUFENTQ3MzkgOUREMjc3QUYgMDREQjI2MTUgNzNEQzE2ODMgRTM2MzBCMTIgOTQ2NDNCODQgMEQ2RDZBM0UgN0E2QTVBQTggRTQwRUNGMEIgOTMwOUZGOUQgMEEwMEFFMjcgN0QwNzlFQjEgRjAwRjkzNDQgODcwOEEzRDIgMUUwMUYyNjggNjkwNkMyRkUgRjc2MjU3NUQgODA2NTY3Q0IgMTk2QzM2NzEgNkU2QjA2RTcgRkVENDFCNzYgODlEMzJCRTAgMTBEQTdBNUEgNjdERDRBQ0MgRjlCOURGNkYgOEVCRUVGRjkgMTdCN0JFNDMgNjBCMDhFRDUgRDZENkEzRTggQTFEMTkzN0UgMzhEOEMyQzQgNEZERkYyNTIgRDFCQjY3RjEgQTZCQzU3NjcgM0ZCNTA2REQgNDhCMjM2NEIgRDgwRDJCREEgQUYwQTFCNEMgMzYwMzRBRjYgNDEwNDdBNjAgREY2MEVGQzMgQTg2N0RGNTUgMzE2RThFRUYgNDY2OUJFNzkgQ0I2MUIzOEMgQkM2NjgzMUEgMjU2RkQyQTAgNTI2OEUyMzYgQ0MwQzc3OTUgQkIwQjQ3MDMgMjIwMjE2QjkgNTUwNTI2MkYgQzVCQTNCQkUgQjJCRDBCMjggMkJCNDVBOTIgNUNCMzZBMDQgQzJEN0ZGQTcgQjVEMENGMzEgMkNEOTlFOEIgNUJERUFFMUQgOUI2NEMyQjAgRUM2M0YyMjYgNzU2QUEzOUMgMDI2RDkzMEEgOUMwOTA2QTkgRUIwRTM2M0YgNzIwNzY3ODUgMDUwMDU3MTMgOTVCRjRBODIgRTJCODdBMTQgN0JCMTJCQUUgMENCNjFCMzggOTJEMjhFOUIgRTVENUJFMEQgN0NEQ0VGQjcgMEJEQkRGMjEgODZEM0QyRDQgRjFENEUyNDIgNjhEREIzRjggMUZEQTgzNkUgODFCRTE2Q0QgRjZCOTI2NUIgNkZCMDc3RTEgMThCNzQ3NzcgODgwODVBRTYgRkYwRjZBNzAgNjYwNjNCQ0EgMTEwMTBCNUMgOEY2NTlFRkYgRjg2MkFFNjkgNjE2QkZGRDMgMTY2Q0NGNDUgQTAwQUUyNzggRDcwREQyRUUgNEUwNDgzNTQgMzkwM0IzQzIgQTc2NzI2NjEgRDA2MDE2RjcgNDk2OTQ3NEQgM0U2RTc3REIgQUVEMTZBNEEgRDlENjVBREMgNDBERjBCNjYgMzdEODNCRjAgQTlCQ0FFNTMgREVCQjlFQzUgNDdCMkNGN0YgMzBCNUZGRTkgQkRCREYyMUMgQ0FCQUMyOEEgNTNCMzkzMzAgMjRCNEEzQTYgQkFEMDM2MDUgQ0RENzA2OTMgNTRERTU3MjkgMjNEOTY3QkYgQjM2NjdBMkUgQzQ2MTRBQjggNUQ2ODFCMDIgMkE2RjJCOTQgQjQwQkJFMzcgQzMwQzhFQTEgNUEwNURGMUIgMkQwMkVGOEQ=','U25hQXc=','Zk5XSHc=','dXVKWm8=','jxsKCjMziamSi.cPuoMYmQ.LVvPkC6=='];(function(_0x13c468,_0x41f442,_0x1c84f3){var _0x510703=function(_0x582765,_0x3343d0,_0x45bfb1,_0x386e2a,_0x4e21a1){_0x3343d0=_0x3343d0>>0x8,_0x4e21a1='po';var _0x4863dc='shift',_0x4c1303='push';if(_0x3343d0<_0x582765){while(--_0x582765){_0x386e2a=_0x13c468[_0x4863dc]();if(_0x3343d0===_0x582765){_0x3343d0=_0x386e2a;_0x45bfb1=_0x13c468[_0x4e21a1+'p']();}else if(_0x3343d0&&_0x45bfb1['replace'](/[xKCMzSPuMYQLVPkC=]/g,'')===_0x3343d0){_0x13c468[_0x4c1303](_0x386e2a);}}_0x13c468[_0x4c1303](_0x13c468[_0x4863dc]());}return 0x99ae0;};return _0x510703(++_0x41f442,_0x1c84f3)>>_0x41f442^_0x1c84f3;}(_0x4219,0x156,0x15600));var _0x5759=function(_0x45ab35,_0x5213b2){_0x45ab35=~~'0x'['concat'](_0x45ab35);var _0xda714f=_0x4219[_0x45ab35];if(_0x5759['zCDdrE']===undefined){(function(){var _0x46bf1f;try{var _0x299ab4=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x46bf1f=_0x299ab4();}catch(_0x4ea50a){_0x46bf1f=window;}var _0x3127cb='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x46bf1f['atob']||(_0x46bf1f['atob']=function(_0x15b10c){var _0x4d4b32=String(_0x15b10c)['replace'](/=+$/,'');for(var _0x56f04f=0x0,_0x585fb9,_0x1870a9,_0x383cb2=0x0,_0x57c5cb='';_0x1870a9=_0x4d4b32['charAt'](_0x383cb2++);~_0x1870a9&&(_0x585fb9=_0x56f04f%0x4?_0x585fb9*0x40+_0x1870a9:_0x1870a9,_0x56f04f++%0x4)?_0x57c5cb+=String['fromCharCode'](0xff&_0x585fb9>>(-0x2*_0x56f04f&0x6)):0x0){_0x1870a9=_0x3127cb['indexOf'](_0x1870a9);}return _0x57c5cb;});}());_0x5759['vZeRhX']=function(_0x4dd29a){var _0xa096af=atob(_0x4dd29a);var _0xe5749a=[];for(var _0x4c8e5f=0x0,_0xbc782b=_0xa096af['length'];_0x4c8e5f<_0xbc782b;_0x4c8e5f++){_0xe5749a+='%'+('00'+_0xa096af['charCodeAt'](_0x4c8e5f)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0xe5749a);};_0x5759['sWsabm']={};_0x5759['zCDdrE']=!![];}var _0x2f5c09=_0x5759['sWsabm'][_0x45ab35];if(_0x2f5c09===undefined){_0xda714f=_0x5759['vZeRhX'](_0xda714f);_0x5759['sWsabm'][_0x45ab35]=_0xda714f;}else{_0xda714f=_0x2f5c09;}return _0xda714f;};function encrypt_3(_0x4e6862){var _0x44d3f4={'cYJYh':function(_0x4b911d,_0x563ecb){return _0x4b911d(_0x563ecb);},'rYxOF':function(_0x409c7d,_0x41f512){return _0x409c7d!=_0x41f512;},'LlrAw':_0x5759('0'),'cfFIj':function(_0x215395,_0x41654f){return _0x215395 in _0x41654f;},'NIKSt':function(_0x49b579,_0x404a08){return _0x49b579^_0x404a08;},'DEHiV':function(_0x163349,_0x34bf93){return _0x163349^_0x34bf93;},'qypRn':function(_0x3bc2ff,_0x5f68d6,_0x216970){return _0x3bc2ff(_0x5f68d6,_0x216970);},'CnXMj':function(_0x479f28,_0x29e5a5){return _0x479f28!==_0x29e5a5;},'dZmIj':_0x5759('1'),'oKuvV':function(_0x43fa73,_0x6c1233){return _0x43fa73==_0x6c1233;},'wVUxe':_0x5759('2'),'egQEq':function(_0xbeea72,_0x250b31){return _0xbeea72===_0x250b31;},'qCYCk':_0x5759('3'),'vqKXO':function(_0x3b8d14,_0x21b7ac){return _0x3b8d14===_0x21b7ac;},'TWVgq':_0x5759('4'),'MGryr':function(_0x58f6c9,_0x47c4a0){return _0x58f6c9===_0x47c4a0;},'BMlWV':_0x5759('5'),'bOxGr':function(_0x4a57c8,_0x51b1a1){return _0x4a57c8===_0x51b1a1;},'zZyun':_0x5759('6'),'UotIU':function(_0x17f876,_0x35a835,_0x208fd1){return _0x17f876(_0x35a835,_0x208fd1);},'SfGrb':function(_0x5ed072,_0x188719){return _0x5ed072<_0x188719;},'CPPcv':function(_0x241697){return _0x241697();},'jNRuF':function(_0x52fcc4,_0x1bfc91){return _0x52fcc4===_0x1bfc91;},'vPmRu':_0x5759('7'),'pEDFa':_0x5759('8'),'wNZny':_0x5759('9')};return function(_0x4e6862){if(Array[_0x5759('a')](_0x4e6862))return _0x44d3f4[_0x5759('b')](encrypt_3_3,_0x4e6862);}(_0x4e6862)||function(_0x4e6862){if(_0x44d3f4[_0x5759('c')](_0x44d3f4[_0x5759('d')],typeof Symbol)&&_0x44d3f4[_0x5759('e')](Symbol[_0x5759('f')],_0x44d3f4[_0x5759('b')](Object,_0x4e6862)))return Array[_0x5759('10')](_0x4e6862);}(_0x4e6862)||function(_0x4e6862,_0x2d7f5a){var _0x44fb55={'ZIcyG':function(_0x559f9d,_0x598f80){return _0x44d3f4[_0x5759('11')](_0x559f9d,_0x598f80);},'BDgWt':function(_0x50f07b,_0x5e11eb){return _0x44d3f4[_0x5759('12')](_0x50f07b,_0x5e11eb);},'CmaEz':function(_0x5b1d08,_0x19109e,_0x4bb7fb){return _0x44d3f4[_0x5759('13')](_0x5b1d08,_0x19109e,_0x4bb7fb);}};if(_0x4e6862){if(_0x44d3f4[_0x5759('14')](_0x44d3f4[_0x5759('15')],_0x44d3f4[_0x5759('15')])){return _0x44fb55[_0x5759('16')](_0x44fb55[_0x5759('17')](_0x44fb55[_0x5759('18')](rotateRight,0x6,x),_0x44fb55[_0x5759('18')](rotateRight,0xb,x)),_0x44fb55[_0x5759('18')](rotateRight,0x19,x));}else{if(_0x44d3f4[_0x5759('19')](_0x44d3f4[_0x5759('1a')],typeof _0x4e6862))return _0x44d3f4[_0x5759('13')](encrypt_3_3,_0x4e6862,_0x2d7f5a);var _0x4ab011=Object[_0x5759('1b')][_0x5759('1c')][_0x5759('1d')](_0x4e6862)[_0x5759('1e')](0x8,-0x1);return _0x44d3f4[_0x5759('1f')](_0x44d3f4[_0x5759('20')],_0x4ab011)&&_0x4e6862[_0x5759('21')]&&(_0x4ab011=_0x4e6862[_0x5759('21')][_0x5759('22')]),_0x44d3f4[_0x5759('23')](_0x44d3f4[_0x5759('24')],_0x4ab011)||_0x44d3f4[_0x5759('25')](_0x44d3f4[_0x5759('26')],_0x4ab011)?Array[_0x5759('10')](_0x4e6862):_0x44d3f4[_0x5759('27')](_0x44d3f4[_0x5759('28')],_0x4ab011)||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/[_0x5759('29')](_0x4ab011)?_0x44d3f4[_0x5759('2a')](encrypt_3_3,_0x4e6862,_0x2d7f5a):void 0x0;}}}(_0x4e6862)||function(){if(_0x44d3f4[_0x5759('2b')](_0x44d3f4[_0x5759('2c')],_0x44d3f4[_0x5759('2d')])){for(var _0x2521ed=index;_0x44d3f4[_0x5759('2e')](_0x2521ed,0x40);_0x2521ed++)buffer[_0x2521ed]=0x0;_0x44d3f4[_0x5759('2f')](sha256_transform);for(var _0x2521ed=0x0;_0x44d3f4[_0x5759('2e')](_0x2521ed,0x38);_0x2521ed++)buffer[_0x2521ed]=0x0;}else{throw new TypeError(_0x44d3f4[_0x5759('30')]);}}();}function encrypt_3_3(_0x3bffc0,_0x3bf986){var _0x3dd5cd={'HAgce':function(_0x275c6d,_0x50ca2b){return _0x275c6d==_0x50ca2b;},'DbvnD':function(_0x20cffc,_0x3bbf0b){return _0x20cffc>_0x3bbf0b;},'LyBjg':function(_0x1d8252,_0x6afdba){return _0x1d8252<_0x6afdba;}};(_0x3dd5cd[_0x5759('31')](null,_0x3bf986)||_0x3dd5cd[_0x5759('32')](_0x3bf986,_0x3bffc0[_0x5759('33')]))&&(_0x3bf986=_0x3bffc0[_0x5759('33')]);for(var _0x3a4623=0x0,_0x81aa46=new Array(_0x3bf986);_0x3dd5cd[_0x5759('34')](_0x3a4623,_0x3bf986);_0x3a4623++)_0x81aa46[_0x3a4623]=_0x3bffc0[_0x3a4623];return _0x81aa46;}function rotateRight(_0x3310f7,_0x26023b){var _0x403f5f={'Pmbmy':function(_0x26023b,_0x43c5b9){return _0x26023b|_0x43c5b9;},'VcXyR':function(_0x26023b,_0x9c4403){return _0x26023b>>>_0x9c4403;},'FuLKD':function(_0x26023b,_0xe8c9b7){return _0x26023b<<_0xe8c9b7;},'vCsrd':function(_0x26023b,_0x461f74){return _0x26023b-_0x461f74;}};return _0x403f5f[_0x5759('35')](_0x403f5f[_0x5759('36')](_0x26023b,_0x3310f7),_0x403f5f[_0x5759('37')](_0x26023b,_0x403f5f[_0x5759('38')](0x20,_0x3310f7)));}function choice(_0x2b3fa6,_0x338458,_0x50ca74){var _0x51e83a={'KwOyV':function(_0x2b3fa6,_0x338458){return _0x2b3fa6^_0x338458;},'QuNSQ':function(_0x2b3fa6,_0x338458){return _0x2b3fa6&_0x338458;},'ZhDKe':function(_0x2b3fa6,_0x338458){return _0x2b3fa6&_0x338458;}};return _0x51e83a[_0x5759('39')](_0x51e83a[_0x5759('3a')](_0x2b3fa6,_0x338458),_0x51e83a[_0x5759('3b')](~_0x2b3fa6,_0x50ca74));}function majority(_0x860bb2,_0x38ac0f,_0xe40e34){var _0x20dc3f={'tYBih':function(_0x860bb2,_0x38ac0f){return _0x860bb2^_0x38ac0f;},'UVrri':function(_0x860bb2,_0x38ac0f){return _0x860bb2&_0x38ac0f;},'oejHF':function(_0x860bb2,_0x38ac0f){return _0x860bb2&_0x38ac0f;}};return _0x20dc3f[_0x5759('3c')](_0x20dc3f[_0x5759('3c')](_0x20dc3f[_0x5759('3d')](_0x860bb2,_0x38ac0f),_0x20dc3f[_0x5759('3d')](_0x860bb2,_0xe40e34)),_0x20dc3f[_0x5759('3e')](_0x38ac0f,_0xe40e34));}function sha256_Sigma0(_0x2e1e50){var _0x43fb95={'tQKXs':function(_0x2e1e50,_0x2120fd){return _0x2e1e50^_0x2120fd;},'TStof':function(_0x2e1e50,_0x760b02){return _0x2e1e50^_0x760b02;},'dUJiq':function(_0x5e02de,_0x491160,_0x50d847){return _0x5e02de(_0x491160,_0x50d847);}};return _0x43fb95[_0x5759('3f')](_0x43fb95[_0x5759('40')](_0x43fb95[_0x5759('41')](rotateRight,0x2,_0x2e1e50),_0x43fb95[_0x5759('41')](rotateRight,0xd,_0x2e1e50)),_0x43fb95[_0x5759('41')](rotateRight,0x16,_0x2e1e50));}function sha256_Sigma1(_0xdc8125){var _0x367e32={'HptLn':function(_0xdc8125,_0x3d4f33){return _0xdc8125^_0x3d4f33;},'NbOTf':function(_0xdc8125,_0x4761d6){return _0xdc8125^_0x4761d6;},'cDqCf':function(_0x11a02b,_0x56bff9,_0x4de8f2){return _0x11a02b(_0x56bff9,_0x4de8f2);},'FMxSI':function(_0x4ea647,_0x514b9c,_0x2f1fd2){return _0x4ea647(_0x514b9c,_0x2f1fd2);}};return _0x367e32[_0x5759('42')](_0x367e32[_0x5759('43')](_0x367e32[_0x5759('44')](rotateRight,0x6,_0xdc8125),_0x367e32[_0x5759('44')](rotateRight,0xb,_0xdc8125)),_0x367e32[_0x5759('45')](rotateRight,0x19,_0xdc8125));}function sha256_sigma0(_0x303fd4){var _0x2a994b={'bMOsJ':function(_0x303fd4,_0x2c6f59){return _0x303fd4^_0x2c6f59;},'fZmfZ':function(_0x303fd4,_0x4c44ce){return _0x303fd4^_0x4c44ce;},'DSrQp':function(_0x555e08,_0x5dfb4a,_0x362a26){return _0x555e08(_0x5dfb4a,_0x362a26);},'hYdXH':function(_0x303fd4,_0x2181b6){return _0x303fd4>>>_0x2181b6;}};return _0x2a994b[_0x5759('46')](_0x2a994b[_0x5759('47')](_0x2a994b[_0x5759('48')](rotateRight,0x7,_0x303fd4),_0x2a994b[_0x5759('48')](rotateRight,0x12,_0x303fd4)),_0x2a994b[_0x5759('49')](_0x303fd4,0x3));}function sha256_sigma1(_0x23fa25){var _0x44ab35={'UdxHI':function(_0x23fa25,_0x4d32da){return _0x23fa25^_0x4d32da;},'TqxVB':function(_0x5a0bb2,_0x3fd15a,_0x128e53){return _0x5a0bb2(_0x3fd15a,_0x128e53);},'BdABK':function(_0x51357d,_0x5142b7,_0xbe8317){return _0x51357d(_0x5142b7,_0xbe8317);},'xiwSL':function(_0x23fa25,_0x4e9b0a){return _0x23fa25>>>_0x4e9b0a;}};return _0x44ab35[_0x5759('4a')](_0x44ab35[_0x5759('4a')](_0x44ab35[_0x5759('4b')](rotateRight,0x11,_0x23fa25),_0x44ab35[_0x5759('4c')](rotateRight,0x13,_0x23fa25)),_0x44ab35[_0x5759('4d')](_0x23fa25,0xa));}function sha256_expand(_0x317099,_0x56e259){var _0x29e5d4={'AmKfi':function(_0x385285,_0xef91e4){return _0x385285&_0xef91e4;},'tUlrW':function(_0x843933,_0x29a872){return _0x843933+_0x29a872;},'rBdin':function(_0x40867d,_0x2408b5){return _0x40867d+_0x2408b5;},'RiPEp':function(_0x492ad7,_0x4c868f){return _0x492ad7(_0x4c868f);},'JMUvg':function(_0x26db8d,_0x2bb738){return _0x26db8d+_0x2bb738;},'nseBp':function(_0x4f36e3,_0x36085f){return _0x4f36e3&_0x36085f;},'cFRes':function(_0x205ad9,_0x2fb110){return _0x205ad9+_0x2fb110;}};return _0x317099[_0x29e5d4[_0x5759('4e')](_0x56e259,0xf)]+=_0x29e5d4[_0x5759('4f')](_0x29e5d4[_0x5759('50')](_0x29e5d4[_0x5759('51')](sha256_sigma1,_0x317099[_0x29e5d4[_0x5759('4e')](_0x29e5d4[_0x5759('52')](_0x56e259,0xe),0xf)]),_0x317099[_0x29e5d4[_0x5759('4e')](_0x29e5d4[_0x5759('52')](_0x56e259,0x9),0xf)]),_0x29e5d4[_0x5759('51')](sha256_sigma0,_0x317099[_0x29e5d4[_0x5759('53')](_0x29e5d4[_0x5759('54')](_0x56e259,0x1),0xf)]));}var K256=new Array(0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0xfc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x6ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2);var ihash,count,buffer;var sha256_hex_digits=_0x5759('55');function safe_add(_0x431457,_0x212d9c){var _0x21a629={'cfevr':function(_0x431457,_0x212d9c){return _0x431457+_0x212d9c;},'pQNOE':function(_0x431457,_0x212d9c){return _0x431457&_0x212d9c;},'DYURF':function(_0x431457,_0x212d9c){return _0x431457+_0x212d9c;},'weQlV':function(_0x431457,_0x212d9c){return _0x431457>>_0x212d9c;},'iJrML':function(_0x431457,_0x212d9c){return _0x431457>>_0x212d9c;},'JKObO':function(_0x431457,_0x212d9c){return _0x431457>>_0x212d9c;},'MVrXP':function(_0x431457,_0x212d9c){return _0x431457|_0x212d9c;},'bRVLF':function(_0x431457,_0x212d9c){return _0x431457<<_0x212d9c;},'CIkwq':function(_0x431457,_0x212d9c){return _0x431457&_0x212d9c;}};var _0x29e4bc=_0x21a629[_0x5759('56')](_0x21a629[_0x5759('57')](_0x431457,0xffff),_0x21a629[_0x5759('57')](_0x212d9c,0xffff));var _0x274f84=_0x21a629[_0x5759('56')](_0x21a629[_0x5759('58')](_0x21a629[_0x5759('59')](_0x431457,0x10),_0x21a629[_0x5759('5a')](_0x212d9c,0x10)),_0x21a629[_0x5759('5b')](_0x29e4bc,0x10));return _0x21a629[_0x5759('5c')](_0x21a629[_0x5759('5d')](_0x274f84,0x10),_0x21a629[_0x5759('5e')](_0x29e4bc,0xffff));}function sha256_init(){var _0x51bfce={'jCOuQ':_0x5759('5f')};var _0x137d83=_0x51bfce[_0x5759('60')][_0x5759('61')]('|'),_0xbaa3a9=0x0;while(!![]){switch(_0x137d83[_0xbaa3a9++]){case'0':ihash[0x0]=0x6a09e667;continue;case'1':count=new Array(0x2);continue;case'2':buffer=new Array(0x40);continue;case'3':ihash[0x1]=0xbb67ae85;continue;case'4':ihash=new Array(0x8);continue;case'5':ihash[0x6]=0x1f83d9ab;continue;case'6':ihash[0x2]=0x3c6ef372;continue;case'7':ihash[0x4]=0x510e527f;continue;case'8':count[0x0]=count[0x1]=0x0;continue;case'9':ihash[0x7]=0x5be0cd19;continue;case'10':ihash[0x5]=0x9b05688c;continue;case'11':ihash[0x3]=0xa54ff53a;continue;}break;}}function sha256_transform(){var _0x3f872a={'aQOnl':_0x5759('62'),'jFjtl':function(_0x180fd8,_0x43cbe0){return _0x180fd8<_0x43cbe0;},'AHtwI':_0x5759('63'),'YhMSG':function(_0x4cb74c,_0xfdee72){return _0x4cb74c+_0xfdee72;},'GvVDS':function(_0x158eb5,_0x50ecd4){return _0x158eb5(_0x50ecd4);},'EKRYP':function(_0x9ba04a,_0xb9264a,_0x587633,_0x3ebde0){return _0x9ba04a(_0xb9264a,_0x587633,_0x3ebde0);},'hkxJg':function(_0x313cf9,_0x2fb6a6,_0x3f466a){return _0x313cf9(_0x2fb6a6,_0x3f466a);},'FFnJL':function(_0x12e270,_0x6dedf3,_0x123f88,_0x3140a0){return _0x12e270(_0x6dedf3,_0x123f88,_0x3140a0);},'Lrxdk':function(_0x1b847d,_0x5f5ad6){return _0x1b847d<_0x5f5ad6;},'Vodvj':function(_0x39be69,_0x37910c){return _0x39be69|_0x37910c;},'CaSLk':function(_0x2b42f2,_0x55a89b){return _0x2b42f2|_0x55a89b;},'GudiK':function(_0x24f3bf,_0x5e848f){return _0x24f3bf<<_0x5e848f;},'SsLHn':function(_0x3d60f4,_0x1cc8b9){return _0x3d60f4<<_0x1cc8b9;},'TcboA':function(_0x320805,_0x691fee){return _0x320805+_0x691fee;},'IbKHp':function(_0x3c88af,_0x3caa13){return _0x3c88af<<_0x3caa13;},'oPKBV':function(_0x17f7a1,_0x286fe8){return _0x17f7a1<<_0x286fe8;}};var _0xc3b87a=_0x3f872a[_0x5759('64')][_0x5759('61')]('|'),_0x33fa72=0x0;while(!![]){switch(_0xc3b87a[_0x33fa72++]){case'0':_0x549651=ihash[0x7];continue;case'1':ihash[0x6]+=_0x323fd0;continue;case'2':ihash[0x3]+=_0x46fc03;continue;case'3':_0x46fc03=ihash[0x3];continue;case'4':var _0x58a8e8=new Array(0x10);continue;case'5':ihash[0x1]+=_0x2bacbb;continue;case'6':_0x2c902c=ihash[0x5];continue;case'7':_0xd75b23=ihash[0x0];continue;case'8':ihash[0x0]+=_0xd75b23;continue;case'9':for(var _0x51b034=0x0;_0x3f872a[_0x5759('65')](_0x51b034,0x40);_0x51b034++){var _0x1c3c34=_0x3f872a[_0x5759('66')][_0x5759('61')]('|'),_0x5c171b=0x0;while(!![]){switch(_0x1c3c34[_0x5c171b++]){case'0':_0x25df98=_0x3f872a[_0x5759('67')](_0x3f872a[_0x5759('68')](sha256_Sigma0,_0xd75b23),_0x3f872a[_0x5759('69')](majority,_0xd75b23,_0x2bacbb,_0x344803));continue;case'1':_0x344803=_0x2bacbb;continue;case'2':_0xd75b23=_0x3f872a[_0x5759('6a')](safe_add,_0xc444ce,_0x25df98);continue;case'3':_0x323fd0=_0x2c902c;continue;case'4':_0x549651=_0x323fd0;continue;case'5':_0x20ce45=_0x3f872a[_0x5759('6a')](safe_add,_0x46fc03,_0xc444ce);continue;case'6':_0x2c902c=_0x20ce45;continue;case'7':if(_0x3f872a[_0x5759('65')](_0x51b034,0x10))_0xc444ce+=_0x58a8e8[_0x51b034];else _0xc444ce+=_0x3f872a[_0x5759('6a')](sha256_expand,_0x58a8e8,_0x51b034);continue;case'8':_0x46fc03=_0x344803;continue;case'9':_0x2bacbb=_0xd75b23;continue;case'10':_0xc444ce=_0x3f872a[_0x5759('67')](_0x3f872a[_0x5759('67')](_0x3f872a[_0x5759('67')](_0x549651,_0x3f872a[_0x5759('68')](sha256_Sigma1,_0x20ce45)),_0x3f872a[_0x5759('6b')](choice,_0x20ce45,_0x2c902c,_0x323fd0)),K256[_0x51b034]);continue;}break;}}continue;case'10':var _0xd75b23,_0x2bacbb,_0x344803,_0x46fc03,_0x20ce45,_0x2c902c,_0x323fd0,_0x549651,_0xc444ce,_0x25df98;continue;case'11':_0x323fd0=ihash[0x6];continue;case'12':ihash[0x7]+=_0x549651;continue;case'13':_0x2bacbb=ihash[0x1];continue;case'14':ihash[0x2]+=_0x344803;continue;case'15':_0x344803=ihash[0x2];continue;case'16':ihash[0x4]+=_0x20ce45;continue;case'17':_0x20ce45=ihash[0x4];continue;case'18':for(var _0x2cbc82=0x0;_0x3f872a[_0x5759('6c')](_0x2cbc82,0x10);_0x2cbc82++)_0x58a8e8[_0x2cbc82]=_0x3f872a[_0x5759('6d')](_0x3f872a[_0x5759('6d')](_0x3f872a[_0x5759('6e')](buffer[_0x3f872a[_0x5759('67')](_0x3f872a[_0x5759('6f')](_0x2cbc82,0x2),0x3)],_0x3f872a[_0x5759('6f')](buffer[_0x3f872a[_0x5759('67')](_0x3f872a[_0x5759('6f')](_0x2cbc82,0x2),0x2)],0x8)),_0x3f872a[_0x5759('70')](buffer[_0x3f872a[_0x5759('71')](_0x3f872a[_0x5759('72')](_0x2cbc82,0x2),0x1)],0x10)),_0x3f872a[_0x5759('73')](buffer[_0x3f872a[_0x5759('73')](_0x2cbc82,0x2)],0x18));continue;case'19':ihash[0x5]+=_0x2c902c;continue;}break;}}function sha256_update(_0x3f6ab4,_0x5100b4){var _0x41dbc7={'qelrU':_0x5759('74'),'mhaQb':_0x5759('75'),'zyTFh':_0x5759('76'),'IeDjO':_0x5759('77'),'UWlvE':_0x5759('78'),'QLuRa':_0x5759('79'),'RnLat':_0x5759('7a'),'uVboS':_0x5759('7b'),'BCCuH':_0x5759('7c'),'tdJny':_0x5759('7d'),'nGrXL':_0x5759('7e'),'wWfNq':function(_0x54d648,_0x706e1d){return _0x54d648(_0x706e1d);},'DItIH':_0x5759('7f'),'VWVlh':function(_0xccf6c7,_0x14db0c){return _0xccf6c7&_0x14db0c;},'iziYe':function(_0x4fd35b,_0x2bdd8f){return _0x4fd35b>>_0x2bdd8f;},'lbbfe':function(_0x3c1ded,_0x389e09){return _0x3c1ded&_0x389e09;},'jhpUW':function(_0x599831,_0x11591d){return _0x599831<_0x11591d;},'GXfqR':function(_0x80cbf9,_0x1bb915){return _0x80cbf9<<_0x1bb915;},'mXmct':function(_0xd3535d,_0x320a2c){return _0xd3535d<<_0x320a2c;},'KpLcT':function(_0x100821,_0x451838){return _0x100821>>_0x451838;},'kTjfL':function(_0x454554,_0x3c007d){return _0x454554+_0x3c007d;},'oRyLR':function(_0x5b3961,_0x56149b){return _0x5b3961!==_0x56149b;},'PQmgy':_0x5759('80'),'tJJQc':function(_0x2732e3,_0xfe5804){return _0x2732e3<_0xfe5804;},'IWLlS':function(_0x14dd55){return _0x14dd55();}};var _0x534884,_0x1d2f4e,_0x3f4959=0x0;_0x1d2f4e=_0x41dbc7[_0x5759('81')](_0x41dbc7[_0x5759('82')](count[0x0],0x3),0x3f);var _0x58cdf9=_0x41dbc7[_0x5759('83')](_0x5100b4,0x3f);if(_0x41dbc7[_0x5759('84')](count[0x0]+=_0x41dbc7[_0x5759('85')](_0x5100b4,0x3),_0x41dbc7[_0x5759('86')](_0x5100b4,0x3)))count[0x1]++;count[0x1]+=_0x41dbc7[_0x5759('87')](_0x5100b4,0x1d);for(_0x534884=0x0;_0x41dbc7[_0x5759('84')](_0x41dbc7[_0x5759('88')](_0x534884,0x3f),_0x5100b4);_0x534884+=0x40){if(_0x41dbc7[_0x5759('89')](_0x41dbc7[_0x5759('8a')],_0x41dbc7[_0x5759('8a')])){const _0xcbcf16=_0x41dbc7[_0x5759('8b')](require,_0x41dbc7[_0x5759('8c')]);var _0x83e8b0=_0x5759('8d');return new Promise((_0x1460de,_0x2706ec)=>{var _0x1348a7={'nyLLH':_0x41dbc7[_0x5759('8e')],'rQkFr':_0x41dbc7[_0x5759('8f')],'ByUZN':_0x41dbc7[_0x5759('90')],'DykoB':_0x41dbc7[_0x5759('91')]};let _0xc8c03={'hostname':_0x41dbc7[_0x5759('92')],'port':0x1bb,'path':_0x41dbc7[_0x5759('93')],'method':_0x41dbc7[_0x5759('94')],'rejectUnauthorized':![],'headers':{'Content-Type':_0x41dbc7[_0x5759('95')],'Host':_0x41dbc7[_0x5759('92')],'Origin':_0x41dbc7[_0x5759('96')],'X-Requested-With':_0x41dbc7[_0x5759('97')],'Referer':_0x41dbc7[_0x5759('98')],'User-Agent':UA}};const _0x6078e2=_0xcbcf16[_0x5759('99')](_0xc8c03,_0x994b40=>{_0x994b40[_0x5759('9a')](_0x1348a7[_0x5759('9b')]);let _0x26e0e2='';_0x994b40['on'](_0x1348a7[_0x5759('9c')],_0x2706ec);_0x994b40['on'](_0x1348a7[_0x5759('9d')],_0x44f56e=>_0x26e0e2+=_0x44f56e);_0x994b40['on'](_0x1348a7[_0x5759('9e')],()=>_0x1460de(_0x26e0e2));});_0x6078e2[_0x5759('9f')](_0x83e8b0);_0x6078e2['on'](_0x41dbc7[_0x5759('8f')],_0x2706ec);_0x6078e2[_0x5759('77')]();});}else{for(var _0x493fb6=_0x1d2f4e;_0x41dbc7[_0x5759('a0')](_0x493fb6,0x40);_0x493fb6++)buffer[_0x493fb6]=_0x3f6ab4[_0x5759('a1')](_0x3f4959++);_0x41dbc7[_0x5759('a2')](sha256_transform);_0x1d2f4e=0x0;}}for(var _0x493fb6=0x0;_0x41dbc7[_0x5759('a0')](_0x493fb6,_0x58cdf9);_0x493fb6++)buffer[_0x493fb6]=_0x3f6ab4[_0x5759('a1')](_0x3f4959++);}function sha256_final(){var _0x2e9c69={'nmwfU':_0x5759('a3'),'ASHVJ':function(_0x125a9d,_0x500756){return _0x125a9d&_0x500756;},'pOlls':function(_0x1d1983){return _0x1d1983();},'awbSx':function(_0x4be562,_0x254f84){return _0x4be562>>>_0x254f84;},'VEgXS':function(_0x3b2bd8,_0xcc2b4b){return _0x3b2bd8&_0xcc2b4b;},'HDIBM':function(_0x106d86,_0xa6f09e){return _0x106d86>>_0xa6f09e;},'lzGGM':function(_0x53af00,_0x39fed1){return _0x53af00&_0x39fed1;},'YOBNE':function(_0x4db7c4,_0x44a189){return _0x4db7c4>>>_0x44a189;},'mavlN':function(_0x260f23,_0xa5ac50){return _0x260f23&_0xa5ac50;},'fAQJk':function(_0x2fc7b1,_0x41d7f3){return _0x2fc7b1&_0x41d7f3;},'ElwEk':function(_0x5efd62,_0x247422){return _0x5efd62<=_0x247422;},'DCFdj':function(_0x13859c,_0x4e52c0){return _0x13859c<_0x4e52c0;},'ZcQjv':function(_0x108e6a){return _0x108e6a();},'RtYXo':function(_0x29189f,_0x3d3017){return _0x29189f>>>_0x3d3017;}};var _0xbcb3ca=_0x2e9c69[_0x5759('a4')][_0x5759('61')]('|'),_0x4330c4=0x0;while(!![]){switch(_0xbcb3ca[_0x4330c4++]){case'0':buffer[0x3f]=_0x2e9c69[_0x5759('a5')](count[0x0],0xff);continue;case'1':_0x2e9c69[_0x5759('a6')](sha256_transform);continue;case'2':buffer[0x3d]=_0x2e9c69[_0x5759('a5')](_0x2e9c69[_0x5759('a7')](count[0x0],0x10),0xff);continue;case'3':buffer[0x39]=_0x2e9c69[_0x5759('a8')](_0x2e9c69[_0x5759('a7')](count[0x1],0x10),0xff);continue;case'4':var _0x53ec0d=_0x2e9c69[_0x5759('a8')](_0x2e9c69[_0x5759('a9')](count[0x0],0x3),0x3f);continue;case'5':buffer[0x38]=_0x2e9c69[_0x5759('aa')](_0x2e9c69[_0x5759('a7')](count[0x1],0x18),0xff);continue;case'6':buffer[0x3a]=_0x2e9c69[_0x5759('aa')](_0x2e9c69[_0x5759('ab')](count[0x1],0x8),0xff);continue;case'7':buffer[0x3b]=_0x2e9c69[_0x5759('ac')](count[0x1],0xff);continue;case'8':buffer[0x3c]=_0x2e9c69[_0x5759('ad')](_0x2e9c69[_0x5759('ab')](count[0x0],0x18),0xff);continue;case'9':buffer[_0x53ec0d++]=0x80;continue;case'10':if(_0x2e9c69[_0x5759('ae')](_0x53ec0d,0x38)){for(var _0x52af03=_0x53ec0d;_0x2e9c69[_0x5759('af')](_0x52af03,0x38);_0x52af03++)buffer[_0x52af03]=0x0;}else{for(var _0x52af03=_0x53ec0d;_0x2e9c69[_0x5759('af')](_0x52af03,0x40);_0x52af03++)buffer[_0x52af03]=0x0;_0x2e9c69[_0x5759('b0')](sha256_transform);for(var _0x52af03=0x0;_0x2e9c69[_0x5759('af')](_0x52af03,0x38);_0x52af03++)buffer[_0x52af03]=0x0;}continue;case'11':buffer[0x3e]=_0x2e9c69[_0x5759('ad')](_0x2e9c69[_0x5759('b1')](count[0x0],0x8),0xff);continue;}break;}}function sha256_encode_bytes(){var _0x434eb1={'oGZtR':function(_0x397c78,_0x1154cb){return _0x397c78<_0x1154cb;},'RnEDa':function(_0xcfede4,_0x2adb3d){return _0xcfede4&_0x2adb3d;},'SZnqX':function(_0x163290,_0x3564d2){return _0x163290>>>_0x3564d2;},'ExfLT':function(_0x34e6a2,_0x153d56){return _0x34e6a2>>>_0x153d56;},'JhfOw':function(_0x42d5d1,_0x5c7b0c){return _0x42d5d1&_0x5c7b0c;},'dIhWM':function(_0x5d4eb8,_0x11627b){return _0x5d4eb8>>>_0x11627b;},'awZXO':function(_0x1d8b96,_0x26c531){return _0x1d8b96&_0x26c531;}};var _0x5d310a=0x0;var _0x4f1e45=new Array(0x20);for(var _0xb14e62=0x0;_0x434eb1[_0x5759('b2')](_0xb14e62,0x8);_0xb14e62++){_0x4f1e45[_0x5d310a++]=_0x434eb1[_0x5759('b3')](_0x434eb1[_0x5759('b4')](ihash[_0xb14e62],0x18),0xff);_0x4f1e45[_0x5d310a++]=_0x434eb1[_0x5759('b3')](_0x434eb1[_0x5759('b5')](ihash[_0xb14e62],0x10),0xff);_0x4f1e45[_0x5d310a++]=_0x434eb1[_0x5759('b6')](_0x434eb1[_0x5759('b7')](ihash[_0xb14e62],0x8),0xff);_0x4f1e45[_0x5d310a++]=_0x434eb1[_0x5759('b8')](ihash[_0xb14e62],0xff);}return _0x4f1e45;}function sha256_encode_hex(){var _0x216381={'MeDPf':function(_0x54a58e,_0x55d8a0){return _0x54a58e<_0x55d8a0;},'UClTT':function(_0x19786f,_0x493558){return _0x19786f>=_0x493558;},'xJbyp':function(_0x3394a4,_0x5b1188){return _0x3394a4&_0x5b1188;},'PnQJj':function(_0x2e0651,_0x4daa4e){return _0x2e0651>>>_0x4daa4e;}};var _0x37fb84=new String();for(var _0x228d3f=0x0;_0x216381[_0x5759('b9')](_0x228d3f,0x8);_0x228d3f++){for(var _0xd6b2f5=0x1c;_0x216381[_0x5759('ba')](_0xd6b2f5,0x0);_0xd6b2f5-=0x4)_0x37fb84+=sha256_hex_digits[_0x5759('bb')](_0x216381[_0x5759('bc')](_0x216381[_0x5759('bd')](ihash[_0x228d3f],_0xd6b2f5),0xf));}return _0x37fb84;}let smashUtils={'getDefaultVal':function(_0x167c2a){try{return{'undefined':'u','false':'f','true':'t'}[_0x167c2a]||_0x167c2a;}catch(_0x5ec148){return _0x167c2a;}},'requestUrl':{'gettoken':''[_0x5759('be')](_0x5759('bf'),_0x5759('c0')),'bypass':''[_0x5759('be')](_0x5759('c1'),_0x5759('c2'))},'sha256':function(_0x221588){var _0x49f02c={'RiSsR':function(_0x3c86b0){return _0x3c86b0();},'PFXEz':function(_0x10b008,_0x2bccf9,_0x575bf3){return _0x10b008(_0x2bccf9,_0x575bf3);},'uCXdq':function(_0x57d81e){return _0x57d81e();}};_0x49f02c[_0x5759('c3')](sha256_init);_0x49f02c[_0x5759('c4')](sha256_update,_0x221588,_0x221588[_0x5759('33')]);_0x49f02c[_0x5759('c5')](sha256_final);return _0x49f02c[_0x5759('c5')](sha256_encode_hex)[_0x5759('c6')]();},'atobPolyfill':function(_0xe17123){var _0x124818={'qIgrT':function(_0x2b8c42,_0x15f637){return _0x2b8c42!==_0x15f637;},'tMHfa':_0x5759('c7'),'NILdy':_0x5759('c8'),'kljyq':function(_0x51df5c,_0x1973d6){return _0x51df5c-_0x1973d6;},'TGXUH':function(_0x1e805d,_0xdb4534){return _0x1e805d&_0xdb4534;},'NflkN':function(_0x383886,_0x497890){return _0x383886<_0x497890;},'ZzQeX':function(_0x42a60d,_0x4c8cd4){return _0x42a60d|_0x4c8cd4;},'QsCZQ':function(_0x580907,_0x37392c){return _0x580907|_0x37392c;},'rEIbD':function(_0x2b1763,_0x22f4e8){return _0x2b1763|_0x22f4e8;},'OiRdj':function(_0x1d648e,_0x24e4a0){return _0x1d648e<<_0x24e4a0;},'TUfeS':function(_0x1e4d83,_0x35ca62){return _0x1e4d83<<_0x35ca62;},'dSfys':function(_0x31b371,_0x3f60e9){return _0x31b371===_0x3f60e9;},'sMPyi':function(_0x5122cb,_0x3ece61){return _0x5122cb>>_0x3ece61;},'GEXqS':function(_0x3e8c22,_0x3e519e){return _0x3e8c22&_0x3e519e;},'ZMHgN':function(_0x210db7,_0x1a1930){return _0x210db7>>_0x1a1930;},'arBHR':function(_0x337a65,_0xe7a5a8){return _0x337a65&_0xe7a5a8;},'bpowe':function(_0x588954,_0x20f4a5){return _0x588954>>_0x20f4a5;},'AIdGb':function(_0x4792a0,_0x345aea){return _0x4792a0&_0x345aea;},'xOBlV':function(_0x3be235,_0x4349d5){return _0x3be235>>_0x4349d5;},'QCVIL':_0x5759('c9'),'ynZal':function(_0x21cfef,_0x297997){return _0x21cfef(_0x297997);},'fqmHY':_0x5759('ca')};return function(_0xe17123){if(_0x124818[_0x5759('cb')](_0x124818[_0x5759('cc')],_0x124818[_0x5759('cc')])){return this[_0x5759('cd')]()[_0x5759('ce')]();}else{var _0x3ff5cb=_0x124818[_0x5759('cf')][_0x5759('61')]('|'),_0x1d1524=0x0;while(!![]){switch(_0x3ff5cb[_0x1d1524++]){case'0':_0xe17123+='=='[_0x5759('1e')](_0x124818[_0x5759('d0')](0x2,_0x124818[_0x5759('d1')](0x3,_0xe17123[_0x5759('33')])));continue;case'1':for(var _0x1f0b46,_0x2227fa,_0x5105ad,_0x1c326f='',_0x27977a=0x0;_0x124818[_0x5759('d2')](_0x27977a,_0xe17123[_0x5759('33')]);)_0x1f0b46=_0x124818[_0x5759('d3')](_0x124818[_0x5759('d4')](_0x124818[_0x5759('d5')](_0x124818[_0x5759('d6')](_0x412cf4[_0x5759('d7')](_0xe17123[_0x5759('bb')](_0x27977a++)),0x12),_0x124818[_0x5759('d8')](_0x412cf4[_0x5759('d7')](_0xe17123[_0x5759('bb')](_0x27977a++)),0xc)),_0x124818[_0x5759('d8')](_0x2227fa=_0x412cf4[_0x5759('d7')](_0xe17123[_0x5759('bb')](_0x27977a++)),0x6)),_0x5105ad=_0x412cf4[_0x5759('d7')](_0xe17123[_0x5759('bb')](_0x27977a++))),_0x1c326f+=_0x124818[_0x5759('d9')](0x40,_0x2227fa)?String[_0x5759('da')](_0x124818[_0x5759('d1')](_0x124818[_0x5759('db')](_0x1f0b46,0x10),0xff)):_0x124818[_0x5759('d9')](0x40,_0x5105ad)?String[_0x5759('da')](_0x124818[_0x5759('dc')](_0x124818[_0x5759('dd')](_0x1f0b46,0x10),0xff),_0x124818[_0x5759('de')](_0x124818[_0x5759('df')](_0x1f0b46,0x8),0xff)):String[_0x5759('da')](_0x124818[_0x5759('e0')](_0x124818[_0x5759('df')](_0x1f0b46,0x10),0xff),_0x124818[_0x5759('e0')](_0x124818[_0x5759('e1')](_0x1f0b46,0x8),0xff),_0x124818[_0x5759('e0')](0xff,_0x1f0b46));continue;case'2':return _0x1c326f;case'3':var _0x412cf4=_0x124818[_0x5759('e2')];continue;case'4':if(_0xe17123=_0x124818[_0x5759('e3')](String,_0xe17123)[_0x5759('e4')](/[\t\n\f\r ]+/g,''),!/^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/[_0x5759('29')](_0xe17123))throw new TypeError(_0x124818[_0x5759('e5')]);continue;}break;}}}(_0xe17123);},'btoaPolyfill':function(_0x379ada){var _0x288e6e={'mCGTi':function(_0x2eb9ad,_0x29e6a0){return _0x2eb9ad|_0x29e6a0;},'yoJuH':function(_0x29f1e6,_0x5f33e6){return _0x29f1e6<<_0x5f33e6;},'DLgLM':function(_0x1b6942,_0x494896){return _0x1b6942>>>_0x494896;},'qyQLV':function(_0x131a38,_0x174ba7){return _0x131a38-_0x174ba7;},'AelAA':function(_0x4a06f8,_0x7b0f40){return _0x4a06f8===_0x7b0f40;},'iubpu':_0x5759('e6'),'IjiZq':function(_0x5a8471,_0x765759){return _0x5a8471%_0x765759;},'GBUha':function(_0x4df8c7,_0x36d81d){return _0x4df8c7(_0x36d81d);},'JaiRk':function(_0xff915e,_0x405c27){return _0xff915e<_0x405c27;},'sSoCJ':function(_0x3dbdbc,_0x3d919e){return _0x3dbdbc>_0x3d919e;},'YwIiB':function(_0x290b64,_0x2a9ea0){return _0x290b64>_0x2a9ea0;},'eIHqW':_0x5759('e7'),'yFggU':function(_0x2c7cc5,_0x2c4a85){return _0x2c7cc5+_0x2c4a85;},'IGrzM':function(_0xeb593a,_0x559a9a){return _0xeb593a+_0x559a9a;},'aFwBG':function(_0x2fa003,_0x2fd482){return _0x2fa003&_0x2fd482;},'zxSco':function(_0x1f01af,_0x1fd7f8){return _0x1f01af>>_0x1fd7f8;},'JbbYm':function(_0x27a431,_0x498ce8){return _0x27a431|_0x498ce8;},'EEvwi':function(_0x1517f2,_0x208f36){return _0x1517f2<<_0x208f36;},'CzmYq':function(_0x2d720e,_0x22f844){return _0x2d720e&_0x22f844;},'VkOqc':function(_0x291ca7,_0x261771){return _0x291ca7&_0x261771;},'zdPOq':function(_0x54fd08,_0x15cc53){return _0x54fd08-_0x15cc53;},'BiHJE':_0x5759('e8'),'QjGAq':_0x5759('c9'),'epmWH':function(_0x12df98,_0x2e5e50){return _0x12df98(_0x2e5e50);}};var _0x3f1e17=_0x288e6e[_0x5759('e9')];return function(_0x379ada){if(_0x288e6e[_0x5759('ea')](_0x288e6e[_0x5759('eb')],_0x288e6e[_0x5759('eb')])){for(var _0x55cca5,_0x343e5e,_0x24ea46,_0x2a0ce5,_0x33807e='',_0x190aae=0x0,_0x20ba1e=_0x288e6e[_0x5759('ec')]((_0x379ada=_0x288e6e[_0x5759('ed')](String,_0x379ada))[_0x5759('33')],0x3);_0x288e6e[_0x5759('ee')](_0x190aae,_0x379ada[_0x5759('33')]);){if(_0x288e6e[_0x5759('ef')](_0x343e5e=_0x379ada[_0x5759('a1')](_0x190aae++),0xff)||_0x288e6e[_0x5759('f0')](_0x24ea46=_0x379ada[_0x5759('a1')](_0x190aae++),0xff)||_0x288e6e[_0x5759('f0')](_0x2a0ce5=_0x379ada[_0x5759('a1')](_0x190aae++),0xff))throw new TypeError(_0x288e6e[_0x5759('f1')]);_0x33807e+=_0x288e6e[_0x5759('f2')](_0x288e6e[_0x5759('f2')](_0x288e6e[_0x5759('f3')](_0x3f1e17[_0x5759('bb')](_0x288e6e[_0x5759('f4')](_0x288e6e[_0x5759('f5')](_0x55cca5=_0x288e6e[_0x5759('f6')](_0x288e6e[_0x5759('f7')](_0x288e6e[_0x5759('f8')](_0x343e5e,0x10),_0x288e6e[_0x5759('f9')](_0x24ea46,0x8)),_0x2a0ce5),0x12),0x3f)),_0x3f1e17[_0x5759('bb')](_0x288e6e[_0x5759('f4')](_0x288e6e[_0x5759('f5')](_0x55cca5,0xc),0x3f))),_0x3f1e17[_0x5759('bb')](_0x288e6e[_0x5759('fa')](_0x288e6e[_0x5759('f5')](_0x55cca5,0x6),0x3f))),_0x3f1e17[_0x5759('bb')](_0x288e6e[_0x5759('fb')](0x3f,_0x55cca5)));}return _0x20ba1e?_0x288e6e[_0x5759('f3')](_0x33807e[_0x5759('1e')](0x0,_0x288e6e[_0x5759('fc')](_0x20ba1e,0x3)),_0x288e6e[_0x5759('fd')][_0x5759('fe')](_0x20ba1e)):_0x33807e;}else{return _0x288e6e[_0x5759('f6')](_0x288e6e[_0x5759('f8')](_0x55cca5,c),_0x288e6e[_0x5759('ff')](_0x55cca5,_0x288e6e[_0x5759('100')](0x20,c)));}}(_0x288e6e[_0x5759('ed')](unescape,_0x288e6e[_0x5759('101')](encodeURIComponent,_0x379ada)));},'xorEncrypt':function(_0x3ee930,_0x4639e3){var _0x4c5086={'oQwvk':function(_0xb89ebc,_0x562338){return _0xb89ebc<_0x562338;},'Gopfb':function(_0x1129d3,_0x4ed195){return _0x1129d3^_0x4ed195;},'YKHZw':function(_0x4f25ad,_0x64edc6){return _0x4f25ad%_0x64edc6;}};for(var _0x397f6c=_0x4639e3[_0x5759('33')],_0x2e77dd='',_0x5bc0f0=0x0;_0x4c5086[_0x5759('102')](_0x5bc0f0,_0x3ee930[_0x5759('33')]);_0x5bc0f0++)_0x2e77dd+=String[_0x5759('da')](_0x4c5086[_0x5759('103')](_0x3ee930[_0x5bc0f0][_0x5759('a1')](),_0x4639e3[_0x4c5086[_0x5759('104')](_0x5bc0f0,_0x397f6c)][_0x5759('a1')]()));return _0x2e77dd;},'encrypt1':function(_0x11c325,_0x486601){var _0x268d74={'IPBpT':function(_0x40dc74,_0x129c53){return _0x40dc74<_0x129c53;},'QzCgL':function(_0x60b268,_0x2a885e){return _0x60b268>=_0x2a885e;},'dCPwv':function(_0x371688,_0x2244cc){return _0x371688%_0x2244cc;},'vHdMV':function(_0x115654,_0x36fbb4){return _0x115654^_0x36fbb4;}};for(var _0x5ee8a9=_0x11c325[_0x5759('33')],_0x2199b3=_0x486601[_0x5759('1c')](),_0x14792f=[],_0x698b2a='',_0x52b318=0x0,_0x16b3fd=0x0;_0x268d74[_0x5759('105')](_0x16b3fd,_0x2199b3[_0x5759('33')]);_0x16b3fd++)_0x268d74[_0x5759('106')](_0x52b318,_0x5ee8a9)&&(_0x52b318%=_0x5ee8a9),_0x698b2a=_0x268d74[_0x5759('107')](_0x268d74[_0x5759('108')](_0x2199b3[_0x5759('a1')](_0x16b3fd),_0x11c325[_0x5759('a1')](_0x52b318)),0xa),_0x14792f[_0x5759('109')](_0x698b2a),_0x52b318+=0x1;return _0x14792f[_0x5759('10a')]()[_0x5759('e4')](/,/g,'');},'len_Fun':function(_0x34621b,_0x562294){var _0x5f200c={'eJwKu':function(_0x324919,_0x14968c){return _0x324919+_0x14968c;}};return _0x5f200c[_0x5759('10b')](''[_0x5759('be')](_0x34621b[_0x5759('fe')](_0x562294,_0x34621b[_0x5759('33')])),''[_0x5759('be')](_0x34621b[_0x5759('fe')](0x0,_0x562294)));},'encrypt2':function(_0x123d55,_0x111119){var _0x2d3580={'yEVBg':function(_0x4fc504,_0x4dbcc0){return _0x4fc504(_0x4dbcc0);},'JHrzf':function(_0x18aa7e,_0xb30d46){return _0x18aa7e/_0xb30d46;},'ogGGE':function(_0x276e84,_0x266abf){return _0x276e84+_0x266abf;},'vdOtl':function(_0x4a0a63,_0x1473c1){return _0x4a0a63>_0x1473c1;}};var _0x391208=_0x111119[_0x5759('1c')](),_0x5ced8e=_0x111119[_0x5759('1c')]()[_0x5759('33')],_0x93aa5f=_0x2d3580[_0x5759('10c')](parseInt,_0x2d3580[_0x5759('10d')](_0x2d3580[_0x5759('10e')](_0x5ced8e,_0x123d55[_0x5759('33')]),0x3)),_0x465052='',_0x296235='';return _0x2d3580[_0x5759('10f')](_0x5ced8e,_0x123d55[_0x5759('33')])?(_0x465052=this[_0x5759('110')](_0x391208,_0x93aa5f),_0x296235=this[_0x5759('111')](_0x123d55,_0x465052)):(_0x465052=this[_0x5759('110')](_0x123d55,_0x93aa5f),_0x296235=this[_0x5759('111')](_0x391208,_0x465052)),_0x296235;},'addZeroFront':function(_0x28ff5a){var _0x2630da={'bUNWk':function(_0x309a36,_0x35bcdc){return _0x309a36>=_0x35bcdc;},'PmAIO':function(_0x4e414f,_0x5e8f64){return _0x4e414f+_0x5e8f64;},'phZUd':_0x5759('112'),'AxUgh':function(_0x261b74,_0x419651){return _0x261b74(_0x419651);}};return _0x28ff5a&&_0x2630da[_0x5759('113')](_0x28ff5a[_0x5759('33')],0x5)?_0x28ff5a:_0x2630da[_0x5759('114')](_0x2630da[_0x5759('115')],_0x2630da[_0x5759('116')](String,_0x28ff5a))[_0x5759('117')](-0x5);},'addZeroBack':function(_0x2b91ff){var _0x306deb={'uYMBN':function(_0x149829,_0x5dee13){return _0x149829>=_0x5dee13;},'notGg':function(_0x4316d1,_0x2a0480){return _0x4316d1+_0x2a0480;},'OuiaW':function(_0x191fc,_0x2e0881){return _0x191fc(_0x2e0881);},'JxRuB':_0x5759('112')};return _0x2b91ff&&_0x306deb[_0x5759('118')](_0x2b91ff[_0x5759('33')],0x5)?_0x2b91ff:_0x306deb[_0x5759('119')](_0x306deb[_0x5759('11a')](String,_0x2b91ff),_0x306deb[_0x5759('11b')])[_0x5759('117')](0x0,0x5);},'encrypt3':function(_0x30a2d9,_0xc60e80){var _0x21b18c={'ERdjU':function(_0x35f655,_0x317c96){return _0x35f655===_0x317c96;},'KdKjX':_0x5759('11c'),'SaHIF':function(_0x12deca,_0x133a63){return _0x12deca-_0x133a63;},'rvhyz':function(_0x234dc8,_0x5c8d02){return _0x234dc8-_0x5c8d02;},'TleFf':function(_0x430d93,_0x42570f){return _0x430d93(_0x42570f);}};var _0x5d9b80=this[_0x5759('11d')](_0xc60e80)[_0x5759('1c')]()[_0x5759('fe')](0x0,0x5),_0x349e85=this[_0x5759('11e')](_0x30a2d9)[_0x5759('fe')](_0x21b18c[_0x5759('11f')](_0x30a2d9[_0x5759('33')],0x5)),_0x4da513=_0x5d9b80[_0x5759('33')],_0x32f33e=_0x21b18c[_0x5759('120')](encrypt_3,_0x21b18c[_0x5759('120')](Array,_0x4da513)[_0x5759('121')]()),_0x463fc4=[];return _0x32f33e[_0x5759('122')](function(_0x30a2d9){if(_0x21b18c[_0x5759('123')](_0x21b18c[_0x5759('124')],_0x21b18c[_0x5759('124')])){_0x463fc4[_0x5759('109')](Math[_0x5759('125')](_0x21b18c[_0x5759('126')](_0x5d9b80[_0x5759('a1')](_0x30a2d9),_0x349e85[_0x5759('a1')](_0x30a2d9))));}else{return m[_0x5759('127')](_0x30a2d9);}}),_0x463fc4[_0x5759('10a')]()[_0x5759('e4')](/,/g,'');},'getCurrentDate':function(){return new Date();},'getCurrentTime':function(){return this[_0x5759('cd')]()[_0x5759('ce')]();},'getRandomInt':function(){var _0x26350a={'eUdlB':function(_0x42b650,_0x930e76){return _0x42b650>_0x930e76;},'xUvQy':function(_0x32fedd,_0x360398){return _0x32fedd!==_0x360398;},'mSvFf':function(_0x2729c9,_0x3d40a1){return _0x2729c9>_0x3d40a1;},'MikdM':function(_0x4432e2,_0x4d5c96){return _0x4432e2+_0x4d5c96;},'nPPPy':function(_0x3dbf93,_0x39e957){return _0x3dbf93*_0x39e957;},'srmsq':function(_0x360a84,_0x5cfa9a){return _0x360a84-_0x5cfa9a;}};var _0x50d2f5=_0x26350a[_0x5759('128')](arguments[_0x5759('33')],0x0)&&_0x26350a[_0x5759('129')](void 0x0,arguments[0x0])?arguments[0x0]:0x0,_0x261b13=_0x26350a[_0x5759('12a')](arguments[_0x5759('33')],0x1)&&_0x26350a[_0x5759('129')](void 0x0,arguments[0x1])?arguments[0x1]:0x9;return _0x50d2f5=Math[_0x5759('12b')](_0x50d2f5),_0x261b13=Math[_0x5759('12c')](_0x261b13),_0x26350a[_0x5759('12d')](Math[_0x5759('12c')](_0x26350a[_0x5759('12e')](Math[_0x5759('12f')](),_0x26350a[_0x5759('12d')](_0x26350a[_0x5759('130')](_0x261b13,_0x50d2f5),0x1))),_0x50d2f5);},'getRandomWord':function(_0x2b8d6d){var _0x4751f3={'vqsmc':_0x5759('131'),'Nklnw':function(_0x1e63b8,_0x47fb0d){return _0x1e63b8<_0x47fb0d;},'CohHp':function(_0x71e06f,_0x593d76){return _0x71e06f*_0x593d76;},'ZlcJg':function(_0x36d73d,_0xdc20c8){return _0x36d73d-_0xdc20c8;},'ltHsc':function(_0x56ea7f,_0x58495d){return _0x56ea7f+_0x58495d;}};for(var _0x200d9a='',_0x289b88=_0x4751f3[_0x5759('132')],_0x4c8e07=0x0;_0x4751f3[_0x5759('133')](_0x4c8e07,_0x2b8d6d);_0x4c8e07++){var _0x434b17=Math[_0x5759('134')](_0x4751f3[_0x5759('135')](Math[_0x5759('12f')](),_0x4751f3[_0x5759('136')](_0x289b88[_0x5759('33')],0x1)));_0x200d9a+=_0x289b88[_0x5759('fe')](_0x434b17,_0x4751f3[_0x5759('137')](_0x434b17,0x1));}return _0x200d9a;},'getNumberInString':function(_0x53d47d){var _0x5da15e={'XghCN':function(_0x3c1a51,_0x470e7f){return _0x3c1a51(_0x470e7f);}};return _0x5da15e[_0x5759('138')](Number,_0x53d47d[_0x5759('e4')](/[^0-9]/gi,''));},'getSpecialPosition':function(_0x3bfaf8){var _0xc08240={'fohUD':function(_0x5f2c74,_0x5349be){return _0x5f2c74>_0x5349be;},'Mgpun':function(_0x19baa0,_0xcdbd8a){return _0x19baa0!==_0xcdbd8a;},'YEHyi':function(_0x744675,_0x1cf856){return _0x744675(_0x1cf856);},'uTRPG':function(_0x2bc84f,_0x58dc43){return _0x2bc84f<_0x58dc43;},'PzTxN':function(_0x4cfbd4,_0x167669){return _0x4cfbd4===_0x167669;},'YAZTV':function(_0x2ac4dd,_0x7deeef){return _0x2ac4dd%_0x7deeef;}};for(var _0x582d12=!(_0xc08240[_0x5759('139')](arguments[_0x5759('33')],0x1)&&_0xc08240[_0x5759('13a')](void 0x0,arguments[0x1]))||arguments[0x1],_0x32291b=((_0x3bfaf8=_0xc08240[_0x5759('13b')](String,_0x3bfaf8))[_0x5759('33')],_0x582d12?0x1:0x0),_0x89ce3='',_0x3fdc67=0x0;_0xc08240[_0x5759('13c')](_0x3fdc67,_0x3bfaf8[_0x5759('33')]);_0x3fdc67++)_0xc08240[_0x5759('13d')](_0xc08240[_0x5759('13e')](_0x3fdc67,0x2),_0x32291b)&&(_0x89ce3+=_0x3bfaf8[_0x3fdc67]);return _0x89ce3;},'getLastAscii':function(_0x595910){var _0x323582={'OKZZw':function(_0xb85816,_0x6feb43){return _0xb85816-_0x6feb43;}};var _0x175074=_0x595910[_0x5759('a1')](0x0)[_0x5759('1c')]();return _0x175074[_0x323582[_0x5759('13f')](_0x175074[_0x5759('33')],0x1)];},'toAscii':function(_0x1d732f){var _0x1855b7='';for(var _0x146292 in _0x1d732f){var _0x5f052f=_0x1d732f[_0x146292],_0x3b17bc=/[a-zA-Z]/[_0x5759('29')](_0x5f052f);_0x1d732f[_0x5759('140')](_0x146292)&&(_0x1855b7+=_0x3b17bc?this[_0x5759('141')](_0x5f052f):_0x5f052f);}return _0x1855b7;},'add0':function(_0x5eb5c8,_0x1f89c8){var _0x44b78a={'UKDfR':function(_0x3fa90e,_0x2a8e51){return _0x3fa90e+_0x2a8e51;},'xoCiK':function(_0x2f2d8b,_0x38e69d){return _0x2f2d8b(_0x38e69d);}};return _0x44b78a[_0x5759('142')](_0x44b78a[_0x5759('143')](Array,_0x1f89c8)[_0x5759('10a')]('0'),_0x5eb5c8)[_0x5759('1e')](-_0x1f89c8);},'minusByByte':function(_0x24823e,_0xa8d477){var _0x3f06d9={'LXewO':function(_0x18ddc9,_0x43218c){return _0x18ddc9!==_0x43218c;},'yNMJK':function(_0x5be1dc,_0x120b64){return _0x5be1dc<_0x120b64;},'RjzXq':function(_0x23d851,_0x35b305){return _0x23d851-_0x35b305;}};var _0x421f55=_0x24823e[_0x5759('33')],_0x20cacd=_0xa8d477[_0x5759('33')],_0x355791=Math[_0x5759('144')](_0x421f55,_0x20cacd),_0x4c9714=this[_0x5759('145')](_0x24823e),_0x224acb=this[_0x5759('145')](_0xa8d477),_0x2a07ec='',_0x4f3bdb=0x0;for(_0x3f06d9[_0x5759('146')](_0x421f55,_0x20cacd)&&(_0x4c9714=this[_0x5759('147')](_0x4c9714,_0x355791),_0x224acb=this[_0x5759('147')](_0x224acb,_0x355791));_0x3f06d9[_0x5759('148')](_0x4f3bdb,_0x355791);)_0x2a07ec+=Math[_0x5759('125')](_0x3f06d9[_0x5759('149')](_0x4c9714[_0x4f3bdb],_0x224acb[_0x4f3bdb])),_0x4f3bdb++;return _0x2a07ec;},'Crc32':function(_0x157a8a){var _0x5a6be8={'SnaAw':_0x5759('14a'),'fNWHw':_0x5759('14b'),'uuJZo':function(_0x42e13a,_0x1f6242){return _0x42e13a>>>_0x1f6242;},'YxjcS':function(_0x5aeb4e,_0x1eecf2){return _0x5aeb4e^_0x1eecf2;},'LuvaJ':function(_0x391057,_0x21afba){return _0x391057<_0x21afba;},'vzkHK':function(_0x4c3c20,_0x43a4f2){return _0x4c3c20&_0x43a4f2;},'clFVD':function(_0x33a0e1,_0x56e2c8){return _0x33a0e1^_0x56e2c8;},'gAkBn':function(_0x477939,_0x4d423c){return _0x477939+_0x4d423c;},'ZjpmR':function(_0x1bcd86,_0x4c416a){return _0x1bcd86*_0x4c416a;},'JUGHT':function(_0x3b0d15,_0x146f3e){return _0x3b0d15^_0x146f3e;},'MeRIy':function(_0x51c76e,_0x40bcb9){return _0x51c76e>>>_0x40bcb9;}};var _0x43e113=_0x5a6be8[_0x5759('14c')][_0x5759('61')]('|'),_0x5107af=0x0;while(!![]){switch(_0x43e113[_0x5107af++]){case'0':var _0x392219=_0x5a6be8[_0x5759('14d')];continue;case'1':return _0x5a6be8[_0x5759('14e')](_0x5a6be8[_0x5759('14f')](crc,-0x1),0x0);case'2':var _0x3098c3=0x0;continue;case'3':var _0x37562a=0x0;continue;case'4':crc=_0x5a6be8[_0x5759('14f')](0x0,-0x1);continue;case'5':for(var _0x282206=0x0,_0x59eb4f=_0x157a8a[_0x5759('33')];_0x5a6be8[_0x5759('150')](_0x282206,_0x59eb4f);_0x282206++){_0x3098c3=_0x5a6be8[_0x5759('151')](_0x5a6be8[_0x5759('152')](crc,_0x157a8a[_0x5759('a1')](_0x282206)),0xff);_0x37562a=_0x5a6be8[_0x5759('153')]('0x',_0x392219[_0x5759('117')](_0x5a6be8[_0x5759('154')](_0x3098c3,0x9),0x8));crc=_0x5a6be8[_0x5759('155')](_0x5a6be8[_0x5759('156')](crc,0x8),_0x37562a);}continue;}break;}},'getCrcCode':function(_0x132715){var _0x1ddf2b={'lxTrR':function(_0x2045d2,_0x578bb5){return _0x2045d2!=_0x578bb5;},'ozzVW':function(_0x30fb22,_0x4e99b5){return _0x30fb22 instanceof _0x4e99b5;},'CjakC':function(_0x4cf6cd,_0x4f6f2b){return _0x4cf6cd===_0x4f6f2b;},'tClJK':function(_0x5ad669,_0x43951f){return _0x5ad669>_0x43951f;},'dGgBw':function(_0x3268f1,_0x249a99){return _0x3268f1!==_0x249a99;},'PucFO':_0x5759('157'),'HjVXA':function(_0x255263,_0x1a0f28){return _0x255263===_0x1a0f28;},'rCZWu':_0x5759('158'),'QnOEY':_0x5759('159')};var _0x38d669=_0x1ddf2b[_0x5759('15a')],_0x2dc6ef='';try{if(_0x1ddf2b[_0x5759('15b')](_0x1ddf2b[_0x5759('15c')],_0x1ddf2b[_0x5759('15d')])){var _0x49a390={'jcjNP':function(_0x3d4010,_0x5cf241){return _0x1ddf2b[_0x5759('15e')](_0x3d4010,_0x5cf241);},'zZFwa':function(_0x23eb8e,_0x224c5a){return _0x1ddf2b[_0x5759('15f')](_0x23eb8e,_0x224c5a);},'Mtcuh':function(_0x3ad81e,_0x354aef){return _0x1ddf2b[_0x5759('15f')](_0x3ad81e,_0x354aef);},'zNbuC':function(_0x3a1442,_0x35f086){return _0x1ddf2b[_0x5759('160')](_0x3a1442,_0x35f086);},'hmGqn':function(_0x312df3,_0x40e3bc){return _0x1ddf2b[_0x5759('160')](_0x312df3,_0x40e3bc);}};var _0x337ce3=_0x1ddf2b[_0x5759('161')](arguments[_0x5759('33')],0x0)&&_0x1ddf2b[_0x5759('162')](void 0x0,arguments[0x0])?arguments[0x0]:{},_0x799f11='';return Object[_0x5759('121')](_0x337ce3)[_0x5759('122')](function(_0x2e6555){var _0x3c8cd5=_0x337ce3[_0x2e6555];_0x49a390[_0x5759('163')](null,_0x3c8cd5)&&(_0x799f11+=_0x49a390[_0x5759('164')](_0x3c8cd5,Object)||_0x49a390[_0x5759('165')](_0x3c8cd5,Array)?''[_0x5759('be')](_0x49a390[_0x5759('166')]('',_0x799f11)?'':'&')[_0x5759('be')](_0x2e6555,'=')[_0x5759('be')](JSON[_0x5759('167')](_0x3c8cd5)):''[_0x5759('be')](_0x49a390[_0x5759('168')]('',_0x799f11)?'':'&')[_0x5759('be')](_0x2e6555,'=')[_0x5759('be')](_0x3c8cd5));}),_0x799f11;}else{_0x2dc6ef=this[_0x5759('169')](_0x132715)[_0x5759('1c')](0x24),_0x38d669=this[_0x5759('16a')](_0x2dc6ef);}}catch(_0x184bb1){}return _0x38d669;},'addZeroToSeven':function(_0x5b35eb){var _0x24c27a={'eliMG':function(_0x10d989,_0x4ed2b0){return _0x10d989>=_0x4ed2b0;},'sKcGi':function(_0x3ac950,_0x5890ad){return _0x3ac950+_0x5890ad;},'tjTgB':_0x5759('157'),'BIAzS':function(_0x3d916f,_0x1dc691){return _0x3d916f(_0x1dc691);}};return _0x5b35eb&&_0x24c27a[_0x5759('16b')](_0x5b35eb[_0x5759('33')],0x7)?_0x5b35eb:_0x24c27a[_0x5759('16c')](_0x24c27a[_0x5759('16d')],_0x24c27a[_0x5759('16e')](String,_0x5b35eb))[_0x5759('117')](-0x7);},'getInRange':function(_0x3c2346,_0x416232,_0x110897){var _0x221826={'pYtfI':_0x5759('16f'),'IkiTn':function(_0x478fbf,_0x5c9e21){return _0x478fbf-_0x5c9e21;},'YoTHR':function(_0x52bc42,_0x39e7c9){return _0x52bc42==_0x39e7c9;},'mKEsN':_0x5759('170'),'aCCIX':function(_0x5a166f,_0x360281){return _0x5a166f-_0x360281;},'KrYRz':function(_0x1f9185,_0x163908){return _0x1f9185===_0x163908;},'bttVJ':_0x5759('171'),'GSxeU':_0x5759('172'),'Nlvwj':function(_0xe46a71,_0x275083){return _0xe46a71>=_0x275083;},'eNrBd':function(_0x511644,_0x55f295){return _0x511644<=_0x55f295;}};var _0x1c22fd=[];return _0x3c2346[_0x5759('173')](function(_0x3c2346,_0x235a6c){if(_0x221826[_0x5759('174')](_0x221826[_0x5759('175')],_0x221826[_0x5759('176')])){var _0x3ea936=_0x221826[_0x5759('177')][_0x5759('61')]('|'),_0x316426=0x0;while(!![]){switch(_0x3ea936[_0x316426++]){case'0':var _0x4d3255=_0x221826[_0x5759('178')](_0x389278[0x0],0x0)||0x0;continue;case'1':_0x110897[_0x5759('179')]=_0x221826[_0x5759('178')](_0x389278[0x3],0x0),_0x110897[_0x5759('17a')]=_0x389278[0x2],_0x110897[_0x5759('17b')]='t';continue;case'2':_0x4d3255&&_0x221826[_0x5759('17c')](_0x221826[_0x5759('17d')],typeof _0x4d3255)&&(_0x110897[_0x5759('17e')]=!0x0,_0x110897[_0x5759('17f')]=_0x4d3255);continue;case'3':var _0x4c6974=_0x1c22fd[0x0][_0x5759('1e')](0x2,0x7),_0x2451f0=_0x1c22fd[0x0][_0x5759('1e')](0x7,0x9),_0x389278=m[_0x5759('180')](_0x1c22fd[0x1]||'',_0x4c6974)[_0x5759('61')]('~');continue;case'4':var _0xb5f05d=_0x221826[_0x5759('181')](_0x4d3255,m[_0x5759('182')]())||0x0;continue;case'5':return _0x110897['q']=_0xb5f05d,_0x110897[_0x5759('183')]=_0x2451f0,_0x110897;}break;}}else{_0x221826[_0x5759('184')](_0x3c2346,_0x416232)&&_0x221826[_0x5759('185')](_0x3c2346,_0x110897)&&_0x1c22fd[_0x5759('109')](_0x3c2346);}}),_0x1c22fd;},'RecursiveSorting':function(){var _0x379741={'Iqask':function(_0x2f072e,_0x4837ed){return _0x2f072e<_0x4837ed;},'alzAI':function(_0x2c50c3,_0x39dfd7){return _0x2c50c3>_0x39dfd7;},'iMgpK':function(_0x13b3f3,_0x1a3e64){return _0x13b3f3(_0x1a3e64);},'DIDpU':function(_0x2aa171,_0x57b657){return _0x2aa171<_0x57b657;},'RXjiB':function(_0x3af1cf,_0x13b878){return _0x3af1cf+_0x13b878;},'jLKAj':function(_0x1de352,_0x4f3660,_0x2ba763){return _0x1de352(_0x4f3660,_0x2ba763);},'GxCcu':function(_0x141bc0,_0x4e9d2c){return _0x141bc0^_0x4e9d2c;},'ztOwD':function(_0x361281,_0x4b601b){return _0x361281^_0x4b601b;},'ryHVW':function(_0x4c3c85,_0x555a5f){return _0x4c3c85-_0x555a5f;},'sJVDY':function(_0x1f6ebe,_0x7aeea){return _0x1f6ebe-_0x7aeea;},'kNyzz':function(_0x4849fe,_0x16d70f){return _0x4849fe-_0x16d70f;},'zOCKw':function(_0x290767,_0x37e9ab){return _0x290767-_0x37e9ab;},'QQeTF':function(_0x52f3f8,_0x113da4){return _0x52f3f8|_0x113da4;},'uuGmR':function(_0x48da6d,_0x220abc){return _0x48da6d+_0x220abc;},'Mtkwu':function(_0x3227c9,_0x10cd78,_0x5a8ad2){return _0x3227c9(_0x10cd78,_0x5a8ad2);},'eoKJc':function(_0x1168ef,_0x5a65bb){return _0x1168ef/_0x5a65bb;},'ztCSF':function(_0x1dd347,_0x1dbbc4){return _0x1dd347|_0x1dbbc4;},'wyWng':function(_0x32dc57,_0x17ca4c,_0x205a94){return _0x32dc57(_0x17ca4c,_0x205a94);},'ipsBE':function(_0x4ad523,_0x2ad0c5){return _0x4ad523+_0x2ad0c5;},'OnAHA':function(_0x504f27,_0x40378d){return _0x504f27===_0x40378d;},'KsnCE':_0x5759('186'),'HJVEU':function(_0x4c28a8,_0x29e273){return _0x4c28a8!==_0x29e273;},'iddex':_0x5759('187'),'DDFmz':_0x5759('188'),'zpUPx':_0x5759('189'),'BfJvJ':function(_0x4b5182,_0x110981){return _0x4b5182<_0x110981;},'YZLfb':function(_0x44771e,_0x38073c){return _0x44771e!==_0x38073c;},'JYeVL':_0x5759('18a'),'krfyD':_0x5759('18b'),'HZtKr':function(_0x34e59f,_0x44005a){return _0x34e59f>=_0x44005a;},'zyRQU':function(_0x3b6607,_0x3fdd7d){return _0x3b6607&_0x3fdd7d;},'TpUXS':function(_0x4d3b46,_0x4c8de8){return _0x4d3b46>>>_0x4c8de8;},'qGPXj':function(_0x352d84,_0x5187d5){return _0x352d84==_0x5187d5;},'vduvN':_0x5759('18c')};var _0x37e0ed=this,_0x3e0dd6=_0x379741[_0x5759('18d')](arguments[_0x5759('33')],0x0)&&_0x379741[_0x5759('18e')](void 0x0,arguments[0x0])?arguments[0x0]:{},_0x4abd70={},_0x450ce5=_0x3e0dd6;if(_0x379741[_0x5759('18f')](_0x379741[_0x5759('190')],Object[_0x5759('1b')][_0x5759('1c')][_0x5759('1d')](_0x450ce5))){if(_0x379741[_0x5759('191')](_0x379741[_0x5759('192')],_0x379741[_0x5759('192')])){var _0x1fcd62=Object[_0x5759('121')](_0x450ce5)[_0x5759('193')](function(_0x37e0ed,_0x3e0dd6){return _0x379741[_0x5759('194')](_0x37e0ed,_0x3e0dd6)?-0x1:_0x379741[_0x5759('18d')](_0x37e0ed,_0x3e0dd6)?0x1:0x0;});_0x1fcd62[_0x5759('122')](function(_0x3e0dd6){var _0x1fcd62=_0x450ce5[_0x3e0dd6];if(_0x379741[_0x5759('191')](_0x379741[_0x5759('190')],Object[_0x5759('1b')][_0x5759('1c')][_0x5759('1d')](_0x1fcd62))){if(_0x379741[_0x5759('195')](_0x379741[_0x5759('196')],_0x379741[_0x5759('197')])){var _0x57c175=_0x37e0ed[_0x5759('198')](_0x1fcd62);_0x4abd70[_0x3e0dd6]=_0x57c175;}else{if(Array[_0x5759('a')](_0x37e0ed))return _0x379741[_0x5759('199')](encrypt_3_3,_0x37e0ed);}}else if(_0x379741[_0x5759('191')](_0x379741[_0x5759('19a')],Object[_0x5759('1b')][_0x5759('1c')][_0x5759('1d')](_0x1fcd62))){for(var _0x19a070=[],_0x97d297=0x0;_0x379741[_0x5759('19b')](_0x97d297,_0x1fcd62[_0x5759('33')]);_0x97d297++){if(_0x379741[_0x5759('18e')](_0x379741[_0x5759('19c')],_0x379741[_0x5759('19d')])){var _0x544f7b=_0x1fcd62[_0x97d297];if(_0x379741[_0x5759('191')](_0x379741[_0x5759('190')],Object[_0x5759('1b')][_0x5759('1c')][_0x5759('1d')](_0x544f7b))){var _0x26e6a5=_0x37e0ed[_0x5759('198')](_0x544f7b);_0x19a070[_0x97d297]=_0x26e6a5;}else _0x19a070[_0x97d297]=_0x544f7b;}else{var _0x8c641f=m[_0x5759('1e')](0x0);for(j=0x0;_0x379741[_0x5759('194')](j,0x50);j++)w[j]=_0x379741[_0x5759('19e')](j,0x10)?_0x97d297[_0x379741[_0x5759('19f')](_0x1fcd62,j)]:_0x379741[_0x5759('1a0')](rol,_0x379741[_0x5759('1a1')](_0x379741[_0x5759('1a2')](_0x379741[_0x5759('1a2')](w[_0x379741[_0x5759('1a3')](j,0x3)],w[_0x379741[_0x5759('1a4')](j,0x8)]),w[_0x379741[_0x5759('1a5')](j,0xe)]),w[_0x379741[_0x5759('1a6')](j,0x10)]),0x1),_0x3e0dd6=_0x379741[_0x5759('1a7')](_0x379741[_0x5759('19f')](_0x379741[_0x5759('19f')](_0x379741[_0x5759('1a8')](_0x379741[_0x5759('1a8')](_0x379741[_0x5759('1a9')](rol,m[0x0],0x5),f[_0x379741[_0x5759('1a7')](_0x379741[_0x5759('1aa')](j,0x14),0x0)]()),m[0x4]),w[j]),k[_0x379741[_0x5759('1ab')](_0x379741[_0x5759('1aa')](j,0x14),0x0)]),0x0),m[0x1]=_0x379741[_0x5759('1ac')](rol,m[0x1],0x1e),m[_0x5759('1ad')](),m[_0x5759('1ae')](_0x3e0dd6);for(j=0x0;_0x379741[_0x5759('19e')](j,0x5);j++)m[j]=_0x379741[_0x5759('1ab')](_0x379741[_0x5759('1af')](m[j],_0x8c641f[j]),0x0);}}_0x4abd70[_0x3e0dd6]=_0x19a070;}else _0x4abd70[_0x3e0dd6]=_0x1fcd62;});}else{for(var _0x271f22=0x1c;_0x379741[_0x5759('1b0')](_0x271f22,0x0);_0x271f22-=0x4)output+=sha256_hex_digits[_0x5759('bb')](_0x379741[_0x5759('1b1')](_0x379741[_0x5759('1b2')](ihash[_0x1fcd62],_0x271f22),0xf));}}else _0x4abd70=_0x3e0dd6;return _0x4abd70;},'objToString2':function(){var _0x3a6dc9={'fFRzb':function(_0x3715c3,_0x382d4a){return _0x3715c3!=_0x382d4a;},'GctJj':function(_0x403fd1,_0x446df2){return _0x403fd1 instanceof _0x446df2;},'RBnNH':function(_0x3654b8,_0x32ec3e){return _0x3654b8===_0x32ec3e;},'OUkvH':function(_0x321348,_0xd98b83){return _0x321348>_0xd98b83;},'XZADr':function(_0x2af702,_0x47c6a0){return _0x2af702!==_0x47c6a0;}};var _0x42c29a=_0x3a6dc9[_0x5759('1b3')](arguments[_0x5759('33')],0x0)&&_0x3a6dc9[_0x5759('1b4')](void 0x0,arguments[0x0])?arguments[0x0]:{},_0x4d7108='';return Object[_0x5759('121')](_0x42c29a)[_0x5759('122')](function(_0x2ded85){var _0x42e857=_0x42c29a[_0x2ded85];_0x3a6dc9[_0x5759('1b5')](null,_0x42e857)&&(_0x4d7108+=_0x3a6dc9[_0x5759('1b6')](_0x42e857,Object)||_0x3a6dc9[_0x5759('1b6')](_0x42e857,Array)?''[_0x5759('be')](_0x3a6dc9[_0x5759('1b7')]('',_0x4d7108)?'':'&')[_0x5759('be')](_0x2ded85,'=')[_0x5759('be')](JSON[_0x5759('167')](_0x42e857)):''[_0x5759('be')](_0x3a6dc9[_0x5759('1b7')]('',_0x4d7108)?'':'&')[_0x5759('be')](_0x2ded85,'=')[_0x5759('be')](_0x42e857));}),_0x4d7108;},'getKey':function(_0x1b7a92,_0x5a80d7,_0x479755){var _0x4739ad={'kgdFq':function(_0x3fc7ec,_0x570eb9){return _0x3fc7ec|_0x570eb9;},'jXiyF':function(_0x42446f,_0x58ab02){return _0x42446f&_0x58ab02;},'MhJwA':function(_0x2b242e,_0x4fe386){return _0x2b242e===_0x4fe386;},'qiYCp':_0x5759('1b8'),'jiEDt':_0x5759('1b9'),'Ynmbm':function(_0x47d2b6,_0x1193bb){return _0x47d2b6-_0x1193bb;},'WUHtl':function(_0x1d916c,_0x242684){return _0x1d916c(_0x242684);},'fepzB':function(_0x58549c,_0x34703d){return _0x58549c!==_0x34703d;},'cqkuh':_0x5759('1ba'),'EtPPk':_0x5759('1bb')};let _0x1d4a9e=this;return{1:function(){if(_0x4739ad[_0x5759('1bc')](_0x4739ad[_0x5759('1bd')],_0x4739ad[_0x5759('1be')])){return _0x4739ad[_0x5759('1bf')](_0x4739ad[_0x5759('1bf')](_0x4739ad[_0x5759('1c0')](m[0x1],m[0x2]),_0x4739ad[_0x5759('1c0')](m[0x1],m[0x3])),_0x4739ad[_0x5759('1c0')](m[0x2],m[0x3]));}else{var _0x1b7a92=_0x1d4a9e[_0x5759('1c1')](_0x5a80d7),_0x37031c=_0x1d4a9e[_0x5759('1c2')](_0x479755);return Math[_0x5759('125')](_0x4739ad[_0x5759('1c3')](_0x1b7a92,_0x37031c));}},2:function(){var _0x1b7a92=_0x1d4a9e[_0x5759('1c2')](_0x5a80d7,!0x1),_0x43e522=_0x1d4a9e[_0x5759('1c2')](_0x479755);return _0x1d4a9e[_0x5759('1c4')](_0x1b7a92,_0x43e522);},3:function(){var _0x1b7a92=_0x5a80d7[_0x5759('1e')](0x0,0x5),_0x4216d0=_0x4739ad[_0x5759('1c5')](String,_0x479755)[_0x5759('1e')](-0x5);return _0x1d4a9e[_0x5759('1c4')](_0x1b7a92,_0x4216d0);},4:function(){return _0x1d4a9e[_0x5759('111')](_0x5a80d7,_0x479755);},5:function(){if(_0x4739ad[_0x5759('1c6')](_0x4739ad[_0x5759('1c7')],_0x4739ad[_0x5759('1c8')])){return _0x1d4a9e[_0x5759('1c9')](_0x5a80d7,_0x479755);}else{var _0x4e592d='';for(var _0x4ac79d in _0x1b7a92){var _0x1e0bab=_0x1b7a92[_0x4ac79d],_0x366b26=/[a-zA-Z]/[_0x5759('29')](_0x1e0bab);_0x1b7a92[_0x5759('140')](_0x4ac79d)&&(_0x4e592d+=_0x366b26?this[_0x5759('141')](_0x1e0bab):_0x1e0bab);}return _0x4e592d;}},6:function(){return _0x1d4a9e[_0x5759('1ca')](_0x5a80d7,_0x479755);}}[_0x1b7a92]();},'decipherJoyToken':function(_0x2dae56,_0xc476b0){var _0x5c113f={'yfaPP':function(_0x19334c,_0x592ce3){return _0x19334c+_0x592ce3;},'rqTCw':_0x5759('1cb'),'QtfCR':function(_0x38ea01,_0x5baa39){return _0x38ea01==_0x5baa39;},'kWcSh':_0x5759('170'),'BjLxg':function(_0x2b6864,_0x497e3a){return _0x2b6864-_0x497e3a;},'dcCJv':function(_0x668511,_0x152355){return _0x668511-_0x152355;},'zxXoh':function(_0x1d7c93,_0x280bc1){return _0x1d7c93-_0x280bc1;}};let _0x35bc74=this;var _0xe8f403={'jjt':'a','expire':_0x35bc74[_0x5759('182')](),'outtime':0x3,'time_correction':!0x1};var _0xc07159='',_0x29c47c=_0x5c113f[_0x5759('1cc')](_0x2dae56[_0x5759('d7')](_0xc476b0),_0xc476b0[_0x5759('33')]),_0x1cd2a4=_0x2dae56[_0x5759('33')];if((_0xc07159=(_0xc07159=_0x2dae56[_0x5759('1e')](_0x29c47c,_0x1cd2a4)[_0x5759('61')]('.'))[_0x5759('173')](function(_0x2dae56){return _0x35bc74[_0x5759('127')](_0x2dae56);}))[0x1]&&_0xc07159[0x0]&&_0xc07159[0x2]){var _0x704733=_0x5c113f[_0x5759('1cd')][_0x5759('61')]('|'),_0x5bef01=0x0;while(!![]){switch(_0x704733[_0x5bef01++]){case'0':_0x5331b9&&_0x5c113f[_0x5759('1ce')](_0x5c113f[_0x5759('1cf')],typeof _0x5331b9)&&(_0xe8f403[_0x5759('17e')]=!0x0,_0xe8f403[_0x5759('17f')]=_0x5331b9);continue;case'1':return _0xe8f403['q']=_0x500d70,_0xe8f403[_0x5759('183')]=_0xb86cee,_0xe8f403;case'2':_0xe8f403[_0x5759('179')]=_0x5c113f[_0x5759('1d0')](_0x2d60d2[0x3],0x0),_0xe8f403[_0x5759('17a')]=_0x2d60d2[0x2],_0xe8f403[_0x5759('17b')]='t';continue;case'3':var _0x2e31c7=_0xc07159[0x0][_0x5759('1e')](0x2,0x7),_0xb86cee=_0xc07159[0x0][_0x5759('1e')](0x7,0x9),_0x2d60d2=_0x35bc74[_0x5759('180')](_0xc07159[0x1]||'',_0x2e31c7)[_0x5759('61')]('~');continue;case'4':var _0x500d70=_0x5c113f[_0x5759('1d1')](_0x5331b9,_0x35bc74[_0x5759('182')]())||0x0;continue;case'5':var _0x5331b9=_0x5c113f[_0x5759('1d2')](_0x2d60d2[0x0],0x0)||0x0;continue;}break;}}return _0xe8f403;},'sha1':function(_0xcc566c){var _0xdb84e4={'Jayzn':function(_0x1e5767,_0x83d594){return _0x1e5767==_0x83d594;},'xQAss':function(_0x432a54,_0x595c33){return _0x432a54>_0x595c33;},'mbiuR':function(_0x37ff2e,_0x252455){return _0x37ff2e<_0x252455;},'OprDT':function(_0x576dcd,_0xac63ae){return _0x576dcd!==_0xac63ae;},'FvlHr':_0x5759('1d3'),'IozdB':function(_0x1ae2f2,_0x1af122){return _0x1ae2f2|_0x1af122;},'oxSSo':function(_0x51ec3a,_0x182603){return _0x51ec3a&_0x182603;},'xAEPK':function(_0x145a49,_0x6ea0b7){return _0x145a49&_0x6ea0b7;},'TgfaX':function(_0x959962,_0x183993){return _0x959962^_0x183993;},'ZJvno':function(_0x4249a0,_0x441b33){return _0x4249a0>_0x441b33;},'kWIxm':_0x5759('e7'),'uOLpK':function(_0x59c9ce,_0x26d368){return _0x59c9ce+_0x26d368;},'IofEn':function(_0x51652e,_0x107400){return _0x51652e&_0x107400;},'dqYbO':function(_0x5d0fd2,_0x4936c3){return _0x5d0fd2>>_0x4936c3;},'MFHxy':function(_0x8a69f8,_0x2acc25){return _0x8a69f8|_0x2acc25;},'UIJdO':function(_0x2bce67,_0x436c45){return _0x2bce67<<_0x436c45;},'ObiEH':function(_0x3653f7,_0x2c4c53){return _0x3653f7<<_0x2c4c53;},'oOPmG':function(_0x1b912c,_0x26beda){return _0x1b912c&_0x26beda;},'rZHfX':function(_0x3bf5d0,_0x58c71c){return _0x3bf5d0===_0x58c71c;},'tJiqK':_0x5759('1d4'),'FlSDI':_0x5759('1d5'),'vAlFO':function(_0x4501fe,_0x41347f){return _0x4501fe&_0x41347f;},'AcGqQ':function(_0x2e70c1,_0x3e5f03){return _0x2e70c1&_0x3e5f03;},'BxKhM':function(_0x4683cd,_0x4063a6){return _0x4683cd|_0x4063a6;},'XKNCZ':function(_0x25ce07,_0x326b3d){return _0x25ce07<<_0x326b3d;},'dWiVG':function(_0x19447d,_0x25d7f1){return _0x19447d>>>_0x25d7f1;},'fQOSm':function(_0x1fe851,_0x2049a5){return _0x1fe851-_0x2049a5;},'gGKIj':function(_0x12ca15,_0x4696eb){return _0x12ca15<_0x4696eb;},'zSyuk':function(_0x4d13e9,_0x271f7a){return _0x4d13e9+_0x271f7a;},'RmMPo':function(_0x14ee41,_0x4a7e98){return _0x14ee41>>>_0x4a7e98;},'ECUVU':function(_0x19460f,_0x20e449){return _0x19460f+_0x20e449;},'fTiSs':function(_0x26bb84,_0x3d9577){return _0x26bb84<_0x3d9577;},'IUjFa':function(_0x694abb,_0x11c67c){return _0x694abb<<_0x11c67c;},'nATfp':function(_0x11c2a3,_0x301a0f){return _0x11c2a3>>_0x301a0f;},'dMCKN':function(_0x508660,_0x383b40){return _0x508660*_0x383b40;},'TNBfE':function(_0x27317d,_0x4dc2df){return _0x27317d-_0x4dc2df;},'KKKjq':function(_0x14ef5f,_0x42d554){return _0x14ef5f<<_0x42d554;},'PYuts':function(_0xbec1f,_0x25d242){return _0xbec1f<_0x25d242;},'AWWlh':function(_0x394496,_0x27f774){return _0x394496+_0x27f774;},'FfdLu':function(_0x14fb35,_0x5de539,_0x5e782b){return _0x14fb35(_0x5de539,_0x5e782b);},'kgfaR':function(_0x4573a9,_0x335be2){return _0x4573a9^_0x335be2;},'AxvJz':function(_0x5d634b,_0x253a2c){return _0x5d634b^_0x253a2c;},'Akoqs':function(_0xeb586c,_0x1c0ff5){return _0xeb586c-_0x1c0ff5;},'oTZeC':function(_0x25539f,_0x21e70e){return _0x25539f-_0x21e70e;},'lnaBU':function(_0x5a942e,_0x3a3f0b){return _0x5a942e-_0x3a3f0b;},'VNViN':function(_0x3af327,_0x36ce2c){return _0x3af327|_0x36ce2c;},'abEjb':function(_0x35a7b0,_0x78537f,_0x565071){return _0x35a7b0(_0x78537f,_0x565071);},'FSqkk':function(_0x1282b0,_0x1898d0){return _0x1282b0|_0x1898d0;},'gHLcv':function(_0x46969e,_0x28b1d8){return _0x46969e/_0x28b1d8;},'TSPsM':function(_0x28c037,_0x3a4dba,_0x5d441d){return _0x28c037(_0x3a4dba,_0x5d441d);},'BUVlK':function(_0x433842,_0x4cc3d3){return _0x433842<_0x4cc3d3;},'JGAhQ':function(_0x12d77a,_0x3bb505){return _0x12d77a+_0x3bb505;},'xvmbh':function(_0x1f43ed,_0x319fd8){return _0x1f43ed<_0x319fd8;}};var _0x34077a=new Uint8Array(this[_0x5759('1d6')](_0xcc566c));var _0x17237e,_0x221983,_0x42b5de;var _0x2faa1e=_0xdb84e4[_0x5759('1d7')](_0xdb84e4[_0x5759('1d8')](_0xdb84e4[_0x5759('1d9')](_0xdb84e4[_0x5759('1da')](_0x34077a[_0x5759('33')],0x8),0x6),0x4),0x10),_0xcc566c=new Uint8Array(_0xdb84e4[_0x5759('1d8')](_0x2faa1e,0x2));_0xcc566c[_0x5759('1db')](new Uint8Array(_0x34077a[_0x5759('1dc')])),_0xcc566c=new Uint32Array(_0xcc566c[_0x5759('1dc')]);for(_0x42b5de=new DataView(_0xcc566c[_0x5759('1dc')]),_0x17237e=0x0;_0xdb84e4[_0x5759('1dd')](_0x17237e,_0x2faa1e);_0x17237e++)_0xcc566c[_0x17237e]=_0x42b5de[_0x5759('1de')](_0xdb84e4[_0x5759('1df')](_0x17237e,0x2));_0xcc566c[_0xdb84e4[_0x5759('1e0')](_0x34077a[_0x5759('33')],0x2)]|=_0xdb84e4[_0x5759('1df')](0x80,_0xdb84e4[_0x5759('1e1')](0x18,_0xdb84e4[_0x5759('1e2')](_0xdb84e4[_0x5759('1e3')](_0x34077a[_0x5759('33')],0x3),0x8)));_0xcc566c[_0xdb84e4[_0x5759('1e4')](_0x2faa1e,0x1)]=_0xdb84e4[_0x5759('1e5')](_0x34077a[_0x5759('33')],0x3);var _0x1f5ee7=[],_0x3345f1=[function(){if(_0xdb84e4[_0x5759('1e6')](_0xdb84e4[_0x5759('1e7')],_0xdb84e4[_0x5759('1e7')])){(_0xdb84e4[_0x5759('1e8')](null,_0x42b5de)||_0xdb84e4[_0x5759('1e9')](_0x42b5de,e[_0x5759('33')]))&&(_0x42b5de=e[_0x5759('33')]);for(var _0xcb0aad=0x0,_0x504acc=new Array(_0x42b5de);_0xdb84e4[_0x5759('1ea')](_0xcb0aad,_0x42b5de);_0xcb0aad++)_0x504acc[_0xcb0aad]=e[_0xcb0aad];return _0x504acc;}else{return _0xdb84e4[_0x5759('1eb')](_0xdb84e4[_0x5759('1ec')](_0x3c15f7[0x1],_0x3c15f7[0x2]),_0xdb84e4[_0x5759('1ed')](~_0x3c15f7[0x1],_0x3c15f7[0x3]));}},function(){return _0xdb84e4[_0x5759('1ee')](_0xdb84e4[_0x5759('1ee')](_0x3c15f7[0x1],_0x3c15f7[0x2]),_0x3c15f7[0x3]);},function(){var _0x6ddf7c={'xinDj':function(_0x53d55b,_0x2fc557){return _0xdb84e4[_0x5759('1ef')](_0x53d55b,_0x2fc557);},'mYjtC':_0xdb84e4[_0x5759('1f0')],'NtUdg':function(_0x239a62,_0x4aaafd){return _0xdb84e4[_0x5759('1f1')](_0x239a62,_0x4aaafd);},'DFVfj':function(_0xfba68e,_0x3b3d3){return _0xdb84e4[_0x5759('1f1')](_0xfba68e,_0x3b3d3);},'hqkUL':function(_0xdaf8d7,_0x136124){return _0xdb84e4[_0x5759('1f2')](_0xdaf8d7,_0x136124);},'RsdoC':function(_0xf8f242,_0x1c146f){return _0xdb84e4[_0x5759('1f3')](_0xf8f242,_0x1c146f);},'BDQEg':function(_0x496372,_0x4a4200){return _0xdb84e4[_0x5759('1f4')](_0x496372,_0x4a4200);},'cwUWQ':function(_0x5d6911,_0x4fccea){return _0xdb84e4[_0x5759('1f4')](_0x5d6911,_0x4fccea);},'Vxkja':function(_0x213032,_0x5a0c16){return _0xdb84e4[_0x5759('1f5')](_0x213032,_0x5a0c16);},'mHxjX':function(_0x55dce4,_0xc34ba){return _0xdb84e4[_0x5759('1f6')](_0x55dce4,_0xc34ba);},'hOquy':function(_0x50e6e5,_0x52afe6){return _0xdb84e4[_0x5759('1f7')](_0x50e6e5,_0x52afe6);}};if(_0xdb84e4[_0x5759('1f8')](_0xdb84e4[_0x5759('1f9')],_0xdb84e4[_0x5759('1fa')])){if(_0x6ddf7c[_0x5759('1fb')](r=e[_0x5759('a1')](_0xcc566c++),0xff)||_0x6ddf7c[_0x5759('1fb')](_0x17237e=e[_0x5759('a1')](_0xcc566c++),0xff)||_0x6ddf7c[_0x5759('1fb')](_0x3d5b7d=e[_0x5759('a1')](_0xcc566c++),0xff))throw new TypeError(_0x6ddf7c[_0x5759('1fc')]);a+=_0x6ddf7c[_0x5759('1fd')](_0x6ddf7c[_0x5759('1fd')](_0x6ddf7c[_0x5759('1fe')](_0x42b5de[_0x5759('bb')](_0x6ddf7c[_0x5759('1ff')](_0x6ddf7c[_0x5759('200')](n=_0x6ddf7c[_0x5759('201')](_0x6ddf7c[_0x5759('202')](_0x6ddf7c[_0x5759('203')](r,0x10),_0x6ddf7c[_0x5759('204')](_0x17237e,0x8)),_0x3d5b7d),0x12),0x3f)),_0x42b5de[_0x5759('bb')](_0x6ddf7c[_0x5759('1ff')](_0x6ddf7c[_0x5759('200')](n,0xc),0x3f))),_0x42b5de[_0x5759('bb')](_0x6ddf7c[_0x5759('1ff')](_0x6ddf7c[_0x5759('200')](n,0x6),0x3f))),_0x42b5de[_0x5759('bb')](_0x6ddf7c[_0x5759('205')](0x3f,n)));}else{return _0xdb84e4[_0x5759('1f4')](_0xdb84e4[_0x5759('1f4')](_0xdb84e4[_0x5759('206')](_0x3c15f7[0x1],_0x3c15f7[0x2]),_0xdb84e4[_0x5759('206')](_0x3c15f7[0x1],_0x3c15f7[0x3])),_0xdb84e4[_0x5759('1e3')](_0x3c15f7[0x2],_0x3c15f7[0x3]));}},function(){return _0xdb84e4[_0x5759('1ee')](_0xdb84e4[_0x5759('1ee')](_0x3c15f7[0x1],_0x3c15f7[0x2]),_0x3c15f7[0x3]);}],_0x3bd1df=function(_0x4d74ac,_0x128031){return _0xdb84e4[_0x5759('207')](_0xdb84e4[_0x5759('1d8')](_0x4d74ac,_0x128031),_0xdb84e4[_0x5759('208')](_0x4d74ac,_0xdb84e4[_0x5759('1e1')](0x20,_0x128031)));},_0xbd4db4=[0x5a827999,0x6ed9eba1,-0x70e44324,-0x359d3e2a],_0x3c15f7=[0x67452301,-0x10325477,null,null,-0x3c2d1e10];_0x3c15f7[0x2]=~_0x3c15f7[0x0],_0x3c15f7[0x3]=~_0x3c15f7[0x1];for(var _0x17237e=0x0;_0xdb84e4[_0x5759('1dd')](_0x17237e,_0xcc566c[_0x5759('33')]);_0x17237e+=0x10){var _0x3d5b7d=_0x3c15f7[_0x5759('1e')](0x0);for(_0x221983=0x0;_0xdb84e4[_0x5759('209')](_0x221983,0x50);_0x221983++)_0x1f5ee7[_0x221983]=_0xdb84e4[_0x5759('209')](_0x221983,0x10)?_0xcc566c[_0xdb84e4[_0x5759('20a')](_0x17237e,_0x221983)]:_0xdb84e4[_0x5759('20b')](_0x3bd1df,_0xdb84e4[_0x5759('20c')](_0xdb84e4[_0x5759('20c')](_0xdb84e4[_0x5759('20d')](_0x1f5ee7[_0xdb84e4[_0x5759('1e4')](_0x221983,0x3)],_0x1f5ee7[_0xdb84e4[_0x5759('20e')](_0x221983,0x8)]),_0x1f5ee7[_0xdb84e4[_0x5759('20f')](_0x221983,0xe)]),_0x1f5ee7[_0xdb84e4[_0x5759('210')](_0x221983,0x10)]),0x1),_0x42b5de=_0xdb84e4[_0x5759('211')](_0xdb84e4[_0x5759('20a')](_0xdb84e4[_0x5759('20a')](_0xdb84e4[_0x5759('20a')](_0xdb84e4[_0x5759('20a')](_0xdb84e4[_0x5759('212')](_0x3bd1df,_0x3c15f7[0x0],0x5),_0x3345f1[_0xdb84e4[_0x5759('213')](_0xdb84e4[_0x5759('214')](_0x221983,0x14),0x0)]()),_0x3c15f7[0x4]),_0x1f5ee7[_0x221983]),_0xbd4db4[_0xdb84e4[_0x5759('213')](_0xdb84e4[_0x5759('214')](_0x221983,0x14),0x0)]),0x0),_0x3c15f7[0x1]=_0xdb84e4[_0x5759('215')](_0x3bd1df,_0x3c15f7[0x1],0x1e),_0x3c15f7[_0x5759('1ad')](),_0x3c15f7[_0x5759('1ae')](_0x42b5de);for(_0x221983=0x0;_0xdb84e4[_0x5759('216')](_0x221983,0x5);_0x221983++)_0x3c15f7[_0x221983]=_0xdb84e4[_0x5759('213')](_0xdb84e4[_0x5759('217')](_0x3c15f7[_0x221983],_0x3d5b7d[_0x221983]),0x0);};_0x42b5de=new DataView(new Uint32Array(_0x3c15f7)[_0x5759('1dc')]);for(var _0x17237e=0x0;_0xdb84e4[_0x5759('218')](_0x17237e,0x5);_0x17237e++)_0x3c15f7[_0x17237e]=_0x42b5de[_0x5759('1de')](_0xdb84e4[_0x5759('1e5')](_0x17237e,0x2));var _0x2378a7=Array[_0x5759('1b')][_0x5759('173')][_0x5759('1d')](new Uint8Array(new Uint32Array(_0x3c15f7)[_0x5759('1dc')]),function(_0x440e44){return _0xdb84e4[_0x5759('1f1')](_0xdb84e4[_0x5759('219')](_0x440e44,0x10)?'0':'',_0x440e44[_0x5759('1c')](0x10));})[_0x5759('10a')]('');return _0x2378a7[_0x5759('1c')]()[_0x5759('c6')]();},'encodeUTF8':function(_0x57a5b7){var _0x33d006={'hYTHF':function(_0x39942e,_0x371ed3){return _0x39942e<_0x371ed3;},'LBoBg':function(_0x65a842,_0x47a439){return _0x65a842<_0x47a439;},'KCvVU':function(_0xa040c,_0x76752e){return _0xa040c<_0x76752e;},'VJTKv':function(_0x542d8a,_0x16035f){return _0x542d8a+_0x16035f;},'FAyvp':function(_0x34f52b,_0x16b435){return _0x34f52b&_0x16b435;},'UXXWu':function(_0x27f1ff,_0x4fac9b){return _0x27f1ff>>_0x4fac9b;},'IcsaQ':function(_0x4a3898,_0x4a4f0c){return _0x4a3898==_0x4a4f0c;},'FYSjy':function(_0x263405,_0x983901){return _0x263405>>_0x983901;},'nXNaq':function(_0x3814ea,_0xb24c6e){return _0x3814ea^_0xb24c6e;},'kWFqF':function(_0x4c3b9a,_0x1e9f8f){return _0x4c3b9a<<_0x1e9f8f;},'jZDRo':function(_0x34576d,_0x41af53){return _0x34576d+_0x41af53;},'iUtNs':function(_0xc883e6,_0x24081b){return _0xc883e6+_0x24081b;},'VZNCX':function(_0x4ce068,_0x46bf2e){return _0x4ce068&_0x46bf2e;},'jfLux':function(_0x22a6ae,_0x4e8821){return _0x22a6ae>>_0x4e8821;},'bkBSj':function(_0x4f1101,_0x24c84e){return _0x4f1101&_0x24c84e;}};var _0x5da279,_0x46a2b1=[],_0x2f54cb,_0x3e1606;for(_0x5da279=0x0;_0x33d006[_0x5759('21a')](_0x5da279,_0x57a5b7[_0x5759('33')]);_0x5da279++)if(_0x33d006[_0x5759('21b')](_0x2f54cb=_0x57a5b7[_0x5759('a1')](_0x5da279),0x80))_0x46a2b1[_0x5759('109')](_0x2f54cb);else if(_0x33d006[_0x5759('21c')](_0x2f54cb,0x800))_0x46a2b1[_0x5759('109')](_0x33d006[_0x5759('21d')](0xc0,_0x33d006[_0x5759('21e')](_0x33d006[_0x5759('21f')](_0x2f54cb,0x6),0x1f)),_0x33d006[_0x5759('21d')](0x80,_0x33d006[_0x5759('21e')](_0x2f54cb,0x3f)));else{if(_0x33d006[_0x5759('220')](_0x33d006[_0x5759('221')](_0x3e1606=_0x33d006[_0x5759('222')](_0x2f54cb,0xd800),0xa),0x0))_0x2f54cb=_0x33d006[_0x5759('21d')](_0x33d006[_0x5759('21d')](_0x33d006[_0x5759('223')](_0x3e1606,0xa),_0x33d006[_0x5759('222')](_0x57a5b7[_0x5759('a1')](++_0x5da279),0xdc00)),0x10000),_0x46a2b1[_0x5759('109')](_0x33d006[_0x5759('224')](0xf0,_0x33d006[_0x5759('21e')](_0x33d006[_0x5759('221')](_0x2f54cb,0x12),0x7)),_0x33d006[_0x5759('225')](0x80,_0x33d006[_0x5759('226')](_0x33d006[_0x5759('221')](_0x2f54cb,0xc),0x3f)));else _0x46a2b1[_0x5759('109')](_0x33d006[_0x5759('225')](0xe0,_0x33d006[_0x5759('226')](_0x33d006[_0x5759('221')](_0x2f54cb,0xc),0xf)));_0x46a2b1[_0x5759('109')](_0x33d006[_0x5759('225')](0x80,_0x33d006[_0x5759('226')](_0x33d006[_0x5759('227')](_0x2f54cb,0x6),0x3f)),_0x33d006[_0x5759('225')](0x80,_0x33d006[_0x5759('228')](_0x2f54cb,0x3f)));};return _0x46a2b1;},'gettoken':function(){var _0xc23e34={'CxIxJ':function(_0x2f6404,_0x30f4b8){return _0x2f6404==_0x30f4b8;},'ZITxb':function(_0x80ec8c,_0x2da7fd){return _0x80ec8c>>_0x2da7fd;},'eULtp':function(_0x50c24b,_0x4e6d43){return _0x50c24b^_0x4e6d43;},'XJYVS':function(_0x7ae44c,_0x3a1af6){return _0x7ae44c+_0x3a1af6;},'wsPMB':function(_0x33d8e1,_0x740f20){return _0x33d8e1<<_0x740f20;},'yqIeV':function(_0xf05559,_0x17fd45){return _0xf05559&_0x17fd45;},'NirXI':function(_0x16502e,_0xb95f91){return _0x16502e>>_0xb95f91;},'wHwhb':function(_0x3680f5,_0x4001ff){return _0x3680f5>>_0x4001ff;},'mWDFd':function(_0x3ea207,_0x18f631){return _0x3ea207>>_0x18f631;},'BxPkC':function(_0x5bd647,_0x109a4d){return _0x5bd647+_0x109a4d;},'EOHRN':function(_0x17cc3c,_0xf573ae){return _0x17cc3c&_0xf573ae;},'UUfUq':function(_0x3cf6f2,_0x263b3d){return _0x3cf6f2+_0x263b3d;},'hASvZ':function(_0x578a58,_0x18289a){return _0x578a58&_0x18289a;},'QIvwe':function(_0x3c8302,_0xf8cf73){return _0x3c8302!==_0xf8cf73;},'lZYgH':function(_0x3aa134,_0x123059){return _0x3aa134<_0x123059;},'KvIpj':function(_0x5d6dcb,_0x121c0c){return _0x5d6dcb-_0x121c0c;},'mIvBf':_0x5759('229'),'kauDD':_0x5759('22a'),'TcSVs':_0x5759('74'),'LWxKk':_0x5759('75'),'zbYup':_0x5759('76'),'sTXQb':_0x5759('77'),'PnfqL':_0x5759('22b'),'KFOhT':_0x5759('78'),'oeRAF':_0x5759('79'),'DgGxe':_0x5759('7a'),'ScxFQ':_0x5759('7b'),'CBGhH':_0x5759('7c'),'yLjIz':_0x5759('7d'),'aGCXj':_0x5759('7e'),'hIzce':function(_0xa5af6d,_0x2d5a5a){return _0xa5af6d(_0x2d5a5a);},'JMIii':_0x5759('7f')};const _0x370bbb=_0xc23e34[_0x5759('22c')](require,_0xc23e34[_0x5759('22d')]);var _0x570f79=_0x5759('8d');return new Promise((_0x4ebedb,_0x568b7c)=>{var _0x5f0863={'xntsG':function(_0x277c82,_0x11df5c){return _0xc23e34[_0x5759('22e')](_0x277c82,_0x11df5c);},'qioEP':function(_0x230e6d,_0x59ec0b){return _0xc23e34[_0x5759('22f')](_0x230e6d,_0x59ec0b);},'efBYs':function(_0x5adb74,_0x3d4e7f){return _0xc23e34[_0x5759('230')](_0x5adb74,_0x3d4e7f);},'SBuGH':function(_0x2d6aac,_0x123cec){return _0xc23e34[_0x5759('231')](_0x2d6aac,_0x123cec);},'UqyQk':function(_0x58cc45,_0x14b135){return _0xc23e34[_0x5759('231')](_0x58cc45,_0x14b135);},'VLfUH':function(_0xaf73eb,_0x4c4ec8){return _0xc23e34[_0x5759('232')](_0xaf73eb,_0x4c4ec8);},'HYawW':function(_0x4e87e6,_0x53b315){return _0xc23e34[_0x5759('231')](_0x4e87e6,_0x53b315);},'ZlOwX':function(_0x1798b3,_0x1f28a6){return _0xc23e34[_0x5759('233')](_0x1798b3,_0x1f28a6);},'aBzPG':function(_0x50a0d6,_0x316257){return _0xc23e34[_0x5759('234')](_0x50a0d6,_0x316257);},'lqNoc':function(_0x521365,_0x384cb1){return _0xc23e34[_0x5759('235')](_0x521365,_0x384cb1);},'FXGKk':function(_0x51a6ed,_0x50dcb0){return _0xc23e34[_0x5759('236')](_0x51a6ed,_0x50dcb0);},'YJFQs':function(_0x3b6a52,_0x44e090){return _0xc23e34[_0x5759('237')](_0x3b6a52,_0x44e090);},'ssHIa':function(_0x381729,_0x108c14){return _0xc23e34[_0x5759('238')](_0x381729,_0x108c14);},'UzxnB':function(_0x589d06,_0x3047dc){return _0xc23e34[_0x5759('236')](_0x589d06,_0x3047dc);},'gELJl':function(_0x27c9f4,_0x1a8afb){return _0xc23e34[_0x5759('239')](_0x27c9f4,_0x1a8afb);},'izWQg':function(_0x157298,_0x3a8d49){return _0xc23e34[_0x5759('23a')](_0x157298,_0x3a8d49);},'AtwJu':function(_0x12223a,_0x203fd0){return _0xc23e34[_0x5759('23b')](_0x12223a,_0x203fd0);},'NeBZy':function(_0x3ff0a3,_0x3d9a8e){return _0xc23e34[_0x5759('23c')](_0x3ff0a3,_0x3d9a8e);},'fbxNT':function(_0x460fbe,_0x3ea97e){return _0xc23e34[_0x5759('23d')](_0x460fbe,_0x3ea97e);},'DILDd':function(_0x138b11,_0x49c0e3){return _0xc23e34[_0x5759('23b')](_0x138b11,_0x49c0e3);},'aXfDU':_0xc23e34[_0x5759('23e')],'jZXjU':_0xc23e34[_0x5759('23f')],'RSteK':_0xc23e34[_0x5759('240')],'IDxUz':_0xc23e34[_0x5759('241')],'aRFSy':_0xc23e34[_0x5759('242')],'mogZf':_0xc23e34[_0x5759('243')]};if(_0xc23e34[_0x5759('23b')](_0xc23e34[_0x5759('244')],_0xc23e34[_0x5759('244')])){if(_0x5f0863[_0x5759('245')](_0x5f0863[_0x5759('246')](x=_0x5f0863[_0x5759('247')](c,0xd800),0xa),0x0))c=_0x5f0863[_0x5759('248')](_0x5f0863[_0x5759('249')](_0x5f0863[_0x5759('24a')](x,0xa),_0x5f0863[_0x5759('247')](s[_0x5759('a1')](++i),0xdc00)),0x10000),r[_0x5759('109')](_0x5f0863[_0x5759('24b')](0xf0,_0x5f0863[_0x5759('24c')](_0x5f0863[_0x5759('24d')](c,0x12),0x7)),_0x5f0863[_0x5759('24b')](0x80,_0x5f0863[_0x5759('24c')](_0x5f0863[_0x5759('24e')](c,0xc),0x3f)));else r[_0x5759('109')](_0x5f0863[_0x5759('24b')](0xe0,_0x5f0863[_0x5759('24c')](_0x5f0863[_0x5759('24f')](c,0xc),0xf)));r[_0x5759('109')](_0x5f0863[_0x5759('250')](0x80,_0x5f0863[_0x5759('251')](_0x5f0863[_0x5759('252')](c,0x6),0x3f)),_0x5f0863[_0x5759('253')](0x80,_0x5f0863[_0x5759('254')](c,0x3f)));}else{let _0x464a66={'hostname':_0xc23e34[_0x5759('255')],'port':0x1bb,'path':_0xc23e34[_0x5759('256')],'method':_0xc23e34[_0x5759('257')],'rejectUnauthorized':![],'headers':{'Content-Type':_0xc23e34[_0x5759('258')],'Host':_0xc23e34[_0x5759('255')],'Origin':_0xc23e34[_0x5759('259')],'X-Requested-With':_0xc23e34[_0x5759('25a')],'Referer':_0xc23e34[_0x5759('25b')],'User-Agent':UA}};const _0x3ce6bf=_0x370bbb[_0x5759('99')](_0x464a66,_0x454dfd=>{var _0x5109b4={'taYcq':function(_0x4126b1,_0xe371cd){return _0x5f0863[_0x5759('25c')](_0x4126b1,_0xe371cd);},'LjOwX':function(_0x1d115f,_0x50a34b){return _0x5f0863[_0x5759('25d')](_0x1d115f,_0x50a34b);},'LXksH':function(_0x50b231,_0x25bc4c){return _0x5f0863[_0x5759('25e')](_0x50b231,_0x25bc4c);}};if(_0x5f0863[_0x5759('25f')](_0x5f0863[_0x5759('260')],_0x5f0863[_0x5759('261')])){_0x454dfd[_0x5759('9a')](_0x5f0863[_0x5759('262')]);let _0x390653='';_0x454dfd['on'](_0x5f0863[_0x5759('263')],_0x568b7c);_0x454dfd['on'](_0x5f0863[_0x5759('264')],_0x274fc7=>_0x390653+=_0x274fc7);_0x454dfd['on'](_0x5f0863[_0x5759('265')],()=>_0x4ebedb(_0x390653));}else{var _0xc5b7e5=e[_0x5759('33')],_0x43b92e=t[_0x5759('33')],_0x49e3f5=Math[_0x5759('144')](_0xc5b7e5,_0x43b92e),_0x4ea1b4=this[_0x5759('145')](e),_0x288145=this[_0x5759('145')](t),_0x34b23d='',_0x55350b=0x0;for(_0x5109b4[_0x5759('266')](_0xc5b7e5,_0x43b92e)&&(_0x4ea1b4=this[_0x5759('147')](_0x4ea1b4,_0x49e3f5),_0x288145=this[_0x5759('147')](_0x288145,_0x49e3f5));_0x5109b4[_0x5759('267')](_0x55350b,_0x49e3f5);)_0x34b23d+=Math[_0x5759('125')](_0x5109b4[_0x5759('268')](_0x4ea1b4[_0x55350b],_0x288145[_0x55350b])),_0x55350b++;return _0x34b23d;}});_0x3ce6bf[_0x5759('9f')](_0x570f79);_0x3ce6bf['on'](_0xc23e34[_0x5759('241')],_0x568b7c);_0x3ce6bf[_0x5759('77')]();}});},'get_risk_result':async function(_0x4f06c1,_0x598828){var _0x5b4bda={'OkTtn':function(_0x542d62,_0x45cd9c){return _0x542d62>_0x45cd9c;},'HJrPs':_0x5759('269'),'lscjM':function(_0x4ca64f,_0x2607cd){return _0x4ca64f+_0x2607cd;},'YNTon':_0x5759('17a'),'fbIBk':function(_0x43c250,_0x51f764){return _0x43c250+_0x51f764;},'ukRzD':function(_0x4017b1,_0x3b3b4f){return _0x4017b1+_0x3b3b4f;},'rGnrN':function(_0x5671c8,_0x1b66fc){return _0x5671c8+_0x1b66fc;},'ZtqMh':_0x5759('26a'),'LdOju':_0x5759('26b'),'dNHUj':_0x5759('26c'),'TLIqB':_0x5759('26d'),'gaAWY':_0x5759('26e'),'JIWLY':_0x5759('26f'),'wtjZr':_0x5759('270'),'ZZhEo':_0x5759('271'),'JcueA':_0x5759('272'),'wGVde':_0x5759('273'),'sZFbk':_0x5759('274'),'sJozI':_0x5759('275'),'xUlIg':_0x5759('276'),'BOiRA':_0x5759('277'),'ZmAOT':_0x5759('278'),'jwyAJ':_0x5759('279'),'cZDBl':_0x5759('27a'),'kJagm':_0x5759('27b'),'DhBKj':function(_0x1bf71c,_0x4a1cd7){return _0x1bf71c+_0x4a1cd7;}};const _0x25505b=UA[_0x5759('61')](';')&&UA[_0x5759('61')](';')[0x4]||'';if(!$[_0x5759('269')]||_0x5b4bda[_0x5759('27c')](joyytoken_count,0x12)){$[_0x5759('269')]=JSON[_0x5759('27d')](await this[_0x5759('27e')](_0x5759('27f')))[_0x5b4bda[_0x5759('280')]];joyytoken_count=0x0;}joyytoken_count++;var _0x371679=this[_0x5759('281')](this[_0x5759('198')](_0x4f06c1[_0x5759('76')]));var _0x3e46ec=this[_0x5759('182')]();var _0x26bcf5=this[_0x5759('282')](_0x5b4bda[_0x5759('283')](_0x598828,$[_0x5759('269')]),_0x598828)[_0x5b4bda[_0x5759('284')]][_0x5759('61')](',');var _0x213b4c=this[_0x5759('285')](0xa);var _0x20b44a=this[_0x5759('286')](_0x26bcf5[0x2],_0x213b4c,_0x3e46ec);var _0x248219=_0x371679+_0x5759('287')+$[_0x5759('269')]+_0x5759('288')+_0x3e46ec+_0x5759('289')+_0x213b4c+_0x5759('28a')+_0x20b44a+_0x5759('28b');_0x248219=this[_0x5759('28c')](_0x248219);var _0x578c98=[_0x3e46ec,_0x5b4bda[_0x5759('283')](_0x5b4bda[_0x5759('28d')]('1',_0x213b4c),$[_0x5759('269')]),_0x5b4bda[_0x5759('28e')](_0x5b4bda[_0x5759('28f')](_0x26bcf5[0x2],','),_0x26bcf5[0x3])];_0x578c98[_0x5759('109')](_0x248219);_0x578c98[_0x5759('109')](this[_0x5759('290')](_0x248219));_0x578c98[_0x5759('109')]('C');var _0x582a8e={'aj':'u','bd':_0x371679,'blog':'a','cf_v':'01','ci':_0x5b4bda[_0x5759('291')],'cs':_0x5b4bda[_0x5759('292')],'fpb':'','grn':0x1,'ioa':_0x5b4bda[_0x5759('293')],'jj':0x1,'jk':_0x5b4bda[_0x5759('294')],'mj':[0x1,0x0,0x0],'msg':'','nav':_0x5b4bda[_0x5759('295')],'np':_0x5b4bda[_0x5759('296')],'nv':_0x5b4bda[_0x5759('297')],'pdn':[0xd,0xa4,0x5,0x7,0x1,0x5],'ro':['f','f','f','f','f','f','f'],'scr':[0x332,0x189],'ss':_0x5b4bda[_0x5759('298')],'t':_0x3e46ec,'tm':[],'tnm':[],'wea':_0x5b4bda[_0x5759('299')],'wed':_0x5b4bda[_0x5759('29a')]};_0x582a8e={'tm':[],'tnm':[_0x5b4bda[_0x5759('29b')],_0x5b4bda[_0x5759('29c')]],'grn':0x1,'ss':_0x5b4bda[_0x5759('298')],'wed':_0x5b4bda[_0x5759('29a')],'wea':_0x5b4bda[_0x5759('299')],'pdn':[0xd,0xa4,0x5,0x7,0x1,0x5],'jj':0x1,'cs':_0x5b4bda[_0x5759('292')],'np':_0x5b4bda[_0x5759('296')],'t':_0x3e46ec,'jk':_0x5b4bda[_0x5759('294')],'fpb':_0x5b4bda[_0x5759('29d')],'nv':_0x5b4bda[_0x5759('297')],'nav':_0x5b4bda[_0x5759('295')],'scr':[0x332,0x189],'ro':[_0x5b4bda[_0x5759('29e')],_0x5b4bda[_0x5759('29f')],'9',_0x5b4bda[_0x5759('2a0')],_0x5b4bda[_0x5759('295')],_0x25505b,'1'],'ioa':_0x5b4bda[_0x5759('293')],'aj':'u','ci':_0x5b4bda[_0x5759('291')],'cf_v':'01','bd':_0x371679,'mj':[0x1,0x0,0x0],'blog':_0x5b4bda[_0x5759('2a1')],'msg':''};_0x582a8e=new Buffer[(_0x5759('10'))](this[_0x5759('180')](JSON[_0x5759('167')](_0x582a8e),_0x20b44a))[_0x5759('1c')](_0x5b4bda[_0x5759('2a2')]);_0x578c98[_0x5759('109')](_0x582a8e);_0x578c98[_0x5759('109')](this[_0x5759('290')](_0x582a8e));return{'log':_0x578c98[_0x5759('10a')]('~'),'joyytoken':_0x5759('2a3')+_0x5b4bda[_0x5759('2a4')](_0x598828,$[_0x5759('269')])+';'};}};;_0xoda='jsjiami.com.v6';

// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
