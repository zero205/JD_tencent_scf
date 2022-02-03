/*
发财挖宝
更新时间：2021-10-30
活动入口：极速版-发财挖宝
目前需要下一单才能通关，需要的自己玩下
活动部分账号验证h5st参数，请自行抓包参数添加 
小号助力大号，抓包助力成功链接在代码227行修改为完整抓包链接，运行脚本提示 都黑号了，别薅了 为正常现象。
h5st参数有时效性，抓包后请及时运行脚本
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#发财挖宝
40 6,17 * * * https://raw.githubusercontent.com/zero205/JD_tencent_scf/main/jd_fcwb_help.js, tag=发财挖宝, img-url=https://github.com/58xinian/icon/raw/master/jdgc.png, enabled=true

================Loon==============
[Script]
cron "40 6,17 * * *" script-path=https://raw.githubusercontent.com/zero205/JD_tencent_scf/main/jd_fcwb_help.js,tag=发财挖宝

===============Surge=================
发财挖宝 = type=cron,cronexp="40 6,17 * * *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/zero205/JD_tencent_scf/main/jd_fcwb_help.js

============小火箭=========
发财挖宝 = type=cron,script-path=https://raw.githubusercontent.com/zero205/JD_tencent_scf/main/jd_fcwb_help.js, cronexpr="40 6,17 * * *", timeout=3600, enable=true

* * */
const $ = new Env('发财挖宝');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
let cookiesArr = [];
let link = `pTTvJeSTrpthgk9ASBVGsw`;
let wbRun = false;
const JD_API_HOST = 'https://api.m.jd.com';
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
    };
    if (process.env.JD_FCWB_WB) {
        wbRun = process.env.JD_FCWB_WB || wbRun;
    }
} else {
    cookiesArr = [
        $.getdata("CookieJD"),
        $.getdata("CookieJD2"),
        ...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie)].filter((item) => !!item);
}
let cookie = '';
let fcwbinviter = "";
let fcwbinviteCode = "";
let roundList =[]
let curRound = 1
!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        return;
    }
	console.log("\n活动入口：极速版-》我的-》发财挖宝"+"\n请务必先手动进入活动后随意点击方块后执行脚本"+"\n若点击方块获得0.01红包即活动黑了。"+"\n没助力是因为验证h5st，自行抓包替换");
    let res = [];
    for (let i = 0; i < cookiesArr.length; i++) {
        if (cookiesArr[i]) {
            cookie = cookiesArr[i];
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            //await TotalBean();
            console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/`, {"open-url": "https://bean.m.jd.com/"});
                if ($.isNode()) {
                    await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                }
                continue
            }
            roundList =[]
            try {
                await main()
            } catch (e) {
                $.logErr(e)
            }

            if(wbRun) {
                let data = roundList.filter(e => e.round === curRound)
                if (!data[0]) {
                    continue
                }
                console.log('当前正在通关' + curRound + '关\n')
                for (let chunk of data[0].chunks.filter(e => e.state !== 1)) {
                    await wb(curRound, chunk.colIdx, chunk.rowIdx)
                    await $.wait(3000)
                }
            }
        }
    }
})().catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
}).finally(() => {
    $.done();
});
function wb(round,rowIdx,colIdx) {

    return new Promise((resolve) => {
        let body = {"round":curRound,"rowIdx":rowIdx,"colIdx":colIdx,"linkId":link}
        $.get(taskurl("happyDigDo",body), async (err, resp, data) => {

            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (safeGet(data)) {
                        data = JSON.parse(data);
                        if(data.success === true){
                            if(data.data.chunk.type ===4 ){
                                console.log(`挖到炸弹  哦嚯`)
                            }else if(data.data.chunk.type == 1){
                                console.log(`挖到优惠券 ${data.data.chunk.value}`)
                            }else if(data.data.chunk.type == 2){
                                console.log(`挖到红包 ${data.data.chunk.value}`)
                            }else if(data.data.chunk.type == 3){
                                console.log(`挖到现金 ${data.data.chunk.value}`)
                            }

                            // console.log(`export fcwbinviter='${data.data.markedPin}'`)
                        }else {

                            console.log(`挖宝异常   `+data.errMsg)
                        }
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}
async function main() {
    let homeInfo = await takeRequest(`happyDigHome`,`{"linkId":"${link}"}`,true);
    if(JSON.stringify(homeInfo) === '{}' || !homeInfo){
        console.log(`都黑号了，别薅了`);
        return;
    }
    console.log(`获取活动详情成功`);
    roundList = homeInfo.roundList
    curRound = homeInfo.curRound
    console.log(`fcwbinviteCode='${homeInfo.inviteCode}'`)
    console.log(`fcwbinviter='${homeInfo.markedPin}'`)
    if(fcwbinviter && fcwbinviteCode){
        console.log(`去助力:${fcwbinviter}`);
        await takeRequest(`happyDigHelp`,`{"linkId":"${link}","inviter":"${fcwbinviter}","inviteCode":"${fcwbinviteCode}"}`);
        //console.log(`助力结果：${JSON.stringify(homeInfo)}`);
    }
    $.freshFlag = false;
    if($.index === 1){
        fcwbinviter = homeInfo.markedPin;
        fcwbinviteCode = homeInfo.inviteCode;
		await doTask();
    }

    if($.freshFlag){
        await $.wait(2000);
        homeInfo = await takeRequest(`happyDigHome`,`{"linkId":"${link}"}`,true);
    }
    let blood = homeInfo.blood;
    console.log(`当前有${blood}滴血`);
}
async function doTask(){
    let taskList = await takeRequest(`apTaskList`,`{"linkId":"${link}"}`);
    for (let i = 0; i < taskList.length; i++) {
        let oneTask = taskList[i];
        if(oneTask.taskFinished){
            console.log(`任务：${oneTask.taskTitle},${oneTask.taskShowTitle},已完成`);
            continue;
        }
        if(oneTask.taskType === 'BROWSE_CHANNEL'){
            if(oneTask.id === 454){
                console.log(`任务：${oneTask.taskTitle},${oneTask.taskShowTitle},去执行`);
                let doTask = await takeRequest(`apDoTask`,`{"linkId":"${link}","taskType":"${oneTask.taskType}","taskId":${oneTask.id},"channel":4,"itemId":"${encodeURIComponent(oneTask.taskSourceUrl)}","checkVersion":false}`);
                console.log(`执行结果：${JSON.stringify(doTask)}`);
                await $.wait(2000);
                $.freshFlag = true;
            }
            if(oneTask.id === 504){
                 //let detail = await takeRequest(`apTaskDetail`,`{"linkId":"${link}","taskType":"${oneTask.taskType}","taskId":${oneTask.id},"channel":4}`);
                 //await $.wait(1000);
                 //let status = detail.status;
                 //let taskItemList =  detail.taskItemList;
                 //for (let j = 0; j < taskItemList.length && j < (status.finishNeed - status.userFinishedTimes); j++) {
                     //console.log(`浏览：${taskItemList[j].itemName}`);
                     //let doTask = await takeRequest(`apTaskTimeRecord`,`{"linkId":"${link}","taskType":"${oneTask.taskType}","taskId":${oneTask.id},"channel":4,"itemId":"${encodeURIComponent(taskItemList[j].itemId)}","checkVersion":false}`);
                     //await $.wait(31000);
					 //console.log(`执行结果：${JSON.stringify(doTask)}`);
                     //await $.wait(2000);
                 //}
            }
        }
    }
}
function taskurl(functionId,body) {
    return {
        url: `${JD_API_HOST}/?functionId=${functionId}&body=${escape(JSON.stringify(body))}&t=1635561607124&appid=activities_platform&client=H5&clientVersion=1.0.0`,

        headers: {

            "Cookie": cookie,
            "Origin": "https://api.m.jd.com",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",

        }
    }
}
function safeGet(data) {
    try {
        if (typeof JSON.parse(data) == "object") {
            return true;
        }
    } catch (e) {
        console.log(e);
        console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
        return false;
    }
}
async function takeRequest(functionId,bodyInfo){
    let  url = `https://api.m.jd.com/?functionId=${functionId}&body=${encodeURIComponent(bodyInfo)}&t=${Date.now()}&appid=activities_platform&client=H5&clientVersion=1.0.0`;
    const headers = {
        'Host' : `api.m.jd.com`,
        'Accept' : `application/json, text/plain, */*`,
        'Origin' : `https://bnzf.jd.com`,
        'Cookie' : cookie ,
        'Accept-Encoding' : `gzip, deflate, br`,
        'user-agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        'Accept-Language' : `zh-cn`,
        'Referer' : `https://bnzf.jd.com/?activityId=${link}`
    };
    let sentInfo = {url: url, headers: headers};
    return new Promise(async resolve => {
        $.get(sentInfo, (err, resp, data) => {
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

// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
