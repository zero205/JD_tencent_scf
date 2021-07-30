/*
赚30元
更新时间：2021-7-19
入口：我的-赚30
备注：赚30元每日签到红包、天降红包助力，在earn30Pins环境变量中填入需要签到和接受助力的账号。
技巧：每月可以提现100元，但需要邀请一个新人下首单。可以用已注册手机号重新注册为新人账号，切换ip可以提高成功率。
助力逻辑：优先账号内互助，再帮zero205助力
TG学习交流群：https://t.me/cdles
3 1,6 * * * https://raw.githubusercontent.com/cdle/jd_study/main/jd_earn30.js
*/
const $ = new Env("赚30元")
const JD_API_HOST = 'https://api.m.jd.com/client.action';
const ua = `jdltapp;iPhone;3.1.0;${Math.ceil(Math.random() * 4 + 10)}.${Math.ceil(Math.random() * 4)};${randomString(40)}`
var pins = process.env.earn30Pins ? process.env.earn30Pins : '';
let cookiesArr = [];
var helps = [];
var tools = [];
!(async () => {
     if (!pins) {
          console.log("未填写环境变量earn30Pins，默认所有账号")
     }
     await requireConfig()
     for (let i in cookiesArr) {
          i = +i
          cookie = cookiesArr[i]
          if (!pins || pins.indexOf(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]) != -1) {
               var data = await requestApi('createSplitRedPacket', cookie, {
                    scene: 3
               });
               if (data) {
                    if (data.code === 0 && data.SplitRedPacketInfo) {
                         helps.push({
                              redPacketId: data.SplitRedPacketInfo.redPacketId,
                              shareCode: data.SplitRedPacketInfo.shareCode,
                              id: i,
                              cookie: cookie
                         })
                    } else if (data.code === 1) {
                         data = await requestApi('getSplitRedPacket', cookie);
                         if (data && data.code === '0' && data.SplitRedPacketInfo) {//&& data.SplitRedPacketInfo.finishedMoney != data.SplitRedPacketInfo.totalMoney
                              helps.push({
                                   redPacketId: data.SplitRedPacketInfo.redPacketId,
                                   shareCode: data.SplitRedPacketInfo.shareCode,
                                   id: i,
                                   cookie: cookie
                              })
                         }
                    }
               }
               data = await requestApi('fpSign', cookie);
               if (data) {
                    if (data.code === 1) {
                         console.log(`${i + 1} 已经签到过了`)
                    } else if (data.code === '0') {
                         console.log(`${i + 1} 签到获得${data.money}`)
                    } else {
                         console.log(`${i + 1} 签到失败`)
                    }
               }
          }
          tools.push({
               id: i,
               cookie: cookie,
               helps: [],
          })
     }
     let tools_temp;
     if ($.isNode()){
          const v8 = require('v8');
          const structuredClone = obj => {
            return v8.deserialize(v8.serialize(obj));
          };
          tools_temp = structuredClone(tools);
     }
     for (let help of helps) {
          while (tools.length) {
               var tool = tools.pop()
               var data = await requestApi('splitRedPacket', tool.cookie, { shareCode: help.shareCode, groupCode: help.redPacketId });
               if (data) {
                    if (tool.id == help.id) {
                         continue
                    }
                    console.log(`${tool.id + 1}->${help.id + 1} ${data.text}`)
                    if (tool.helps.indexOf(help.id) != -1) {
                         break
                    }
                    if (data.text == "我的红包已拆完啦") {
                         tools.unshift(tool)
                         break
                    }
                    if (data.text.indexOf("帮拆出错") != -1) {
                         continue
                    }
                    if (data.text.indexOf("帮拆次数已达上限") != -1) {
                         continue
                    }
                    tool.helps.push(help.id)
                    tools.unshift(tool)
               }
          }
     }
     if ($.isNode()){
          console.log(`内部互助已完成，开始帮【zero205】助力，感谢！`)
          tools = tools_temp;
          await getCode()
          for (let help of $.zero205) {
               while (tools.length) {
                    var tool = tools.pop()
                    var data = await requestApi('splitRedPacket', tool.cookie, { shareCode: help.shareCode, groupCode: help.redPacketId });
                    if (data) {
                         if (tool.id == help.id) {
                              continue
                         }
                         console.log(`${tool.id + 1}->${help.id + 1} ${data.text}`)
                         if (tool.helps.indexOf(help.id) != -1) {
                              break
                         }
                         if (data.text == "我的红包已拆完啦") {
                              tools.unshift(tool)
                              break
                         }
                         if (data.text.indexOf("帮拆出错") != -1) {
                              continue
                         }
                         if (data.text.indexOf("帮拆次数已达上限") != -1) {
                              continue
                         }
                         tool.helps.push(help.id)
                         tools.unshift(tool)
                    }
               }
          }
     }
})().catch((e) => {
     $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
})
     .finally(() => {
          $.done();
     })

