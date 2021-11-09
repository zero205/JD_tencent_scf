/*
双11特务
APP首页下滑,任务，互助
cron 10 9,13,15,16,19,20 2-8 11 * https://raw.githubusercontent.com/star261/jd/main/scripts/jd_superBrand.js
* */
const $ = new Env('双11特务');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
let cookiesArr = [];
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
    };
} else {
    cookiesArr = [
        $.getdata("CookieJD"),
        $.getdata("CookieJD2"),
        ...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie)].filter((item) => !!item);
}
let shareList = [];
!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        return;
    }
    for (let i = 0; i < cookiesArr.length; i++) {
        if (cookiesArr[i]) {
            $.cookie = cookiesArr[i];
            $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            await TotalBean();
            console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
                if ($.isNode()) {
                    await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                }
                continue
            }
            try{
                await main($.cookie)
            }catch (e) {
                console.log(JSON.stringify(e))
            }
        }
    }
    if(shareList.length === 0){return;}
    let allShareList = [];
    for (let i = 0; i < cookiesArr.length; i++) {
        let cookie = cookiesArr[i];
        let userName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1]);
        for (let j = 0; j < shareList.length; j++) {
            if(shareList[j].user === userName){
                allShareList.push(shareList[j]);
                break;
            }
        }
    }
    await getShareCode('tewu.json')
    allShareList = [...new Set([...allShareList, ...($.shareCode || [])])]
    console.log(`\n-----------------------互助----------------------\n`)
    for (let i = 0; i < cookiesArr.length; i++) {
        let cookie = cookiesArr[i];
        let userName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1]);
        let canHelp = true;
        for (let j = 0; j < allShareList.length && canHelp; j++) {
            let oneCodeInfo = allShareList[j];
            if(oneCodeInfo.user === userName || oneCodeInfo.need === 0){
                continue;
            }
            console.log(`\n${userName}去助力:${oneCodeInfo.user}`);
            let doSupport = await takeRequest(cookie,'superBrandDoTask',`{"source":"card","activityId":${oneCodeInfo.activityId},"encryptProjectId":"${oneCodeInfo.encryptProjectId}","encryptAssignmentId":"${oneCodeInfo.encryptAssignmentId}","assignmentType":2,"itemId":"${oneCodeInfo.itemId}","actionType":0}`);
            if(doSupport.bizCode === '0'){
                console.log(`助力成功`);
            }else if(doSupport.bizCode === '103'){
                console.log(`助力已满`);
                oneCodeInfo.max = true;
            }else if(doSupport.bizCode === '108'){
                console.log(`助力次数已用完`);
                canHelp = false;
            }
            console.log(`助力结果：${JSON.stringify(doSupport)}`);
            await $.wait(2000);
        }
    }
})().catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
}).finally(() => {
    $.done();
});

