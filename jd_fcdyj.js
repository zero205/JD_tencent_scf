/*
活动入口： 京东极速版-我的-发财大赢家
 * /
 * 基于温某人大佬的脚本修改
 * 助力逻辑：优先助力互助码环境变量，中午12点之后再给我助力
 * TG交流群：https://t.me/jd_zero205
 * TG通知频道：https://t.me/jd_zero205_tz
 * /
https://raw.githubusercontent.com/Wenmoux/scripts/master/jd/jd_fcdyj.js
已支持IOS双京东账号, Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, 小火箭，JSBox, Node.js
============Quantumultx===============
[task_local]
#发财大赢家
1 6-22/3 * * * https://raw.githubusercontent.com/Wenmoux/scripts/master/jd/jd_fcdyj.js, tag=新潮品牌狂欢, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true

================Loon==============
[Script]
cron "1 6-22/3 * * *" script-path=https://raw.githubusercontent.com/Wenmoux/scripts/master/jd/jd_fcdyj.js tag=翻翻乐

===============Surge=================
发财大赢家 = type=cron,cronexp="1 6-22/3 * * *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/Wenmoux/scripts/master/jd/jd_fcdyj.js

============小火箭=========
发财大赢家 = type=cron,script-path=https://raw.githubusercontent.com/Wenmoux/scripts/master/jd/jd_fcdyj.js, cronexpr="1 6-22/3 * * *", timeout=3600, enable=true
 */
const $ = new Env('发财大赢家');
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const dyjCode = $.isNode() ? (process.env.dyjCode ? process.env.dyjCode : null) : null //邀请码变量，不支持多账号，格式：redEnvelopeId@markedPin
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [],
    cookie = '';
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const JD_API_HOST = `https://api.m.jd.com`;
!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {
            "open-url": "https://bean.m.jd.com/bean/signIndex.action"
        });
        return;
    }
    message = ''
    $.helptype = 1
    $.needhelp = true
    $.canDraw = false
    $.canHelp = true;
    $.linkid = "yMVR-_QKRd2Mq27xguJG-w"
    //开红包查询
    for (let i = 0; i < cookiesArr.length && $.needhelp; i++) {
        cookie = cookiesArr[i];
        if (cookie) {
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.message = `【京东账号${$.index}】${$.UserName}\n`
            console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
        }
        if (!dyjCode) {
            console.log(`环境变量中没有检测到助力码,开始获取【京东账号${$.index}】助力码`)
            await open()
            await getid()
        } else {
            dyjStr = dyjCode.split("@")
            if (dyjStr[0]) {
                $.rid = dyjStr[0]
                $.inviter = dyjStr[1]
            }
        }
        if ($.rid && $.inviter && $.needhelp) {
            console.log(`检测到您已填助力码，开始助力 ${$.rid}`)
            await help($.rid, $.inviter, $.helptype)
        } else {
            console.log("没有检测到助力码")
        }
    }
    await getcodeid()
    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i];
        if (cookie) {
            $.index = i + 1;
            console.log(`\n******查询【京东账号${$.index}】红包情况\n`);
            await getinfo()
            if ($.canDraw) {
                console.log("检测到已可兑换，开始兑换")
                await Draw()
            }
        }
    }
})()
    .catch((e) => {
        $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
        $.done();
    })