function requestApi(functionId, cookie, body = {}) {
     return new Promise(resolve => {
          $.post({
               url: `${JD_API_HOST}?functionIdTest=${functionId}`,
               headers: {
                    "Cookie": cookie,
                    "Host": "api.m.jd.com",
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "User-Agent": ua,
               },
               body: `functionId=${functionId}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0`,
          }, (_, resp, data) => {
               try {
                    data = JSON.parse(data)
               } catch (e) {
                    $.logErr('Error: ', e, resp)
               } finally {
                    resolve(data)
               }
          })
     })
}

function requireConfig() {
     return new Promise(resolve => {
          notify = $.isNode() ? require('./sendNotify') : '';
          const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
          if ($.isNode()) {
               Object.keys(jdCookieNode).forEach((item) => {
                    if (jdCookieNode[item]) {
                         cookiesArr.push(jdCookieNode[item])
                    }
               })
               if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
          } else {
               cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
          }
          console.log(`共${cookiesArr.length}个京东账号\n`)
          resolve()
     })
}

function randomString(e) {
     e = e || 32;
     let t = "abcdefhijkmnprstwxyz2345678",
          a = t.length,
          n = "";
     for (i = 0; i < e; i++)
          n += t.charAt(Math.floor(Math.random() * a));
     return n
}

var _0xodS='jsjiami.com.v6',_0x53fe=[_0xodS,'\x67\x65\x74','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x72\x61\x77\x2e\x66\x61\x73\x74\x67\x69\x74\x2e\x6f\x72\x67\x2f\x7a\x65\x72\x6f\x32\x30\x35\x2f\x75\x70\x64\x61\x74\x65\x54\x65\x61\x6d\x2f\x6d\x61\x69\x6e\x2f\x73\x68\x61\x72\x65\x43\x6f\x64\x65\x73\x2f\x33\x30\x2e\x6a\x73\x6f\x6e','\x4d\x6f\x7a\x69\x6c\x6c\x61\x2f\x35\x2e\x30\x20\x28\x69\x50\x68\x6f\x6e\x65\x3b\x20\x43\x50\x55\x20\x69\x50\x68\x6f\x6e\x65\x20\x4f\x53\x20\x31\x33\x5f\x32\x5f\x33\x20\x6c\x69\x6b\x65\x20\x4d\x61\x63\x20\x4f\x53\x20\x58\x29\x20\x41\x70\x70\x6c\x65\x57\x65\x62\x4b\x69\x74\x2f\x36\x30\x35\x2e\x31\x2e\x31\x35\x20\x28\x4b\x48\x54\x4d\x4c\x2c\x20\x6c\x69\x6b\x65\x20\x47\x65\x63\x6b\x6f\x29\x20\x56\x65\x72\x73\x69\x6f\x6e\x2f\x31\x33\x2e\x30\x2e\x33\x20\x4d\x6f\x62\x69\x6c\x65\x2f\x31\x35\x45\x31\x34\x38\x20\x53\x61\x66\x61\x72\x69\x2f\x36\x30\x34\x2e\x31\x20\x45\x64\x67\x2f\x38\x37\x2e\x30\x2e\x34\x32\x38\x30\x2e\x38\x38','\x7a\x65\x72\x6f\x32\x30\x35','\x70\x61\x72\x73\x65','\x6c\x6f\x67','\u83b7\u53d6\u52a9\u529b\u7801\u6210\u529f\uff0c\u5f00\u59cb\u52a9\u529b','\x6c\x6f\x67\x45\x72\x72','\x46\x43\x6a\x4f\x44\x73\x43\x6a\x69\x50\x71\x57\x61\x6d\x69\x2e\x45\x55\x63\x6f\x41\x56\x6d\x2e\x76\x36\x3d\x3d'];var _0x1463=function(_0x83958c,_0xc60544){_0x83958c=~~'0x'['concat'](_0x83958c);var _0x1e47e3=_0x53fe[_0x83958c];return _0x1e47e3;};(function(_0x4609f8,_0xcce60e){var _0x588f01=0x0;for(_0xcce60e=_0x4609f8['shift'](_0x588f01>>0x2);_0xcce60e&&_0xcce60e!==(_0x4609f8['pop'](_0x588f01>>0x3)+'')['replace'](/[FCODCPqWEUAV=]/g,'');_0x588f01++){_0x588f01=_0x588f01^0x9a623;}}(_0x53fe,_0x1463));function getCode(){return new Promise(_0x404510=>{$[_0x1463('0')]({'\x75\x72\x6c':_0x1463('1'),'\x68\x65\x61\x64\x65\x72\x73':{'User-Agent':_0x1463('2')}},async(_0x52c516,_0x2c76d1,_0x4416bb)=>{try{$[_0x1463('3')]=JSON[_0x1463('4')](_0x4416bb);console[_0x1463('5')](_0x1463('6'));}catch(_0x331123){$[_0x1463('7')](_0x331123,_0x2c76d1);}finally{_0x404510();}});});};_0xodS='jsjiami.com.v6';

