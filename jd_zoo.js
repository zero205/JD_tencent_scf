/*
动物联萌 618活动
更新时间：2021-06-10 09:13
做任务，收金币
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
// quantumultx
[task_local]
#动物联萌
5 * * * * https://raw.githubusercontent.com/yangtingxiao/QuantumultX/master/scripts/jd/jd_zoo.js, tag=动物联萌, img-url=https://raw.githubusercontent.com/yangtingxiao/QuantumultX/master/image/jd.png, enabled=true
// Loon
[Script]
cron "5 * * * *" script-path=https://raw.githubusercontent.com/yangtingxiao/QuantumultX/master/scripts/jd/jd_zoo.js,tag=动物联萌
// Surge
动物联萌 = type=cron,cronexp=5 * * * *,wake-system=1,timeout=500,script-path=https://raw.githubusercontent.com/yangtingxiao/QuantumultX/master/scripts/jd/jd_zoo.js
*/
const $ = new Env('动物联萌');
//Node.js用户请在jdCookie.js处填写京东ck;
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '',secretp = '',shareCodeList = [],showCode = true;
let doPkSkill = false;  //自动放技能，不需要的改为false
const JD_API_HOST = `https://api.m.jd.com/client.action?functionId=`;
!(async () => {
  await requireConfig()
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    if (cookie) {
      if (i) console.log(`\n***************开始京东账号${i + 1}***************`)
      initial();
      await  QueryJDUserInfo(i);
      if (!merge.enabled)  //cookie不可用
      {
        $.setdata('', `CookieJD${i ? i + 1 : "" }`);//cookie失效，故清空cookie。
        $.msg($.name, `【提示】京东账号${i ? i + 1 : "" } cookie已过期！请先获取cookie\n直接使用NobyDa的京东签到获取`, 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
        continue;
      }
      console.log('\n\n京东账号：'+merge.nickname + ' 任务开始')
      await zoo_sign()
      await zoo_pk_getHomeData();
      await zoo_getHomeData();
      if (merge.black) continue;
      //await qryCompositeMaterials()
      await msgShow();
      //break;
    }
  }
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())

//获取昵称（直接用，勿删）
function QueryJDUserInfo(i,timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
        headers : {
          'Referer' : `https://wqs.jd.com/my/iserinfo.html`,
          'Cookie' : cookie
        }
      }
      $.get(url, (err, resp, data) => {
        try {
          data = JSON.parse(data);
          if (data.retcode === 13) {
            merge.enabled = false
            return
          } else if (data.retcode === 0) {
            merge.nickname = data.base.nickname;
          } else {
            merge.nickname = `账号${i + 1}`
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

function zoo_getTaskDetail(shopSign = "",appSign = "",timeout = 0){
  return new Promise((resolve) => {
    setTimeout( ()=>{
      appSign = appSign&&'"appSign":"2","channel":1,'
      let url = {
        url : `${JD_API_HOST}zoo_getTaskDetail`,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=zoo_getTaskDetail&body={${appSign}"shopSign":"${shopSign}"}&client=wh5&clientVersion=1.0.0`
      }
      //if (shopSign) {
      //  console.log(shopSign)
      //  url.url = url.url.replace('zoo_getTaskDetail','zoo_shopLotteryInfo')
      //  url.body = url.body.replace('zoo_getTaskDetail','zoo_shopLotteryInfo')
      //}
      $.post(url, async (err, resp, data) => {
        try {
          //console.log('zoo_getTaskDetail:' + data)
          data = JSON.parse(data);
          if (shopSign === "") {
            shopSign = '""'
            if (appSign === "" && typeof data.data.result.inviteId !== "undefined") console.log(`您的个人助力码：${data.data.result.inviteId}`)
          }
          if (!data.data.result) return
          for (let i = 0;i < data.data.result.taskVos.length;i ++) {
            //if (merge.black)  return ;
            console.log( "\n" + data.data.result.taskVos[i].taskType + '-' + data.data.result.taskVos[i].taskName + (appSign&&"（小程序）") + '-'  +  (data.data.result.taskVos[i].status === 1 ? `已完成${data.data.result.taskVos[i].times}-未完成${data.data.result.taskVos[i].maxTimes}` : "全部已完成")  )
            if ([1,2,3,5,7,9,26].includes(data.data.result.taskVos[i].taskType) && data.data.result.taskVos[i].status === 1 ) {
              let list = data.data.result.taskVos[i].productInfoVos||data.data.result.taskVos[i].brandMemberVos||data.data.result.taskVos[i].followShopVo||data.data.result.taskVos[i].shoppingActivityVos||data.data.result.taskVos[i].browseShopVo
              //console.log(list)
              //if (data.data.result.taskVos[i].taskType === 9) continue
              for (let k = data.data.result.taskVos[i].times; k < data.data.result.taskVos[i].maxTimes; k++) {
                for (let j in list) {
                  if (list[j].status === 1) {
                    //let taskBody = `functionId=zoo_collectScore&body={"taskId":"${data.data.result.taskVos[i].taskId}","actionType":1,"taskToken":"${list[j].taskToken}","ss":"{\\"extraData\\":{\\"log\\":\\"${sign}\\",\\"sceneid\\":\\"DR216hPageh5\\"},\\"secretp\\":\\"${secretp}\\",\\"random\\":\\"${rnd}\\"}"}&client=wh5&clientVersion=1.0.0`
                    let taskBody = `functionId=zoo_collectScore&body=${JSON.stringify({"taskId": data.data.result.taskVos[i].taskId,"actionType":1,"taskToken" : list[j].taskToken,"ss" : getBody()})}&client=wh5&clientVersion=1.0.0`
                    console.log("\n"+(list[j].title||list[j].shopName||list[j].skuName))
                    await zoo_collectScore(taskBody,2000)
                    //}
                    list[j].status = 2;
                    break;
                  } else {
                    continue;
                  }
                }
              }
            }

            if ([12,13].includes(data.data.result.taskVos[i].taskType) && data.data.result.taskVos[i].status === 1) {
              for (let k = data.data.result.taskVos[i].times; k < data.data.result.taskVos[i].maxTimes; k++) {
                let taskBody = `functionId=zoo_collectScore&body=${JSON.stringify({"taskId": data.data.result.taskVos[i].taskId,"taskToken" : list[j].taskToken,"ss" : getBody()})}&client=wh5&clientVersion=1.0.0`
                if (merge.black)  return ;
                  //if (typeof data.data.result.taskVos[i].simpleRecordInfoVo !== "undefined"){
                  //  taskBody = encodeURIComponent(`{"dataSource":"newshortAward","method":"getTaskAward","reqParams":"{\\"taskToken\\":\\"${data.data.result.taskVos[i].simpleRecordInfoVo.taskToken}\\"}","sdkVersion":"1.0.0","clientLanguage":"zh"}`)
                  //  await qryViewkitCallbackResult(taskBody,1000)
                  //} else {
                await zoo_collectScore(taskBody,1000)
                  //}
                }
            }

            if ([2].includes(data.data.result.taskVos[i].taskType) && data.data.result.taskVos[i].status === 1 && !data.data.result.taskVos[i].taskName.includes("逛逛")) {
              for (let k = data.data.result.taskVos[i].times; k < data.data.result.taskVos[i].maxTimes; k++) {
                await zoo_getFeedDetail(data.data.result.taskVos[i].taskId)
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

//获取我的城市
function zoo_myMap(timeout = 0){
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_myMap`,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=zoo_myMap&body={"ss":"{\\"extraData\\":{},\\"businessData\\":{},\\"secretp\\":\\"${secretp}\\"}"}&client=wh5&clientVersion=1.0.0`
      }
      $.post(url, async (err, resp, data) => {
        try {
          console.log('zoo_myMap:' + data)
          data = JSON.parse(data);
          for (let i in data.data.result.shopList) {
            // (data.data.result.shopList[i].status === 1) {
              //console.log(data.data.result.shopList[i])
            console.log('\n开始小镇任务：'+ data.data.result.shopList[i].name)// + '-' + data.data.result.shopList[i].shopId
            await zoo_getTaskDetail(data.data.result.shopList[i].shopId)
            //}
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}
//发技能
function zoo_pk_doPkSkill(skillType, timeout = 0){
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_pk_doPkSkill`,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=zoo_pk_doPkSkill&body={"skillType" : "${skillType}"}&client=wh5&clientVersion=1.0.0`
      }
      $.post(url, async (err, resp, data) => {
        try {
          //console.log('zoo_pk_doPkSkill:' + data)
          data = JSON.parse(data);
          if (data.data.bizCode === 0) {
            console.log('技能获得：' + data.data.result.skillValue);
          } else {
            console.log('技能释放失败：' + data.data.bizMsg);
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}
//签到
function zoo_sign(timeout = 0){
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_sign`,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=zoo_sign&body={}&client=wh5&clientVersion=1.0.0`
      }
      $.post(url, async (err, resp, data) => {
        try {
          //console.log(data)
          data = JSON.parse(data);
          console.log('签到结果：' + data.data.bizMsg);
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

//逛商城
function zoo_shopSignInWrite(shopSign,timeout = 0){
  return new Promise((resolve) => {

    let rnd = Math.round(Math.random()*1e6)
    let nonstr = randomWord(false,10)
    let time = Date.now()
    let key = minusByByte(nonstr.slice(0,5),String(time).slice(-5))
    let msg = `inviteId=-1&rnd=${rnd}&stealId=-1&taskId=${shopSign}&token=d89985df35e6a2227fd2e85fe78116d2&time=${time}&nonce_str=${nonstr}&key=${key}&is_trust=1`
    let sign = bytesToHex(wordsToBytes(getSign(msg))).toUpperCase()

    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_shopSignInWrite`,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=zoo_shopSignInWrite&body={"shopSign":"${shopSign}","ss":"{\\"extraData\\":{\\"is_trust\\":true,\\"sign\\":\\"${sign}\\",\\"time\\":${time},\\"encrypt\\":\\"3\\",\\"nonstr\\":\\"${nonstr}\\",\\"jj\\":\\"\\",\\"token\\":\\"d89985df35e6a2227fd2e85fe78116d2\\",\\"cf_v\\":\\"1.0.1\\",\\"client_version\\":\\"2.1.3\\",\\"sceneid\\":\\"QD216hPageh5\\"},\\"businessData\\":{\\"taskId\\":\\"${shopSign}\\",\\"rnd\\":\\"${rnd}\\",\\"inviteId\\":\\"-1\\",\\"stealId\\":\\"-1\\"},\\"secretp\\":\\"${secretp}\\"}"}&client=wh5&clientVersion=1.0.0`
      }
      $.post(url, async (err, resp, data) => {
        try {
          //console.log(data)
          data = JSON.parse(data);
          if (data.data.bizCode !== 0) {
            console.log(data.data.bizMsg)
            merge.end = true
          } else {
            console.log('获得金币' + data.data.result.score)
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

//逛商城
function zoo_shopSignInRead(shopSign,timeout = 0){
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_shopSignInRead`,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=zoo_shopSignInRead&client=wh5&clientVersion=1.0.0&body={"shopSign":"${shopSign}"}`
      }
      $.post(url, async (err, resp, data) => {
        try {
          console.log(data)
          data = JSON.parse(data);
          if (data.data.result.signInTag === 0) {
             secretp = secretp||data.data.result.secretp
             await zoo_shopSignInWrite(shopSign)
          } else {
            console.log('已逛过')
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

//收金币
function zoo_collectProduceScore(timeout = 0){
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_collectProduceScore`,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`,
          'Content-Type' : `application/x-www-form-urlencoded`
        },
        body : `functionId=zoo_collectProduceScore&body=${JSON.stringify({"ss" : getBody()})}&client=wh5&clientVersion=1.0.0`
      }
      //console.log(url.body)
      $.post(url, async (err, resp, data) => {
        try {
          //console.log(data)
          data = JSON.parse(data);
          if (data.data.bizCode === -1002) {
            console.log('此账号暂不可使用脚本，脚本终止！')
            merge.black = true;
            return ;
          }
          if (data.data.result) console.log(`\n收取金币：${data.data.result.produceScore}`)
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

//做任务
function zoo_collectScore(taskBody,timeout = 0){
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_collectScore`,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : taskBody
        }
      //console.log(url.body)
      $.post(url, async (err, resp, data) => {
        try {
          //console.log(data)
          data = JSON.parse(data);
          console.log('任务执行结果：' + data.data.bizMsg)
          if (data.data.bizCode === -1002) {
            //console.log(url.body)
            //console.log('\n提示火爆，休息5秒')
            //await $.wait(5000)
            //await zoo_collectScore(taskBody)
            console.log('此账号暂不可使用脚本，脚本终止！')
            merge.black = true;
            return ;
          }
          if (data.data.bizCode === 0 && typeof data.data.result.taskToken !== "undefined") {
            //console.log('需要再次执行,如提示活动异常请多次重试，个别任务多次执行也不行就去APP做吧！')
            let taskBody = encodeURIComponent(`{"dataSource":"newshortAward","method":"getTaskAward","reqParams":"{\\"taskToken\\":\\"${data.data.result.taskToken}\\"}","sdkVersion":"1.0.0","clientLanguage":"zh"}`)
            //console.log(taskBody)
            await qryViewkitCallbackResult(taskBody,7000)
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

//做任务
function zoo_doAdditionalTask(taskBody,timeout = 0){
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_doAdditionalTask`,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : taskBody
      }
      //console.log(url.body)
      $.post(url, async (err, resp, data) => {
        try {
          console.log(data)
          data = JSON.parse(data);
          console.log('任务执行结果：' + data.data.bizMsg)
          if (data.data.bizCode === -1002) {
            console.log('\n提示火爆，休息5秒')
            await $.wait(5000)
            return ;
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

//查询甄选任务
function zoo_getFeedDetail(taskId,timeout = 0){
  return new Promise((resolve) => {

    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_getFeedDetail`,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=zoo_getFeedDetail&body={"taskId":"${taskId}"}&client=wh5&clientVersion=1.0.0`
      }
      //console.log(url)
      $.post(url, async (err, resp, data) => {
        try {
          //console.log(data)
          data = JSON.parse(data);
          let list =  data.data.result.viewProductVos||data.data.result.addProductVos
          for (let i in list) {
            if (list[i].status === 1) {
              for (let j in list[i].productInfoVos) {
                if (j >= 5)  break;
                //${JSON.stringify({"ss" : getBody()})}
                //let taskBody = `functionId=zoo_collectScore&body={"taskId":${list[i].taskId},"taskToken" : "${list[i].productInfoVos[j].taskToken}","ss":"{\\"extraData\\":{\\"log\\":\\"${sign}\\",\\"sceneid\\":\\"QD216hPageh5\\"},\\"secretp\\":\\"${secretp}\\",\\"random\\":\\"${rnd}\\"}","actionType":1}&client=wh5&clientVersion=1.0.0`
                let taskBody = `functionId=zoo_collectScore&body=${JSON.stringify({"taskId": list[i].taskId,"actionType":1,"taskToken" : list[i].productInfoVos[j].taskToken,"ss" : getBody()})}&client=wh5&clientVersion=1.0.0`
                //console.log(taskBody)
                console.log(list[i].productInfoVos[j].skuName)
                await zoo_collectScore(taskBody,1000)
              }
              list[i].status = 2
            }
          }

        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

//做任务2
function qryViewkitCallbackResult(taskBody,timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://api.m.jd.com/?functionId=qryViewkitCallbackResult&client=wh5&clientVersion=1.0.0&body=${taskBody}&_timestamp=`+Date.now(),
        headers : {
          'Origin' : `https://bunearth.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `*/*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`,
          'Content-Type' : 'application/x-www-form-urlencoded',
          'Referer' : 'https://bunearth.m.jd.com/babelDiy/Zeus/4SJUHwGdUQYgg94PFzjZZbGZRjDd/index.html?jmddToSmartEntry=login'
        }
       }

      $.get(url, async (err, resp, data) => {
        try {
          //console.log(url.url)
          //console.log(data)
          data = JSON.parse(data);
          console.log(data.toast.subTitle)
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

//群组助力
function zoo_pk_assistGroup(inviteId = "",timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_pk_assistGroup`  ,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.6;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`,
          'Refer' : `https://bunearth.m.jd.com/babelDiy/Zeus/4SJUHwGdUQYgg94PFzjZZbGZRjDd/index.html?jmddToSmartEntry=login`
        },
        body : `functionId=zoo_pk_assistGroup&body=${JSON.stringify({"confirmFlag": 1,"inviteId" : inviteId,"ss" : getBody()})}&client=wh5&clientVersion=1.0.0`
      }
      //console.log(url.body)
      $.post(url, async (err, resp, data) => {
        try {
          //console.log('商圈助力：' + data)
          data = JSON.parse(data);
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

//获取首页信息
function zoo_getHomeData(inviteId= "",timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_getHomeData`  ,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=zoo_getHomeData&body={${inviteId ? "\"inviteId\":\"" + inviteId +'\"': ""}}&client=wh5&clientVersion=1.0.0`
      }
      $.post(url, async (err, resp, data) => {
        try {
          //console.log(data)
          //if (merge.black)  return ;
          data = JSON.parse(data);
          if (data.code === 0) {
            if (inviteId !== "") {
              let taskBody = `functionId=zoo_collectScore&body=${JSON.stringify({"taskId": 2,"inviteId":inviteId,"actionType":1,"ss" : getBody()})}&client=wh5&clientVersion=1.0.0`
              await zoo_collectScore(taskBody, 1000)
              return
            }
            //console.log('zoo_getHomeData:' + JSON.stringify(data))
            secretp = data.data.result.homeMainInfo.secretp
            await zoo_collectProduceScore();
            if (merge.black) return;
            await zoo_pk_getHomeData('sSKNX-MpqKOJsNu9y8nYAqXFF5NKOpRPsMffiCRwqC9Qb8MWZnWWJhg7JHU144Eg')
            //await zoo_pk_assistGroup()
            //if (data.data.result.homeMainInfo.raiseInfo.buttonStatus === 1 )
            if (parseInt(data.data.result.homeMainInfo.raiseInfo.totalScore) >= parseInt(data.data.result.homeMainInfo.raiseInfo.nextLevelScore) ) await zoo_raise(1000)
            await zoo_getHomeData('ZXTKT0225KkcRUxL9FKDJh7ylvMLcAFjRWn6-7zx55awQ');//ZXTKT0225KkcRBka_FPTJBjzkv9YfAFjRWn6-7zx55awQ
            await zoo_getTaskDetail()
            await zoo_getTaskDetail("","app")
          } else {
            return
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

function zoo_raise(timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_raise`  ,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=zoo_raise&body={}&client=wh5&clientVersion=1.0.0`
      }
      $.post(url, async (err, resp, data) => {
        try {
          //console.log(data)
          data = JSON.parse(data);
          console.log('解锁结果：'+ (data.data.bizCode||'成功'))
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

function qryCompositeMaterials(timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}qryCompositeMaterials`  ,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=qryCompositeMaterials&body={"qryParam":"[{\\"type\\":\\"advertGroup\\",\\"mapTo\\":\\"viewLogo\\",\\"id\\":\\"05149412\\"},{\\"type\\":\\"advertGroup\\",\\"mapTo\\":\\"bottomLogo\\",\\"id\\":\\"05149413\\"}]","activityId":"2cKMj86srRdhgWcKonfExzK4ZMBy","pageId":"","reqSrc":"","applyKey":"21beast"}&client=wh5&clientVersion=1.0.0`
      }
      $.post(url, async (err, resp, data) => {
        try {
          //console.log(data)
          data = JSON.parse(data);
          for (let i in data.data.viewLogo.list) {
            await zoo_getTaskDetail(data.data.viewLogo.list[i].desc)
          }
          for (let i in data.data.bottomLogo.list) {
            await zoo_getTaskDetail(data.data.bottomLogo.list[i].desc)
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

function zoo_pk_getHomeData(inviteId = "",timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_pk_getHomeData`  ,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=zoo_pk_getHomeData&body={}&client=wh5&clientVersion=1.0.0`
      }
      $.post(url, async (err, resp, data) => {
        try {
          if (inviteId !== "") {
            await $.getScript("https://ghproxy.com/https://raw.githubusercontent.com/zero205/updateTeam/main/shareCodes/jd_zoo.json").then((text) => (shareCodeList = text ? text.split('\n') : []))
            for (let i in shareCodeList) {
              if (shareCodeList[i]) await zoo_pk_assistGroup(shareCodeList[i]);
            }
            //await zoo_pk_assistGroup(inviteId);
          } else {
            //console.log(data);
            data = JSON.parse(data);
            if (showCode) {
              console.log('您的队伍助力码：' + data.data.result.groupInfo.groupAssistInviteId);
              showCode = false;
            }
            if (!doPkSkill) return ;
            if (typeof data.data.result.groupPkInfo.dayTotalValue !== "undefined") {
              if (parseInt(data.data.result.groupPkInfo.dayTotalValue) >= parseInt(data.data.result.groupPkInfo.dayTargetSell)) return;
            }
            else
            if (typeof data.data.result.groupPkInfo.nightTotalValue !== "undefined") {
              if (parseInt(data.data.result.groupPkInfo.nightTotalValue) >= parseInt(data.data.result.groupPkInfo.nightTargetSell)) return;
            }
            else
              return;
            let list = data.data.result.groupInfo.skillList;
            for (let i = list.length -1; i>=0; i--) {
              if (parseInt(list[i].num) > 0) {
                await zoo_pk_doPkSkill(list[i].code,800);
                await zoo_pk_getHomeData();
                break;
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

function requireConfig() {
  return new Promise(resolve => {
    //Node.js用户请在jdCookie.js处填写京东ck;
    const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
    //IOS等用户直接用NobyDa的jd cookie
    if ($.isNode()) {
      Object.keys(jdCookieNode).forEach((item) => {
        if (jdCookieNode[item]) {
          cookiesArr.push(jdCookieNode[item])
        }
      })
    } else {
      let cookiesData = $.getdata('CookiesJD') || "[]";
      cookiesData = jsonParse(cookiesData);
      cookiesArr = cookiesData.map(item => item.cookie);
      cookiesArr.reverse();
      cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
      cookiesArr.reverse();
      cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
    }
    console.log(`共${cookiesArr.length}个京东账号\n`);
    resolve()
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
//初始化
function initial() {
  merge = {
    nickname: "",
    enabled: true,
    end: false,
    black: false
  }
  for (let i in merge) {
    merge[i].success = 0;
    merge[i].fail = 0;
    merge[i].prizeCount = 0;
    merge[i].notify = "";
    merge[i].show = true;
  }
  showCode = true;
}
//通知
function msgShow() {
  console.log("\n\n京东账号："+merge.nickname + ' 任务已做完！\n如有未完成的任务，请多执行几次')
 //$.msg($.Name,"","京东账号："+merge.nickname + ' 任务已做完！\n如有未完成的任务，请多执行几次')
}
var _0xod0='jsjiami.com.v6',_0x173a=[_0xod0,'e0BJ','G21nZA==','w4oHSBYo','w5PCtAfDuSU=','wphxNHQH','wrPDg8KMaWEKcDc=','EB7Cvg==','XE9Zw4IOw6M=','w7fCpjLDlC9rBcKQIw==','w7/DlcKiwp0m','BBjDi8OtEE1ww4U=','NhnDncOYJA==','b1knw6Z7','OhjCqMOqw5o=','w4p5wq4Zwqw=','w6JGwrwCwpo=','w6PDiBnCnC7CuSp3','wrzDkcOU','bcKjLB3DrG8twp7CiQ==','w6TDginCmjnCpDQ=','w74kSQw+','w60CXSIG','w5NTcHXCjg==','dMKmwqbCqRpFwrgow5MX','NA3DosOODg==','BcO/w7HDt20=','Y8OVIVvDsA==','w4U9w7vDjEk=','QcOWFkTDkw==','w7IQXycj','bsKfAcK2woA=','U29tw6B2','w5wwNMO8Sg==','e8KrwqnCvC1C','esKwEgLDqg==','wo9iD8Oewpc=','woNgLWMj','w4DDvwzCgjk=','wpBuY8K2w4o=','JcO2wpEPwoE=','cMKhwq/Cgj0=','R8KrwrXCky4=','wpPDmcKUa1YKXgFMw5g=','w65Ca2HCvA==','T18Iw6By','w6jCuQ/DsSo=','w5TCsMKXDcK3','SMKowoRLcA==','w6IaN2Bl','w4/DocKiwpAr','XMKCWDvDhA==','wqHCvsOYesK5','wopCL8ObwrE=','wowGw6wuw4s=','e8Kpcx3Dvg==','w7FBaUvCqg==','VkIUw7Jt','w7dnwrkMwqg=','w5PCoy7Dnyc=','w4wdIkdj','wpLDt8OYKcOa','QsKNwpkeQA==','dlkRw4Rz','c2kIwqBb','aTfCicK9QsKC','NcOcwrFRwrx/','ExPChMOUw4Y=','WmIRwohM','wqVSMcOQwrE=','w4nDl8KBw6k=','bsKrwrtjWQ==','FBLCrg==','RsOzFHXDlQ==','OnZSKMKOUcOmHQ==','F8OawppewrE=','w68Pw5fDn1DCog==','bcOYw6dHwqM=','Y2gIwoxQw4lbNQ==','wpdhQMKgw4vCnQLDgnXDng==','wpDCosOJUMKAeXzDiTHDrQ==','KcOMwqxe','TsOKw6xJwrA=','wqYIw6cdTMO6wpM=','w4I/LMOobA==','XsONFgvCqQ==','HRHCrsO3w73CqcKkSkoQw6dHZ1Y=','M1XCg2bDjA==','XsOXNEDDvw==','OELCmHDDiA==','Z8KPbBDDtQ==','dMOgGcK4DA==','w5AJUws=','WMKpcxTDmQ==','wobDn8KnIlUiHHY=','ZGUOwrlN','BcOQw5fDo8OnwpQ=','VcKDHsKU','BcOsw53DgMO1','NcOqwrkiwpc=','Z8KMeQ7DsA==','XMOAGgrCrw==','Y8OpGsKNK0JZNw==','w4nCrsKLJw==','wqACw4QFX8OwwphE','fcKhwq7CtQ==','d8OlFWDDpg==','w7Vkwqgj','wptaasKFPA==','ZjrChsKodcKFwqLDn8KmMQ==','wo7DvcOUMMOB','OwjCkMOdw7w=','b8OgDMKRGw==','Zl49w6Jk','fEMVwrZu','QlMMwrFR','w4XDoi3CuAk=','woZKCFY/','w4fCuyTDry4=','e2I1wp9Ww4g=','wrcxw7IBw4c=','YMKPLsKIwoM=','wrFwYsKmw64=','VMKGwozCgQM=','X8K7worCvy4=','w45Ta1XCp8KUw4w=','wrHDtcKeAEg=','dG86wophw49RNz3Dnw==','DVxrCsKT','YyDCiMK3dcKCwqfDiMKkKhYR','w5/CqcKXIsKXwpsHwrTCuMOPwoDCnQ==','w4XCvxTDuyM=','aCbCkMKqRA==','TcK3dRrDvznCinJ/TzPDpQ==','ScKwHcKxwo8=','w5pEdFTChcKfw4jCqMKoREbCjA==','wqpoF8Ouwp0=','ccK8wqjCthpCwr0/w5EMwqkp','w5Bwa3TCrA==','wpxGScKEMw==','w5XCvsKWKMKgwps=','wrDCj8OCdMKs','wqvDosOAOsOs','woUscW1T','Z14Fw5hUNcK0GGLDsQ==','JR/DiMODFw==','w5szK8O/YQ==','wrdMS8KEw6c=','w6jCty7DmjVk','w4RsbsO5','Z8OzOsKR','wp7DtsKEG00=','AMO5w6/Dt3HCtVYb','w67CvSnDkw==','w44kO3Bg','wqc7wpUHwqAQIsOnwo7CnsKOwqjDgAEDbztyw4MKw59hwpEdPMOYdcKGTXTClMOXcMKvHsK/w6URP2tUD0YYE8Kzw73Cq8K1w4ssdi3Ds8OLZMO9fMKFHMK7IcO+w7UQwp4KJBXDuTs2bMKkLzvDlsO/wph1FUnDkMKkO8ORdG1Qw6FbwpjCpMOEDF12wqhEwq7DlxprCsKJH3tdJBA=','w4PDusKY','NGsKR2sydsKdwo88wrbDqg==','wo1pLMOHwo0=','asKmKMKmwrI=','w7ELw5fDnEvCpw==','wq8Yw5E4w5/DpMOKw4Y=','bMOfw6hCwpU=','Nm90NcKN','w5Y4Dw==','TsKjNgXDkQ==','G8OUw5fDoMO8wpHCrQ==','T8OBw5DDqcO2w4E=','aHduMsKfXcOXCcO4bQA=','I8K0wpNAIQ==','w41sMMO3wovCssOXcGzCjcOj','OG3Cv2vDrg==','w7F+wog/wo7Ci8K/woY=','w57DqQ3CvRk=','YjtrN8OeAsKqG8KuMx8nZBFXwqDDt8Ksw6jCpMKCacOiwoV5K8Kkcz3CkhfDvg83woNvZMOsw4otwqkQFsKQRE4fw4TDiCE2HMOmUXXDoDF+wrgUwqbDmMKQdcORZcO7w5rCshEqcMOOwrLCrWUEKsKew7p3w5bDqw4XJkvCpcO5RRXDicOSw6dPLnzDgsOpwr7CucKhdQbDgcKZUMKKCwEabMKvGsONwocySMOEw6oyVB5IB3rCsh7CsDoLw4xNw79cOAzCgMKvw7DCpx8wIMKXw6vCi8KQw6RVw4DCgxPDrXJMw7w3L8O/wpbDngYuacObVBHChsOJw4MXasOKHMKWwovCi8K9W8OMwrjDt1MHa8Oyw6EjwqHCjsOCw5nDjw==','wp4aOVTCrMOVwpPCgcOaBxLDhUgIwqtiw5IGwoJqKCdRwrfCjDUUScKXJsOzwqvDucOlw6HCjQ==','XcKlJwTDtmcOwqs=','XjqHsjNGpiYaEmi.com.v6rXEflHJdDe=='];(function(_0xa9fe68,_0x2754d6,_0x21206e){var _0x302e24=function(_0x5e48f9,_0x2919e7,_0x5af1f3,_0x3bc964,_0x1f0f95){_0x2919e7=_0x2919e7>>0x8,_0x1f0f95='po';var _0x249422='shift',_0x3f392a='push';if(_0x2919e7<_0x5e48f9){while(--_0x5e48f9){_0x3bc964=_0xa9fe68[_0x249422]();if(_0x2919e7===_0x5e48f9){_0x2919e7=_0x3bc964;_0x5af1f3=_0xa9fe68[_0x1f0f95+'p']();}else if(_0x2919e7&&_0x5af1f3['replace'](/[XqHNGpYErXEflHJdDe=]/g,'')===_0x2919e7){_0xa9fe68[_0x3f392a](_0x3bc964);}}_0xa9fe68[_0x3f392a](_0xa9fe68[_0x249422]());}return 0x8e28c;};return _0x302e24(++_0x2754d6,_0x21206e)>>_0x2754d6^_0x21206e;}(_0x173a,0x19d,0x19d00));var _0x9abf=function(_0x42a531,_0x44a305){_0x42a531=~~'0x'['concat'](_0x42a531);var _0x12a3b4=_0x173a[_0x42a531];if(_0x9abf['OmOKin']===undefined){(function(){var _0x424907=function(){var _0x237a37;try{_0x237a37=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x2b5e32){_0x237a37=window;}return _0x237a37;};var _0x36823e=_0x424907();var _0x1433d9='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x36823e['atob']||(_0x36823e['atob']=function(_0x43c103){var _0xaeaef9=String(_0x43c103)['replace'](/=+$/,'');for(var _0x3f06a=0x0,_0x2d83f7,_0x4e2021,_0x1e233f=0x0,_0x54175f='';_0x4e2021=_0xaeaef9['charAt'](_0x1e233f++);~_0x4e2021&&(_0x2d83f7=_0x3f06a%0x4?_0x2d83f7*0x40+_0x4e2021:_0x4e2021,_0x3f06a++%0x4)?_0x54175f+=String['fromCharCode'](0xff&_0x2d83f7>>(-0x2*_0x3f06a&0x6)):0x0){_0x4e2021=_0x1433d9['indexOf'](_0x4e2021);}return _0x54175f;});}());var _0x5bc729=function(_0x319ce3,_0x44a305){var _0x12f87f=[],_0x3143fb=0x0,_0xc29361,_0xa98d2='',_0x44dacf='';_0x319ce3=atob(_0x319ce3);for(var _0x5d1246=0x0,_0xe03af5=_0x319ce3['length'];_0x5d1246<_0xe03af5;_0x5d1246++){_0x44dacf+='%'+('00'+_0x319ce3['charCodeAt'](_0x5d1246)['toString'](0x10))['slice'](-0x2);}_0x319ce3=decodeURIComponent(_0x44dacf);for(var _0x42d013=0x0;_0x42d013<0x100;_0x42d013++){_0x12f87f[_0x42d013]=_0x42d013;}for(_0x42d013=0x0;_0x42d013<0x100;_0x42d013++){_0x3143fb=(_0x3143fb+_0x12f87f[_0x42d013]+_0x44a305['charCodeAt'](_0x42d013%_0x44a305['length']))%0x100;_0xc29361=_0x12f87f[_0x42d013];_0x12f87f[_0x42d013]=_0x12f87f[_0x3143fb];_0x12f87f[_0x3143fb]=_0xc29361;}_0x42d013=0x0;_0x3143fb=0x0;for(var _0x2fd3ba=0x0;_0x2fd3ba<_0x319ce3['length'];_0x2fd3ba++){_0x42d013=(_0x42d013+0x1)%0x100;_0x3143fb=(_0x3143fb+_0x12f87f[_0x42d013])%0x100;_0xc29361=_0x12f87f[_0x42d013];_0x12f87f[_0x42d013]=_0x12f87f[_0x3143fb];_0x12f87f[_0x3143fb]=_0xc29361;_0xa98d2+=String['fromCharCode'](_0x319ce3['charCodeAt'](_0x2fd3ba)^_0x12f87f[(_0x12f87f[_0x42d013]+_0x12f87f[_0x3143fb])%0x100]);}return _0xa98d2;};_0x9abf['MvysHX']=_0x5bc729;_0x9abf['lCrxCY']={};_0x9abf['OmOKin']=!![];}var _0x2e12b9=_0x9abf['lCrxCY'][_0x42a531];if(_0x2e12b9===undefined){if(_0x9abf['PhwQlt']===undefined){_0x9abf['PhwQlt']=!![];}_0x12a3b4=_0x9abf['MvysHX'](_0x12a3b4,_0x44a305);_0x9abf['lCrxCY'][_0x42a531]=_0x12a3b4;}else{_0x12a3b4=_0x2e12b9;}return _0x12a3b4;};function randomWord(_0x30dad4,_0x48ccd1,_0x3142f8){var _0x49c568={'QDPAu':function(_0x38ba72,_0x395722){return _0x38ba72+_0x395722;},'bIemL':function(_0x32f60a,_0x4f33d3){return _0x32f60a<_0x4f33d3;},'dnSXy':function(_0xa6686d,_0x1324f0){return _0xa6686d-_0x1324f0;}};let _0xcb4472='',_0x2cc33d=_0x48ccd1,_0x498326=['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];if(_0x30dad4){_0x2cc33d=_0x49c568['QDPAu'](Math['round'](Math['random']()*(_0x3142f8-_0x48ccd1)),_0x48ccd1);}for(let _0x1d32c7=0x0;_0x49c568[_0x9abf('0','*iBE')](_0x1d32c7,_0x2cc33d);_0x1d32c7++){pos=Math[_0x9abf('1','0UXZ')](Math['random']()*_0x49c568[_0x9abf('2','E[QI')](_0x498326[_0x9abf('3','i[dl')],0x1));_0xcb4472+=_0x498326[pos];}return _0xcb4472;}function minusByByte(_0x10d3ac,_0x838199){var _0x513453={'fcYlL':function(_0x105901,_0x213bce){return _0x105901(_0x213bce);},'MeJpn':function(_0x292f5b,_0x3523d1){return _0x292f5b!==_0x3523d1;},'NWrxN':function(_0x54c839,_0x5601dd,_0x502cea){return _0x54c839(_0x5601dd,_0x502cea);},'ktMZE':function(_0x1f4c19,_0x200d25){return _0x1f4c19<_0x200d25;},'TOxZK':function(_0x519712,_0x785a01){return _0x519712-_0x785a01;}};var _0x1b8d4d=_0x10d3ac[_0x9abf('4','Bqj7')],_0x1125c5=_0x838199['length'],_0x16d1b8=Math['max'](_0x1b8d4d,_0x1125c5),_0x4d3d75=toAscii(_0x10d3ac),_0x35d9e1=_0x513453[_0x9abf('5','3YgF')](toAscii,_0x838199),_0x4d01f3='',_0x5cf368=0x0;for(_0x513453[_0x9abf('6','E[QI')](_0x1b8d4d,_0x1125c5)&&(_0x4d3d75=_0x513453[_0x9abf('7','o4Rd')](add0,_0x4d3d75,_0x16d1b8),_0x35d9e1=this[_0x9abf('8','u&BL')](_0x35d9e1,_0x16d1b8));_0x513453[_0x9abf('9','qZuM')](_0x5cf368,_0x16d1b8);)_0x4d01f3+=Math[_0x9abf('a','3YgF')](_0x513453[_0x9abf('b','u!Ts')](_0x4d3d75[_0x5cf368],_0x35d9e1[_0x5cf368])),_0x5cf368++;return _0x4d01f3;}function getKey(_0x5e0ea6,_0x4e40bf){var _0x5cc203={'NcEhy':function(_0x392cf4,_0x39383d){return _0x392cf4>=_0x39383d;},'Qsgte':function(_0x482de5,_0x1b8bfe){return _0x482de5^_0x1b8bfe;},'ralzv':function(_0x345b32,_0x5d1306){return _0x345b32%_0x5d1306;}};let _0x4e7162=[],_0x4abc73,_0x45589b=0x0;for(let _0x82ee2c=0x0;_0x82ee2c<_0x5e0ea6[_0x9abf('c','Gnha')]()['length'];_0x82ee2c++){_0x45589b=_0x82ee2c;if(_0x5cc203[_0x9abf('d','Bqj7')](_0x45589b,_0x4e40bf[_0x9abf('e','7BH@')]))_0x45589b-=_0x4e40bf['length'];_0x4abc73=_0x5cc203[_0x9abf('f','GYS(')](_0x5e0ea6[_0x9abf('10','E[QI')]()[_0x9abf('11','of50')](_0x82ee2c),_0x4e40bf[_0x9abf('12','y[^%')](_0x45589b));_0x4e7162[_0x9abf('13','Bqj7')](_0x5cc203[_0x9abf('14','GYS(')](_0x4abc73,0xa));}return _0x4e7162['toString']()[_0x9abf('15','zT)c')](/,/g,'');}function toAscii(_0x430e4d){var _0x2ef429={'BFPaj':function(_0x597f79,_0x48aba9){return _0x597f79^_0x48aba9;},'LkXoa':function(_0x10d1c3,_0x3d742a){return _0x10d1c3-_0x3d742a;},'znind':function(_0x4b71cc,_0x59ac64){return _0x4b71cc-_0x59ac64;},'LJvgI':function(_0xf1090b,_0x597d07){return _0xf1090b|_0x597d07;},'XtecK':function(_0x42bbe4,_0xa3fa2d){return _0x42bbe4<<_0xa3fa2d;},'RwJFC':function(_0x22c865,_0x39413a){return _0x22c865>>>_0x39413a;},'qKhHI':_0x9abf('16','yb$N'),'JUHLb':'sHsRw'};var _0x124df2='';for(var _0x39bbef in _0x430e4d){if(_0x2ef429[_0x9abf('17','TuOB')]!==_0x2ef429['JUHLb']){var _0x1645d2=_0x430e4d[_0x39bbef],_0x2294dd=/[a-zA-Z]/['test'](_0x1645d2);if(_0x430e4d[_0x9abf('18','3YgF')](_0x39bbef))if(_0x2294dd)_0x124df2+=getLastAscii(_0x1645d2);else _0x124df2+=_0x1645d2;}else{var _0x5376d6=_0x2ef429[_0x9abf('19','gn#Z')](a[_0x2ef429[_0x9abf('1a','u!Ts')](m,0x3)],a[m-0x8])^a[m-0xe]^a[_0x2ef429[_0x9abf('1b','7HX5')](m,0x10)];a[m]=_0x2ef429[_0x9abf('1c','[mI^')](_0x2ef429['XtecK'](_0x5376d6,0x1),_0x2ef429['RwJFC'](_0x5376d6,0x1f));}}return _0x124df2;}function add0(_0x2d83bb,_0x50d0d5){var _0x1c6833={'ewjCz':function(_0x4b50df,_0x2bcf00){return _0x4b50df(_0x2bcf00);}};return(_0x1c6833[_0x9abf('1d','6uPQ')](Array,_0x50d0d5)[_0x9abf('1e','0M&6')]('0')+_0x2d83bb)[_0x9abf('1f','[mI^')](-_0x50d0d5);}function getLastAscii(_0x57a8b4){var _0x292dc3={'sbUAo':function(_0x4773af,_0x58f721){return _0x4773af-_0x58f721;}};var _0x40edd9=_0x57a8b4['charCodeAt'](0x0)[_0x9abf('20','6lyr')]();return _0x40edd9[_0x292dc3[_0x9abf('21','E[QI')](_0x40edd9[_0x9abf('4','Bqj7')],0x1)];}function wordsToBytes(_0x442fb4){var _0x19972c={'xXYgx':function(_0x4b64f3,_0x5b9c9c){return _0x4b64f3<_0x5b9c9c;},'lYdDf':function(_0x14eeb3,_0x1137d4){return _0x14eeb3&_0x1137d4;},'oOhAH':function(_0x55e2d4,_0x1d3c69){return _0x55e2d4>>>_0x1d3c69;},'fYCwc':function(_0x222a5f,_0x49a42a){return _0x222a5f-_0x49a42a;},'ruQFK':function(_0x48b0fd,_0x1a5aa9){return _0x48b0fd%_0x1a5aa9;}};for(var _0x2a8491=[],_0x51a8a2=0x0;_0x19972c['xXYgx'](_0x51a8a2,0x20*_0x442fb4[_0x9abf('22','f&Ln')]);_0x51a8a2+=0x8)_0x2a8491[_0x9abf('23','j#z&')](_0x19972c[_0x9abf('24','f&Ln')](_0x442fb4[_0x19972c['oOhAH'](_0x51a8a2,0x5)]>>>_0x19972c[_0x9abf('25','GB!^')](0x18,_0x19972c['ruQFK'](_0x51a8a2,0x20)),0xff));return _0x2a8491;}function bytesToHex(_0x23ffbb){var _0x8c7ee0={'LIcyL':function(_0x594007,_0x16b2ce){return _0x594007<_0x16b2ce;},'sFdIO':function(_0x22d895,_0x40bf80){return _0x22d895>>>_0x40bf80;}};for(var _0x50876e=[],_0x4dcc3b=0x0;_0x8c7ee0[_0x9abf('26','[mI^')](_0x4dcc3b,_0x23ffbb['length']);_0x4dcc3b++)_0x50876e['push'](_0x8c7ee0[_0x9abf('27','TuOB')](_0x23ffbb[_0x4dcc3b],0x4)[_0x9abf('28','MREK')](0x10)),_0x50876e[_0x9abf('29','!4el')]((0xf&_0x23ffbb[_0x4dcc3b])[_0x9abf('2a','zT)c')](0x10));return _0x50876e[_0x9abf('2b','F4kw')]('');}function stringToBytes(_0x49ee3f){var _0x49cabe={'eYyOx':function(_0x20deb1,_0x8369ea){return _0x20deb1(_0x8369ea);},'arSRe':function(_0x291681,_0x3cfecf){return _0x291681<_0x3cfecf;},'VvAJL':function(_0x29207a,_0x368f62){return _0x29207a&_0x368f62;}};_0x49ee3f=unescape(_0x49cabe[_0x9abf('2c','u!Ts')](encodeURIComponent,_0x49ee3f));for(var _0xd0ebf3=[],_0x1a1e6c=0x0;_0x49cabe['arSRe'](_0x1a1e6c,_0x49ee3f['length']);_0x1a1e6c++)_0xd0ebf3[_0x9abf('2d','D2LL')](_0x49cabe[_0x9abf('2e','QgTs')](0xff,_0x49ee3f[_0x9abf('2f','i[dl')](_0x1a1e6c)));return _0xd0ebf3;}function bytesToWords(_0x41af55){var _0x119265={'dDEPe':function(_0xcd2bd4,_0x9d23de){return _0xcd2bd4<_0x9d23de;},'wngaH':function(_0x47d0a3,_0x55bc7f){return _0x47d0a3>>>_0x55bc7f;},'LZkyf':function(_0x5b8030,_0x4a9ef5){return _0x5b8030<<_0x4a9ef5;},'NxMev':function(_0xe80fca,_0x2cbcf6){return _0xe80fca-_0x2cbcf6;}};for(var _0x2a732f=[],_0x4cf540=0x0,_0x5dd26b=0x0;_0x119265['dDEPe'](_0x4cf540,_0x41af55['length']);_0x4cf540++,_0x5dd26b+=0x8)_0x2a732f[_0x119265[_0x9abf('30','shNJ')](_0x5dd26b,0x5)]|=_0x119265['LZkyf'](_0x41af55[_0x4cf540],_0x119265[_0x9abf('31','3YgF')](0x18,_0x5dd26b%0x20));return _0x2a732f;}function crc32(_0x224500){var _0x5c82f3={'VNOvk':function(_0x4d57bc,_0x12bc60){return _0x4d57bc<_0x12bc60;},'CidRo':function(_0x39e149,_0x34e455){return _0x39e149*_0x34e455;},'lFpMj':function(_0x2fee7a,_0x163c94){return _0x2fee7a&_0x163c94;},'EyCtf':function(_0x23b48b,_0x4c402e){return _0x23b48b>>>_0x4c402e;},'CHKZZ':function(_0x3611dc,_0x159ff9){return _0x3611dc-_0x159ff9;},'HuMdw':function(_0x4b4733,_0x4c4e6d){return _0x4b4733%_0x4c4e6d;},'HyRoc':function(_0x17afd3,_0x17f6ac){return _0x17afd3===_0x17f6ac;},'UTWIs':_0x9abf('32','MREK'),'REgPU':_0x9abf('33','0UXZ'),'CEjVo':function(_0x1df6f1,_0x2279cf){return _0x1df6f1<_0x2279cf;},'MVXAF':function(_0x4acc7f,_0x1578b6){return _0x4acc7f>_0x1578b6;},'AmTFb':function(_0x3e0c9e,_0xdeea43){return _0x3e0c9e|_0xdeea43;},'mtwpr':function(_0xd28cd0,_0x1dbb81){return _0xd28cd0>>_0x1dbb81;},'QjbKC':function(_0x10b6bb,_0x837ad5){return _0x10b6bb(_0x837ad5);},'Rqske':_0x9abf('34','E[QI'),'UhPZu':function(_0x182bee,_0x4d58e4){return _0x182bee^_0x4d58e4;},'tmfNX':function(_0x46fba1,_0x2f2d65){return _0x46fba1^_0x2f2d65;},'cdSuC':function(_0x290d97,_0x469e69){return _0x290d97>>>_0x469e69;},'ONkEo':function(_0x3e9b72,_0x48b800){return _0x3e9b72^_0x48b800;}};function _0x667144(_0x442d42){if(_0x5c82f3['HyRoc'](_0x5c82f3[_0x9abf('35','E[QI')],_0x5c82f3[_0x9abf('36','N30d')])){for(var _0x28bc2f=[],_0x38c37f=0x0;_0x5c82f3[_0x9abf('37','Ghbf')](_0x38c37f,_0x5c82f3[_0x9abf('38',']HQ(')](0x20,t[_0x9abf('39','E[QI')]));_0x38c37f+=0x8)_0x28bc2f['push'](_0x5c82f3[_0x9abf('3a','$jb#')](_0x5c82f3[_0x9abf('3b','j#z&')](t[_0x5c82f3[_0x9abf('3c','of50')](_0x38c37f,0x5)],_0x5c82f3[_0x9abf('3d','F4kw')](0x18,_0x5c82f3[_0x9abf('3e','F4kw')](_0x38c37f,0x20))),0xff));return _0x28bc2f;}else{_0x442d42=_0x442d42[_0x9abf('3f','XW8t')](/\r\n/g,'\x0a');var _0x420a44='';for(var _0x51eb42=0x0;_0x5c82f3[_0x9abf('40','6lyr')](_0x51eb42,_0x442d42['length']);_0x51eb42++){var _0x2b5458=_0x442d42[_0x9abf('41','E[QI')](_0x51eb42);if(_0x5c82f3[_0x9abf('42','Gnha')](_0x2b5458,0x80)){_0x420a44+=String[_0x9abf('43','i[dl')](_0x2b5458);}else if(_0x5c82f3['MVXAF'](_0x2b5458,0x7f)&&_0x2b5458<0x800){_0x420a44+=String[_0x9abf('44','!4el')](_0x5c82f3[_0x9abf('45',']HQ(')](_0x5c82f3[_0x9abf('46','i[dl')](_0x2b5458,0x6),0xc0));_0x420a44+=String[_0x9abf('47','[mI^')](_0x5c82f3[_0x9abf('48','j#z&')](_0x2b5458,0x3f)|0x80);}else{_0x420a44+=String[_0x9abf('49','XW8t')](_0x2b5458>>0xc|0xe0);_0x420a44+=String['fromCharCode'](_0x5c82f3[_0x9abf('4a','o4Rd')](_0x2b5458>>0x6&0x3f,0x80));_0x420a44+=String[_0x9abf('4b','F4kw')](_0x5c82f3['AmTFb'](_0x5c82f3[_0x9abf('4c','XW8t')](_0x2b5458,0x3f),0x80));}}return _0x420a44;}};_0x224500=_0x5c82f3[_0x9abf('4d','QgTs')](_0x667144,_0x224500);var _0x347067=[0x0,0x77073096,0xee0e612c,0x990951ba,0x76dc419,0x706af48f,0xe963a535,0x9e6495a3,0xedb8832,0x79dcb8a4,0xe0d5e91e,0x97d2d988,0x9b64c2b,0x7eb17cbd,0xe7b82d07,0x90bf1d91,0x1db71064,0x6ab020f2,0xf3b97148,0x84be41de,0x1adad47d,0x6ddde4eb,0xf4d4b551,0x83d385c7,0x136c9856,0x646ba8c0,0xfd62f97a,0x8a65c9ec,0x14015c4f,0x63066cd9,0xfa0f3d63,0x8d080df5,0x3b6e20c8,0x4c69105e,0xd56041e4,0xa2677172,0x3c03e4d1,0x4b04d447,0xd20d85fd,0xa50ab56b,0x35b5a8fa,0x42b2986c,0xdbbbc9d6,0xacbcf940,0x32d86ce3,0x45df5c75,0xdcd60dcf,0xabd13d59,0x26d930ac,0x51de003a,0xc8d75180,0xbfd06116,0x21b4f4b5,0x56b3c423,0xcfba9599,0xb8bda50f,0x2802b89e,0x5f058808,0xc60cd9b2,0xb10be924,0x2f6f7c87,0x58684c11,0xc1611dab,0xb6662d3d,0x76dc4190,0x1db7106,0x98d220bc,0xefd5102a,0x71b18589,0x6b6b51f,0x9fbfe4a5,0xe8b8d433,0x7807c9a2,0xf00f934,0x9609a88e,0xe10e9818,0x7f6a0dbb,0x86d3d2d,0x91646c97,0xe6635c01,0x6b6b51f4,0x1c6c6162,0x856530d8,0xf262004e,0x6c0695ed,0x1b01a57b,0x8208f4c1,0xf50fc457,0x65b0d9c6,0x12b7e950,0x8bbeb8ea,0xfcb9887c,0x62dd1ddf,0x15da2d49,0x8cd37cf3,0xfbd44c65,0x4db26158,0x3ab551ce,0xa3bc0074,0xd4bb30e2,0x4adfa541,0x3dd895d7,0xa4d1c46d,0xd3d6f4fb,0x4369e96a,0x346ed9fc,0xad678846,0xda60b8d0,0x44042d73,0x33031de5,0xaa0a4c5f,0xdd0d7cc9,0x5005713c,0x270241aa,0xbe0b1010,0xc90c2086,0x5768b525,0x206f85b3,0xb966d409,0xce61e49f,0x5edef90e,0x29d9c998,0xb0d09822,0xc7d7a8b4,0x59b33d17,0x2eb40d81,0xb7bd5c3b,0xc0ba6cad,0xedb88320,0x9abfb3b6,0x3b6e20c,0x74b1d29a,0xead54739,0x9dd277af,0x4db2615,0x73dc1683,0xe3630b12,0x94643b84,0xd6d6a3e,0x7a6a5aa8,0xe40ecf0b,0x9309ff9d,0xa00ae27,0x7d079eb1,0xf00f9344,0x8708a3d2,0x1e01f268,0x6906c2fe,0xf762575d,0x806567cb,0x196c3671,0x6e6b06e7,0xfed41b76,0x89d32be0,0x10da7a5a,0x67dd4acc,0xf9b9df6f,0x8ebeeff9,0x17b7be43,0x60b08ed5,0xd6d6a3e8,0xa1d1937e,0x38d8c2c4,0x4fdff252,0xd1bb67f1,0xa6bc5767,0x3fb506dd,0x48b2364b,0xd80d2bda,0xaf0a1b4c,0x36034af6,0x41047a60,0xdf60efc3,0xa867df55,0x316e8eef,0x4669be79,0xcb61b38c,0xbc66831a,0x256fd2a0,0x5268e236,0xcc0c7795,0xbb0b4703,0x220216b9,0x5505262f,0xc5ba3bbe,0xb2bd0b28,0x2bb45a92,0x5cb36a04,0xc2d7ffa7,0xb5d0cf31,0x2cd99e8b,0x5bdeae1d,0x9b64c2b0,0xec63f226,0x756aa39c,0x26d930a,0x9c0906a9,0xeb0e363f,0x72076785,0x5005713,0x95bf4a82,0xe2b87a14,0x7bb12bae,0xcb61b38,0x92d28e9b,0xe5d5be0d,0x7cdcefb7,0xbdbdf21,0x86d3d2d4,0xf1d4e242,0x68ddb3f8,0x1fda836e,0x81be16cd,0xf6b9265b,0x6fb077e1,0x18b74777,0x88085ae6,0xff0f6a70,0x66063bca,0x11010b5c,0x8f659eff,0xf862ae69,0x616bffd3,0x166ccf45,0xa00ae278,0xd70dd2ee,0x4e048354,0x3903b3c2,0xa7672661,0xd06016f7,0x4969474d,0x3e6e77db,0xaed16a4a,0xd9d65adc,0x40df0b66,0x37d83bf0,0xa9bcae53,0xdebb9ec5,0x47b2cf7f,0x30b5ffe9,0xbdbdf21c,0xcabac28a,0x53b39330,0x24b4a3a6,0xbad03605,0xcdd70693,0x54de5729,0x23d967bf,0xb3667a2e,0xc4614ab8,0x5d681b02,0x2a6f2b94,0xb40bbe37,0xc30c8ea1,0x5a05df1b,0x2d02ef8d];var _0xe8eabb=0x0;var _0x2499fb=0x0;_0x2499fb=_0x2499fb^-0x1;for(var _0x52cef4=0x0,_0x264329=_0x224500[_0x9abf('4e','!4el')];_0x5c82f3[_0x9abf('4f','y[^%')](_0x52cef4,_0x264329);_0x52cef4++){if(_0x5c82f3['HyRoc'](_0x5c82f3[_0x9abf('50','shNJ')],_0x5c82f3[_0x9abf('51','Xoqi')])){_0xe8eabb=_0x224500[_0x9abf('52','0UXZ')](_0x52cef4);_0x2499fb=_0x5c82f3[_0x9abf('53','d4X5')](_0x347067[0xff&_0x5c82f3['tmfNX'](_0x2499fb,_0xe8eabb)],_0x5c82f3[_0x9abf('54','yb$N')](_0x2499fb,0x8));}else{for(var _0x26274d=[],_0x2668b3=0x0;_0x5c82f3[_0x9abf('55','of50')](_0x2668b3,t[_0x9abf('56',']HQ(')]);_0x2668b3++)_0x26274d[_0x9abf('57','I60p')]((t[_0x2668b3]>>>0x4)['toString'](0x10)),_0x26274d[_0x9abf('58','MREK')](_0x5c82f3[_0x9abf('59','6lyr')](0xf,t[_0x2668b3])[_0x9abf('5a','FeFt')](0x10));return _0x26274d[_0x9abf('5b',']HQ(')]('');}}return _0x5c82f3[_0x9abf('5c','n8^n')](-0x1,_0x2499fb)>>>0x0;};function getBody(){var _0x2a3c31={'OPEZW':function(_0x353dc9,_0x187af){return _0x353dc9+_0x187af;},'PthqS':function(_0x30e854,_0x249a78,_0x496953){return _0x30e854(_0x249a78,_0x496953);},'xvuiq':_0x9abf('5d','vIdj'),'RLrGY':function(_0x1c94e6,_0x23857a){return _0x1c94e6(_0x23857a);},'zANuB':function(_0x2c9880,_0x1f0a68){return _0x2c9880(_0x1f0a68);},'lrqRS':function(_0x1b6dd4,_0x1aa8d9){return _0x1b6dd4(_0x1aa8d9);},'INGUE':_0x9abf('5e','y[^%'),'WfGDd':function(_0x4953f0,_0xa1f97){return _0x4953f0(_0xa1f97);},'HusTS':function(_0x260705,_0x500d1f,_0xe22545){return _0x260705(_0x500d1f,_0xe22545);},'FnEAF':function(_0x5e0167,_0x1e3ad9){return _0x5e0167+_0x1e3ad9;},'dqaJz':function(_0x6a908b,_0x434500){return _0x6a908b+_0x434500;},'koCLl':function(_0x139b6b,_0x49218c){return _0x139b6b+_0x49218c;},'OhuRP':function(_0x5dd207,_0x31fb22){return _0x5dd207+_0x31fb22;},'gWgIf':function(_0x4d3edf,_0x69aef5){return _0x4d3edf+_0x69aef5;},'JnEPE':_0x9abf('5f','Bny1')};let _0x441208=Math[_0x9abf('60','o4Rd')](_0x2a3c31[_0x9abf('61','j#z&')](0xf4240,0x895440*Math[_0x9abf('62','7BH@')]()))[_0x9abf('63','$jb#')]();let _0x4631eb=_0x2a3c31[_0x9abf('64','GYS(')](randomWord,![],0xa);let _0x4f5a30=_0x2a3c31[_0x9abf('65','Gnha')];let _0x80d395=Date[_0x9abf('66','yb$N')]();let _0x3c206f=_0x2a3c31[_0x9abf('67','NsJB')](getKey,_0x80d395,_0x4631eb);let _0x18d2d4=_0x9abf('68','f&Ln')+_0x441208+'&token='+_0x4f5a30+_0x9abf('69','f&Ln')+_0x80d395+_0x9abf('6a','Gnha')+_0x4631eb+_0x9abf('6b','qZuM')+_0x3c206f+_0x9abf('6c','o4Rd');let _0x3d77fb=_0x2a3c31['RLrGY'](bytesToHex,_0x2a3c31[_0x9abf('6d','7HX5')](wordsToBytes,getSign(_0x18d2d4)))['toUpperCase']();let _0x38cea9=_0x2a3c31['lrqRS'](crc32,_0x3d77fb)['toString'](0x24);_0x38cea9=add0(_0x38cea9,0x7);let _0x4307ee='{\x22ss\x22:\x22'+(_0x80d395[_0x9abf('6e','D2LL')]()+_0x2a3c31[_0x9abf('6f','N30d')])+'\x22,\x22wed\x22:\x22ttttt\x22,\x22wea\x22:\x22fft\x22,\x22pdn\x22:[6,812,2,3,3,1],\x22jj\x22:1,\x22cs\x22:\x22863dec95716d7bb22c2e28b26a84e34e\x22,\x22np\x22:\x22Win32\x22,\x22t\x22:'+_0x80d395[_0x9abf('c','Gnha')]()+_0x9abf('70','Gnha')+_0x441208+_0x9abf('71','XW8t');let _0x49caf2=$[_0x9abf('72','NsJB')][_0x9abf('73','wm#m')][_0x9abf('74','Gnha')][_0x9abf('75','0M&6')](_0x2a3c31['WfGDd'](unescape,_0x2a3c31[_0x9abf('76',']HQ(')](encodeURIComponent,_0x2a3c31[_0x9abf('77','Ghbf')](xorEncrypt,_0x4307ee,_0x3c206f))));_0x49caf2=$[_0x9abf('78','ZU@p')][_0x9abf('79','3YgF')][_0x9abf('7a','wm#m')][_0x9abf('7b',']HQ(')](_0x49caf2);let _0x103d91=_0x2a3c31[_0x9abf('7c','u&BL')](crc32,_0x49caf2)[_0x9abf('7d','d4X5')](0x24);_0x103d91=add0(_0x103d91,0x7);_0x3d77fb=_0x2a3c31[_0x9abf('7e','d4X5')](_0x2a3c31['dqaJz'](_0x2a3c31['koCLl'](_0x2a3c31[_0x9abf('7f','0UXZ')](_0x2a3c31[_0x9abf('80','3YgF')](_0x2a3c31[_0x9abf('81','D2LL')](_0x2a3c31[_0x9abf('82','D2LL')](_0x80d395[_0x9abf('83','N30d')](),'~1')+_0x4631eb,_0x4f5a30)+'~4,1~',_0x3d77fb)+'~',_0x38cea9),_0x9abf('84',')%nk')),_0x49caf2)+'~',_0x103d91);s=JSON[_0x9abf('85','NsJB')]({'extraData':{'log':encodeURIComponent(_0x3d77fb),'sceneid':_0x2a3c31['JnEPE']},'secretp':$[_0x9abf('86','N30d')]||secretp,'random':_0x441208[_0x9abf('63','$jb#')]()});return s;}function xorEncrypt(_0x314f5d,_0x2b4537){var _0x1554bb={'DBsis':function(_0x7a69e6,_0x5bbf96){return _0x7a69e6<_0x5bbf96;},'WdgGK':_0x9abf('4b','F4kw'),'oekLH':function(_0xbce105,_0x3171b1){return _0xbce105%_0x3171b1;}};for(var _0xd63acb=_0x2b4537['length'],_0xc82778='',_0x347fe5=0x0;_0x1554bb[_0x9abf('87','0M&6')](_0x347fe5,_0x314f5d['length']);_0x347fe5++)_0xc82778+=String[_0x1554bb[_0x9abf('88','0M&6')]](_0x314f5d[_0x347fe5]['charCodeAt']()^_0x2b4537[_0x1554bb[_0x9abf('89','XW8t')](_0x347fe5,_0xd63acb)][_0x9abf('8a','F4kw')]());return _0xc82778;}function getSign(_0x35d0f5){var _0x565f51={'RtpXz':function(_0x52134c,_0x2150f6){return _0x52134c&_0x2150f6;},'KilJe':function(_0x1a3a93,_0x2c9448){return _0x1a3a93>>>_0x2c9448;},'qiMtn':function(_0x1aa214,_0x4f5e78){return _0x1aa214(_0x4f5e78);},'ewrhA':function(_0xd54187,_0x352a47){return _0xd54187<<_0x352a47;},'FWBtm':function(_0x1e1b9e,_0x32b31b){return _0x1e1b9e-_0x32b31b;},'poUfG':function(_0x9a063b,_0x3ed212){return _0x9a063b%_0x3ed212;},'SjzkM':function(_0x143df6,_0x493570){return _0x143df6+_0x493570;},'HveBn':function(_0x1918ab,_0x1f13a2){return _0x1918ab<<_0x1f13a2;},'MAGGN':function(_0x37ee69,_0x2dd64c){return _0x37ee69+_0x2dd64c;},'dgLvh':function(_0x33bac3,_0x44f583){return _0x33bac3<_0x44f583;},'SdjCw':function(_0x5745bd,_0x3357dd){return _0x5745bd+_0x3357dd;},'WXFje':_0x9abf('8b','d4X5'),'dgBdB':function(_0x1c1986,_0x16e121){return _0x1c1986^_0x16e121;},'vEkZu':function(_0x472d88,_0x836edf){return _0x472d88^_0x836edf;},'gohYd':function(_0x4ff6d7,_0x2644a9){return _0x4ff6d7-_0x2644a9;},'PerHw':function(_0x1320ce,_0x540f5d){return _0x1320ce<<_0x540f5d;},'lkOLk':function(_0x19ec94,_0x44bb71){return _0x19ec94+_0x44bb71;},'ILTPp':function(_0x39b0a6,_0x38f04e){return _0x39b0a6+_0x38f04e;},'mkoBc':function(_0x21d7fb,_0x29dd49){return _0x21d7fb+_0x29dd49;},'Mwrrl':function(_0x1a9eac,_0x251038){return _0x1a9eac|_0x251038;},'cpgUj':function(_0x344420,_0x580c8b){return _0x344420>>>_0x580c8b;},'gRGIi':function(_0x40c4ca,_0x431f08){return _0x40c4ca<_0x431f08;},'wGBLx':function(_0x3e9382,_0x4aeadb){return _0x3e9382+_0x4aeadb;},'aGlsN':function(_0xf34595,_0x1ee85b){return _0xf34595<_0x1ee85b;},'Wqnbf':function(_0xc22277,_0x15c8a2){return _0xc22277^_0x15c8a2;},'uJUjz':function(_0x30f309,_0x4ea583){return _0x30f309<_0x4ea583;},'PlijB':function(_0xfde82a,_0x15813e){return _0xfde82a-_0x15813e;},'rvbGT':function(_0x17726e,_0x136c5e){return _0x17726e&_0x136c5e;}};_0x35d0f5=_0x565f51[_0x9abf('8c','FeFt')](stringToBytes,_0x35d0f5);var _0x3068c0=_0x565f51[_0x9abf('8d','u!Ts')](bytesToWords,_0x35d0f5),_0x216ae1=0x8*_0x35d0f5['length'],_0x47c456=[],_0x2adcc8=0x67452301,_0xc5b255=-0x10325477,_0x7780e6=-0x67452302,_0x120f48=0x10325476,_0x1aa1e1=-0x3c2d1e10;_0x3068c0[_0x216ae1>>0x5]|=_0x565f51['ewrhA'](0x80,_0x565f51[_0x9abf('8e','7BH@')](0x18,_0x565f51['poUfG'](_0x216ae1,0x20))),_0x3068c0[_0x565f51[_0x9abf('8f','u!Ts')](0xf,_0x565f51[_0x9abf('90','0M&6')](_0x565f51[_0x9abf('91','j#z&')](_0x565f51[_0x9abf('92','wm#m')](_0x216ae1,0x40),0x9),0x4))]=_0x216ae1;for(var _0x458cb3=0x0;_0x565f51[_0x9abf('93','yb$N')](_0x458cb3,_0x3068c0[_0x9abf('94','F4kw')]);_0x458cb3+=0x10){for(var _0x2bd0cc=_0x2adcc8,_0x40ac95=_0xc5b255,_0x2c63ff=_0x7780e6,_0x222627=_0x120f48,_0x3ad26f=_0x1aa1e1,_0x4a44bc=0x0;_0x565f51[_0x9abf('95','NsJB')](_0x4a44bc,0x50);_0x4a44bc++){if(_0x565f51[_0x9abf('96','o4Rd')](_0x4a44bc,0x10))_0x47c456[_0x4a44bc]=_0x3068c0[_0x565f51[_0x9abf('97','Ghbf')](_0x458cb3,_0x4a44bc)];else{if(_0x565f51[_0x9abf('98','N30d')]==='DzzWl'){var _0x7bca9c=_0x565f51[_0x9abf('99','of50')](_0x565f51[_0x9abf('9a','GB!^')](_0x47c456[_0x4a44bc-0x3],_0x47c456[_0x565f51[_0x9abf('9b','F4kw')](_0x4a44bc,0x8)])^_0x47c456[_0x565f51['gohYd'](_0x4a44bc,0xe)],_0x47c456[_0x4a44bc-0x10]);_0x47c456[_0x4a44bc]=_0x565f51[_0x9abf('9c','F4kw')](_0x7bca9c,0x1)|_0x565f51['KilJe'](_0x7bca9c,0x1f);}else{x=str[_0x9abf('9d','ZU@p')](_0x216ae1);_0x3ad26f=table[_0x565f51[_0x9abf('9e','XW8t')](0xff,_0x3ad26f^x)]^_0x565f51[_0x9abf('9f','0UXZ')](_0x3ad26f,0x8);}}var _0x3df30a=_0x565f51[_0x9abf('a0',']HQ(')](_0x565f51['ILTPp'](_0x565f51[_0x9abf('a1','!4el')](_0x565f51[_0x9abf('a2','qZuM')](_0x2adcc8<<0x5,_0x565f51[_0x9abf('a3','n8^n')](_0x2adcc8,0x1b)),_0x1aa1e1),_0x47c456[_0x4a44bc]>>>0x0),_0x565f51[_0x9abf('a4','u&BL')](_0x4a44bc,0x14)?_0x565f51[_0x9abf('a5','[mI^')](0x5a827999,_0x565f51['RtpXz'](_0xc5b255,_0x7780e6)|_0x565f51[_0x9abf('a6','y[^%')](~_0xc5b255,_0x120f48)):_0x565f51[_0x9abf('a7','o4Rd')](_0x4a44bc,0x28)?_0x565f51['wGBLx'](0x6ed9eba1,_0x565f51['Wqnbf'](_0x565f51[_0x9abf('a8','$jb#')](_0xc5b255,_0x7780e6),_0x120f48)):_0x565f51['uJUjz'](_0x4a44bc,0x3c)?_0x565f51[_0x9abf('a9','[mI^')](_0x565f51[_0x9abf('aa','XW8t')](_0x565f51['RtpXz'](_0xc5b255,_0x7780e6)|_0x565f51[_0x9abf('ab','0UXZ')](_0xc5b255,_0x120f48),_0x565f51[_0x9abf('ac','D2LL')](_0x7780e6,_0x120f48)),0x70e44324):_0x565f51['PlijB'](_0x565f51[_0x9abf('ad',']HQ(')](_0xc5b255,_0x7780e6)^_0x120f48,0x359d3e2a));_0x1aa1e1=_0x120f48,_0x120f48=_0x7780e6,_0x7780e6=_0x565f51[_0x9abf('ae','n8^n')](_0x565f51[_0x9abf('af',')%nk')](_0xc5b255,0x1e),_0x565f51[_0x9abf('a3','n8^n')](_0xc5b255,0x2)),_0xc5b255=_0x2adcc8,_0x2adcc8=_0x3df30a;}_0x2adcc8+=_0x2bd0cc,_0xc5b255+=_0x40ac95,_0x7780e6+=_0x2c63ff,_0x120f48+=_0x222627,_0x1aa1e1+=_0x3ad26f;}return[_0x2adcc8,_0xc5b255,_0x7780e6,_0x120f48,_0x1aa1e1];};_0xod0='jsjiami.com.v6';
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