function getShareCode(name) {
  return new Promise(resolve => {
    $.get({
      url: "https://raw.fastgit.org/zero205/updateTeam/main/shareCodes/"+name,
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }
    }, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`);
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          console.log(`优先账号内部互助，有剩余助力次数再帮【zero205】助力`);
          $.shareCode = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

async function main(cookie) {
    let userName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1]);
    let cardInfo = await takeRequest(cookie,'showSecondFloorCardInfo',`{"source":"card"}`);
    if( JSON.stringify(cardInfo) === '{}' || !cardInfo || !cardInfo.result || !cardInfo.result.activityBaseInfo){
        console.log(`${userName},获取活动详情失败1`);
        return ;
    }
    let activityBaseInfo = cardInfo.result.activityBaseInfo;
    let activityId = activityBaseInfo.activityId;
    let taskListInfo = await takeRequest(cookie,'superBrandTaskList',`{"source":"card","activityId":${activityId},"assistInfoFlag":1}`);
    if(JSON.stringify(taskListInfo) === '{}' || JSON.stringify(cardInfo) === '{}'){
        console.log(`${userName},获取活动详情失败2`);
        return ;
    }
    if(!taskListInfo || !taskListInfo.result || !taskListInfo.result.taskList){
        console.log(`${userName},黑号`);
        return;
    }
    let taskList = taskListInfo.result.taskList || [];
    console.log(`\n${userName},获取活动详情成功`);
    let encryptProjectId = activityBaseInfo.encryptProjectId;
    let activityCardInfo = cardInfo.result.activityCardInfo;
    if(activityCardInfo.divideTimeStatus === 1 && activityCardInfo.divideStatus === 0 && activityCardInfo.cardStatus === 1){
        console.log(`${userName},去瓜分`);
        let lotteryInfo = await takeRequest(cookie,'superBrandTaskLottery',`{"source":"card","activityId":${activityId},"encryptProjectId":"${encryptProjectId}","tag":"divide"}`);
        console.log(`结果：${JSON.stringify(lotteryInfo)}`);
        return ;
    }else if(activityCardInfo.divideTimeStatus === 1 && activityCardInfo.divideStatus === 1 && activityCardInfo.cardStatus === 1){
        console.log(`${userName},已瓜分`);
        return ;
    }else{
        console.log(`${userName},未集齐或者未到瓜分时间`);
    }
    await $.wait(2000);
    for (let i = 0; i < taskList.length; i++) {
        let oneTask = taskList[i];
        if(oneTask.completionFlag){
            console.log(`任务：${oneTask.assignmentName},已完成`);
            if(oneTask.assignmentType === 2){
                let time = oneTask.ext.cardAssistBoxRest || '0';
                for (let j = 0; j < time; j++) {
                    console.log(`领取助力奖励`);
                    let lottery = await takeRequest(cookie,'superBrandTaskLottery',`{"source":"card","activityId":${activityId},"encryptProjectId":"${encryptProjectId}"}`);
                    console.log(`结果：${JSON.stringify(lottery)}`);
                    await $.wait(3000);
                }
            }
            continue;
        }
        if(oneTask.assignmentType === 1){
            console.log(`任务：${oneTask.assignmentName},去执行,请稍稍`);
            let itemId = oneTask.ext.shoppingActivity[0].itemId || '';
            if(!itemId){
                console.log(`任务：${oneTask.assignmentName},信息异常`);
            }
            let doInfo = await takeRequest(cookie,'superBrandDoTask',`{"source":"card","activityId":${activityId},"encryptProjectId":"${encryptProjectId}","encryptAssignmentId":"${oneTask.encryptAssignmentId}","assignmentType":${oneTask.assignmentType},"itemId":"${itemId}","actionType":0}`);
            console.log(`执行结果：${JSON.stringify(doInfo)}`);
            await $.wait(3000);
        }
        if(oneTask.assignmentType === 3){
            console.log(`任务：${oneTask.assignmentName},去执行,请稍稍`);
            let itemId = oneTask.ext.followShop[0].itemId || '';
            if(!itemId){
                console.log(`任务：${oneTask.assignmentName},信息异常`);
            }
            let doInfo = await takeRequest(cookie,'superBrandDoTask',`{"source":"card","activityId":${activityId},"encryptProjectId":"${encryptProjectId}","encryptAssignmentId":"${oneTask.encryptAssignmentId}","assignmentType":${oneTask.assignmentType},"itemId":"${itemId}","actionType":0}`);
            console.log(`执行结果：${JSON.stringify(doInfo)}`);
            await $.wait(3000);
        }
        if(oneTask.assignmentType === 7){
            console.log(`任务：${oneTask.assignmentName},去执行,请稍稍`);
            let itemId = oneTask.ext.brandMemberList[0].itemId || '';
            if(!itemId){
                console.log(`任务：${oneTask.assignmentName},信息异常`);
            }
            let doInfo = await takeRequest(cookie,'superBrandDoTask',`{"source":"card","activityId":${activityId},"encryptProjectId":"${encryptProjectId}","encryptAssignmentId":"${oneTask.encryptAssignmentId}","assignmentType":${oneTask.assignmentType},"itemId":"${itemId}","actionType":0}`);
            console.log(`执行结果：${JSON.stringify(doInfo)}`);
            await $.wait(3000);
        }
        if(oneTask.assignmentType === 5){
            let signList = oneTask.ext.sign2 || [];
            if(signList.length === 0){
                console.log(`任务：${oneTask.assignmentName},信息异常`);
            }
            if(oneTask.assignmentName === '首页限时下拉'){
                for (let j = 0; j < signList.length; j++) {
                    if(signList[j].status === 1){
                        console.log(`任务：${oneTask.assignmentName},去执行,请稍稍`);
                        let itemId = signList[j].itemId;
                        let doInfo = await takeRequest(cookie,'superBrandDoTask',`{"source":"card","activityId":${activityId},"encryptProjectId":"${encryptProjectId}","encryptAssignmentId":"${oneTask.encryptAssignmentId}","assignmentType":${oneTask.assignmentType},"itemId":"${itemId}","actionType":0,"dropDownChannel":1}`);
                        console.log(`执行结果：${JSON.stringify(doInfo)}`);
                        await $.wait(3000);
                    }
                }
            }else if(oneTask.assignmentName.indexOf('小游戏') !== -1){
                for (let j = 0; j < signList.length; j++) {
                    if(signList[j].status === 1){
                        console.log(`任务：${oneTask.assignmentName},去执行,请稍稍`);
                        let gameInfo = await takeRequest(cookie,'showSecondFloorGameInfo',`{"source":"card"}`);
                        let secCode = gameInfo.result.activityGameInfo.gameCurrentRewardInfo.secCode;
                        let gameEncryptAssignmentId = gameInfo.result.activityGameInfo.gameCurrentRewardInfo.encryptAssignmentId;
                        await $.wait(3000);
                        let doInfo = await takeRequest(cookie,'superBrandTaskLottery',`{"source":"card","activityId":${activityId},"encryptProjectId":"${encryptProjectId}","encryptAssignmentId":"${gameEncryptAssignmentId}","secCode":"${secCode}"}`);
                        console.log(`执行结果：${JSON.stringify(doInfo)}`);
                        await $.wait(3000);
                    }
                }
            }
        }
        if(oneTask.assignmentType === 2){
            let itemId = oneTask.ext.assistTaskDetail.itemId || '';
            if(!itemId){
                console.log(`任务：${oneTask.assignmentName},信息异常`);
            }
            shareList.push({'user':userName,'activityId':activityId,'encryptProjectId':encryptProjectId,'encryptAssignmentId':oneTask.encryptAssignmentId,'itemId':itemId,'max':false});
        }
    }
}
async function takeRequest(cookie,functionId,bodyInfo){
    let body = ``
    let url = `https://api.m.jd.com/?uuid=8888&client=wh5&area=&appid=ProductZ4Brand&functionId=${functionId}&t=${Date.now()}&body=${encodeURIComponent(bodyInfo)}`;
    const headers = {
        'Origin' : `https://prodev.m.jd.com`,
        'Cookie' : cookie ,
        'Connection' : `keep-alive`,
        'Accept' : `application/json, text/plain, */*`,
        'Referer' : `https://prodev.m.jd.com/mall/active/ZskuZGqQMZ2j6L99PM1L8jg2F2a/index.html`,
        'Host' : `api.m.jd.com`,
        'user-agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        'Accept-Language' : `zh-cn`,
        'Accept-Encoding' : `gzip, deflate, br`
    };
    let myRequest =  {url: url, headers: headers,body:body};
    return new Promise(async resolve => {
        $.post(myRequest, (err, resp, data) => {
            try {
                if(err){
                    console.log(err);
                }else{
                    data = JSON.parse(data);
                    if(data && data.data && JSON.stringify(data.data) === '{}'){
                        console.log(JSON.stringify(data))
                    }
                }
            } catch (e) {
                console.log(data);
                //$.logErr(e, resp)
            } finally {
                resolve(data.data || {});
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
                "Cookie": $.cookie,
                "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
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

function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