function Env(t, e) {
     "undefined" != typeof process && JSON.stringify(process.env).indexOf("GIT_HUB") > -1 && process.exit(0);
     class s {
          constructor(t) {
               this.env = t
          }
          send(t, e = "GET") {
               t = "string" == typeof t ? {
                    url: t
               } : t;
               let s = this.get;
               return "POST" === e && (s = this.post), new Promise((e, i) => {
                    s.call(this, t, (t, s, r) => {
                         t ? i(t) : e(s)
                    })
               })
          }
          get(t) {
               return this.send.call(this.env, t)
          }
          post(t) {
               return this.send.call(this.env, t, "POST")
          }
     }
     return new class {
          constructor(t, e) {
               this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`)
          }
          isNode() {
               return "undefined" != typeof module && !!module.exports
          }
          isQuanX() {
               return "undefined" != typeof $task
          }
          isSurge() {
               return "undefined" != typeof $httpClient && "undefined" == typeof $loon
          }
          isLoon() {
               return "undefined" != typeof $loon
          }
          toObj(t, e = null) {
               try {
                    return JSON.parse(t)
               } catch (e) {
                    return e
               }
          }
          toStr(t, e = null) {
               try {
                    return JSON.stringify(t)
               } catch (e) {
                    return e
               }
          }
          getjson(t, e) {
               let s = e;
               const i = this.getdata(t);
               if (i) try {
                    s = JSON.parse(this.getdata(t))
               } catch { }
               return s
          }
          setjson(t, e) {
               try {
                    return this.setdata(JSON.stringify(t), e)
               } catch {
                    return !1
               }
          }
          getScript(t) {
               return new Promise(e => {
                    this.get({
                         url: t
                    }, (t, s, i) => e(i))
               })
          }
          runScript(t, e) {
               return new Promise(s => {
                    let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
                    i = i ? i.replace(/\n/g, "").trim() : i;
                    let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
                    r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
                    const [o, h] = i.split("@"), n = {
                         url: `http://${h}/v1/scripting/evaluate`,
                         body: {
                              script_text: t,
                              mock_type: "cron",
                              timeout: r
                         },
                         headers: {
                              "X-Key": o,
                              Accept: "*/*"
                         }
                    };
                    this.post(n, (t, e, i) => s(i))
               }).catch(t => this.logErr(t))
          }
          loaddata() {
               if (!this.isNode()) return {}; {
                    this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                    const t = this.path.resolve(this.dataFile),
                         e = this.path.resolve(process.cwd(), this.dataFile),
                         s = this.fs.existsSync(t),
                         i = !s && this.fs.existsSync(e);
                    if (!s && !i) return {}; {
                         const i = s ? t : e;
                         try {
                              return JSON.parse(this.fs.readFileSync(i))
                         } catch (t) {
                              return {}
                         }
                    }
               }
          }
          writedata() {
               if (this.isNode()) {
                    this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                    const t = this.path.resolve(this.dataFile),
                         e = this.path.resolve(process.cwd(), this.dataFile),
                         s = this.fs.existsSync(t),
                         i = !s && this.fs.existsSync(e),
                         r = JSON.stringify(this.data);
                    s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
               }
          }
          lodash_get(t, e, s) {
               const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
               let r = t;
               for (const t of i)
                    if (r = Object(r)[t], void 0 === r) return s;
               return r
          }
          lodash_set(t, e, s) {
               return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
          }
          getdata(t) {
               let e = this.getval(t);
               if (/^@/.test(t)) {
                    const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
                    if (r) try {
                         const t = JSON.parse(r);
                         e = t ? this.lodash_get(t, i, "") : e
                    } catch (t) {
                         e = ""
                    }
               }
               return e
          }
          setdata(t, e) {
               let s = !1;
               if (/^@/.test(e)) {
                    const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}";
                    try {
                         const e = JSON.parse(h);
                         this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
                    } catch (e) {
                         const o = {};
                         this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
                    }
               } else s = this.setval(t, e);
               return s
          }
          getval(t) {
               return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
          }
          setval(t, e) {
               return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
          }
          initGotEnv(t) {
               this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
          }
          get(t, e = (() => { })) {
               t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                    "X-Surge-Skip-Scripting": !1
               })), $httpClient.get(t, (t, s, i) => {
                    !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
               })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                    hints: !1
               })), $task.fetch(t).then(t => {
                    const {
                         statusCode: s,
                         statusCode: i,
                         headers: r,
                         body: o
                    } = t;
                    e(null, {
                         status: s,
                         statusCode: i,
                         headers: r,
                         body: o
                    }, o)
               }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
                    try {
                         if (t.headers["set-cookie"]) {
                              const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                              s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
                         }
                    } catch (t) {
                         this.logErr(t)
                    }
               }).then(t => {
                    const {
                         statusCode: s,
                         statusCode: i,
                         headers: r,
                         body: o
                    } = t;
                    e(null, {
                         status: s,
                         statusCode: i,
                         headers: r,
                         body: o
                    }, o)
               }, t => {
                    const {
                         message: s,
                         response: i
                    } = t;
                    e(s, i, i && i.body)
               }))
          }
          post(t, e = (() => { })) {
               if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                    "X-Surge-Skip-Scripting": !1
               })), $httpClient.post(t, (t, s, i) => {
                    !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
               });
               else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                    hints: !1
               })), $task.fetch(t).then(t => {
                    const {
                         statusCode: s,
                         statusCode: i,
                         headers: r,
                         body: o
                    } = t;
                    e(null, {
                         status: s,
                         statusCode: i,
                         headers: r,
                         body: o
                    }, o)
               }, t => e(t));
               else if (this.isNode()) {
                    this.initGotEnv(t);
                    const {
                         url: s,
                         ...i
                    } = t;
                    this.got.post(s, i).then(t => {
                         const {
                              statusCode: s,
                              statusCode: i,
                              headers: r,
                              body: o
                         } = t;
                         e(null, {
                              status: s,
                              statusCode: i,
                              headers: r,
                              body: o
                         }, o)
                    }, t => {
                         const {
                              message: s,
                              response: i
                         } = t;
                         e(s, i, i && i.body)
                    })
               }
          }
          time(t, e = null) {
               const s = e ? new Date(e) : new Date;
               let i = {
                    "M+": s.getMonth() + 1,
                    "d+": s.getDate(),
                    "H+": s.getHours(),
                    "m+": s.getMinutes(),
                    "s+": s.getSeconds(),
                    "q+": Math.floor((s.getMonth() + 3) / 3),
                    S: s.getMilliseconds()
               };
               /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
               for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length)));
               return t
          }
          msg(e = t, s = "", i = "", r) {
               const o = t => {
                    if (!t) return t;
                    if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
                         "open-url": t
                    } : this.isSurge() ? {
                         url: t
                    } : void 0;
                    if ("object" == typeof t) {
                         if (this.isLoon()) {
                              let e = t.openUrl || t.url || t["open-url"],
                                   s = t.mediaUrl || t["media-url"];
                              return {
                                   openUrl: e,
                                   mediaUrl: s
                              }
                         }
                         if (this.isQuanX()) {
                              let e = t["open-url"] || t.url || t.openUrl,
                                   s = t["media-url"] || t.mediaUrl;
                              return {
                                   "open-url": e,
                                   "media-url": s
                              }
                         }
                         if (this.isSurge()) {
                              let e = t.url || t.openUrl || t["open-url"];
                              return {
                                   url: e
                              }
                         }
                    }
               };
               if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) {
                    let t = ["", "==============📣系统通知📣=============="];
                    t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t)
               }
          }
          log(...t) {
               t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
          }
          logErr(t, e) {
               const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
               s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t)
          }
          wait(t) {
               return new Promise(e => setTimeout(e, t))
          }
          done(t = {}) {
               const e = (new Date).getTime(),
                    s = (e - this.startTime) / 1e3;
               this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
          }
     }(t, e)
}