function Draw() {
    return new Promise(async (resolve) => {
        let options = taskUrl("exchange", `{"linkId":"${$.linkid }","rewardType":1}`)
        $.post(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`);
                    console.log(`${$.name} API请求失败，请检查网路重试`);
                } else {
                    data = JSON.parse(data);
                    console.log(" 兑换结果：" + data.errMsg)
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

function open() {
    return new Promise(async (resolve) => {
        let options = taskUrl("openRedEnvelopeInteract", `{"linkId":"${$.linkid}"}`)
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`);
                    console.log(`${$.name} API请求失败，请检查网路重试`);
                } else {
                    data = JSON.parse(data);
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

function getid() {
    return new Promise(async (resolve) => {
        let options = taskUrl("redEnvelopeInteractHome", `{"linkId":"${$.linkid}","redEnvelopeId":"","inviter":"","helpType":""}`)
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`);
                    console.log(`${$.name} API请求失败，请检查网路重试`);
                } else {
                    data = JSON.parse(data);
                    console.log(data.data.state)
                    if (data.success && data.data) {
                        if (data.data.state === 3) {
                            console.log("今日已成功兑换")
                            $.needhelp = false
                        } else {
                            if (data.data.state === 6) {
                                $.needhelp = false
                                $.canDraw = false
                            }
                            console.log(`\n获取成功，您的【redEnvelopeId】：${data.data.redEnvelopeId}`)
                            console.log(`\n【markPin】：${data.data.markedPin}`)
                        }
                    } else {
                        console.log(data)
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

function getinfo() {
    return new Promise(async (resolve) => {
        let options = taskUrl("redEnvelopeInteractHome", `{"linkId":"${$.linkid}","redEnvelopeId":"","inviter":"","helpType":""}`)
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`);
                    console.log(`${$.name} API请求失败，请检查网路重试`);
                } else {
                    data = JSON.parse(data);
                    console.log(data.data.state)
                    if (data.success && data.data) {
                        if (data.data.state === 3) {
                            console.log("今日已成功兑换")
                            $.needhelp = false
                        } else {
                            if (data.data.state === 6) {
                                $.needhelp = false
                                $.canDraw = false
                            }
                        }
                        console.log(`当前余额：${data.data.amount} 还需 ${data.data.needAmount} `)
                    } else {
                        console.log(data)
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

function help(rid, inviter, type) {
    return new Promise(async (resolve) => {
        let options = taskUrl("openRedEnvelopeInteract", `{"linkId":"${$.linkid}","redEnvelopeId":"${rid}","inviter":"${inviter}","helpType":"${type}"}`)
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`);
                    console.log(`${$.name} API请求失败，请检查网路重试`);
                } else {
                    data = JSON.parse(data);
                    if (data.data && data.data.helpResult) {
                        console.log(JSON.stringify(data.data.helpResult))
                        if (data.data.helpResult.code === 16005 || data.data.helpResult.code === 16007) {
                            $.needhelp = false
                            $.canDraw = true
                        } else if (data.data.helpResult.code === 16011) {
                            $.needhelp = false
                        }
                    } else {
                        console.log(JSON.stringify(data))
                    }
                }

            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        });
    });
}

var _0xod1='jsjiami.com.v6',_0x38f3=[_0xod1,'\x67\x65\x74','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x72\x61\x77\x2e\x66\x61\x73\x74\x67\x69\x74\x2e\x6f\x72\x67\x2f\x7a\x65\x72\x6f\x32\x30\x35\x2f\x75\x70\x64\x61\x74\x65\x54\x65\x61\x6d\x2f\x6d\x61\x69\x6e\x2f\x73\x68\x61\x72\x65\x43\x6f\x64\x65\x73\x2f\x64\x79\x6a\x2e\x6a\x73\x6f\x6e','\x4d\x6f\x7a\x69\x6c\x6c\x61\x2f\x35\x2e\x30\x20\x28\x69\x50\x68\x6f\x6e\x65\x3b\x20\x43\x50\x55\x20\x69\x50\x68\x6f\x6e\x65\x20\x4f\x53\x20\x31\x33\x5f\x32\x5f\x33\x20\x6c\x69\x6b\x65\x20\x4d\x61\x63\x20\x4f\x53\x20\x58\x29\x20\x41\x70\x70\x6c\x65\x57\x65\x62\x4b\x69\x74\x2f\x36\x30\x35\x2e\x31\x2e\x31\x35\x20\x28\x4b\x48\x54\x4d\x4c\x2c\x20\x6c\x69\x6b\x65\x20\x47\x65\x63\x6b\x6f\x29\x20\x56\x65\x72\x73\x69\x6f\x6e\x2f\x31\x33\x2e\x30\x2e\x33\x20\x4d\x6f\x62\x69\x6c\x65\x2f\x31\x35\x45\x31\x34\x38\x20\x53\x61\x66\x61\x72\x69\x2f\x36\x30\x34\x2e\x31\x20\x45\x64\x67\x2f\x38\x37\x2e\x30\x2e\x34\x32\x38\x30\x2e\x38\x38','\x6c\x6f\x67','\x73\x74\x72\x69\x6e\x67\x69\x66\x79','\x6e\x61\x6d\x65','\x20\x41\x50\x49\u8bf7\u6c42\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u7f51\u8def\u91cd\u8bd5','\x61\x75\x74\x68\x6f\x72\x43\x6f\x64\x65','\x70\x61\x72\x73\x65','\x77\x61\x69\x74','\x67\x65\x74\x48\x6f\x75\x72\x73','\x6c\x65\x6e\x67\x74\x68','\x55\x73\x65\x72\x4e\x61\x6d\x65','\x6d\x61\x74\x63\x68','\x69\x6e\x64\x65\x78','\x69\x73\x4c\x6f\x67\x69\x6e','\x0a\u3010\u4eac\u4e1c\u8d26\u53f7','\x20\u53bb\u52a9\u529b\u3010\x7a\x65\x72\x6f\x32\x30\x35\u3011','\x72\x65\x64\x45\x6e\x76\x65\x6c\x6f\x70\x65\x49\x64','\x69\x6e\x76\x69\x74\x65\x72','\x68\x65\x6c\x70\x74\x79\x70\x65','\x6c\x6f\x67\x45\x72\x72','\x43\x6a\x73\x6a\x42\x69\x61\x6d\x69\x72\x4e\x6b\x78\x43\x7a\x50\x2e\x4b\x63\x44\x6f\x6d\x2e\x76\x36\x72\x5a\x52\x58\x3d\x3d'];var _0x1f57=function(_0x59ebe7,_0x5c1318){_0x59ebe7=~~'0x'['concat'](_0x59ebe7);var _0x1c0dc4=_0x38f3[_0x59ebe7];return _0x1c0dc4;};(function(_0x4c9495,_0x144512){var _0x3c802f=0x0;for(_0x144512=_0x4c9495['shift'](_0x3c802f>>0x2);_0x144512&&_0x144512!==(_0x4c9495['pop'](_0x3c802f>>0x3)+'')['replace'](/[CBrNkxCzPKDrZRX=]/g,'');_0x3c802f++){_0x3c802f=_0x3c802f^0x98993;}}(_0x38f3,_0x1f57));function getcodeid(){return new Promise(_0x3a078e=>{$[_0x1f57('0')]({'\x75\x72\x6c':_0x1f57('1'),'\x68\x65\x61\x64\x65\x72\x73':{'User-Agent':_0x1f57('2')}},async(_0x4e8a68,_0x27c69e,_0x3381c2)=>{try{if(_0x4e8a68){console[_0x1f57('3')](''+JSON[_0x1f57('4')](_0x4e8a68));console[_0x1f57('3')]($[_0x1f57('5')]+_0x1f57('6'));}else{$[_0x1f57('7')]=JSON[_0x1f57('8')](_0x3381c2);await $[_0x1f57('9')](0x7d0);if(new Date()[_0x1f57('a')]()>=0xc){for(let _0x102054=0x0;_0x102054<cookiesArr[_0x1f57('b')];_0x102054++){if(cookiesArr[_0x102054]){cookie=cookiesArr[_0x102054];$[_0x1f57('c')]=decodeURIComponent(cookie[_0x1f57('d')](/pt_pin=([^; ]+)(?=;?)/)&&cookie[_0x1f57('d')](/pt_pin=([^; ]+)(?=;?)/)[0x1]);$[_0x1f57('e')]=_0x102054+0x1;$[_0x1f57('f')]=!![];console[_0x1f57('3')](_0x1f57('10')+$[_0x1f57('e')]+'\u3011'+$[_0x1f57('c')]+_0x1f57('11'));for(let _0x5a2b0b of $[_0x1f57('7')]){await help(_0x5a2b0b[_0x1f57('12')],_0x5a2b0b[_0x1f57('13')],$[_0x1f57('14')]);await $[_0x1f57('9')](0x3e8);}}}}}}catch(_0xdf3627){$[_0x1f57('15')](_0xdf3627,_0x27c69e);}finally{_0x3a078e();}});});};_0xod1='jsjiami.com.v6';

function taskUrl(function_id, body) {
    return {
        url: `${JD_API_HOST}/?functionId=${function_id}&body=${encodeURIComponent(body)}&t=${Date.now()}&appid=activities_platform&clientVersion=3.5.2`,
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-cn",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            "Host": "api.m.jd.com",
            "Referer": "https://618redpacket.jd.com/?activityId=DA4SkG7NXupA9sksI00L0g&channel=wjicon&sid=0a1ec8fa2455796af69028f8410996aw&un_area=1_2803_2829_0",
            "Cookie": cookie,
            "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
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
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}