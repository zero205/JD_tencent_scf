/*
抄自@Tsukasa007 汪汪乐园脚本

仅用于完成汪汪乐园新手引导

https://github.com/zero205/JD_tencent_scf

*/
// 兼容elecV2P用户
// @grant    require

const $ = new Env('汪汪乐园过新手任务');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const JD_API_HOST = `https://api.m.jd.com/client.action`;
message = ""
!(async () => {
  console.log(`\n======本脚本仅用于完成汪汪乐园新手引导任务======\n`);
  $.user_agent = require('./USER_AGENTS').USER_AGENT
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
      "open-url": "https://bean.m.jd.com/"
    });
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    if (cookie) {
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      $.maxJoyCount = 10
      $.hasJoyCoin = true
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      await getJoyBaseInfo(undefined, undefined, undefined, true);
      $.activityJoyList = []
      $.workJoyInfoList = []
      await getJoyList();
      await getGameShopList()
      //合成
      await doJoyMergeAll($.activityJoyList)
      //清理工位
      await doJoyMoveDownAll($.workJoyInfoList)
      await doJoyBuy(2)
      await getJoyList(true)
      // console.log(`二级🐶id为${$.activityJoyList[0].id}`);
      await doJoyMove($.activityJoyList[0].id, 1)
    }
  }
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())

function getJoyBaseInfo(taskId = '', inviteType = '', inviterPin = '', printLog = false) {
  //await $.wait(20)
  return new Promise(resolve => {
    $.post(taskPostClientActionUrl(`body={"taskId":"${taskId}","inviteType":"${inviteType}","inviterPin":"${inviterPin}","linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&_t=1625480372020&appid=activities_platform`, `joyBaseInfo`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (printLog) {
            $.log(`等级: ${data.data.level}|金币: ${data.data.joyCoin}`);
          }
          $.joyBaseInfo = data.data
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve($.joyBaseInfo);
      }
    })
  })
}

function getJoyList(printLog = false) {
  //await $.wait(20)
  return new Promise(resolve => {
    $.get(taskGetClientActionUrl(`appid=activities_platform&body={"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}`, `joyList`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (printLog) {
            $.log(`\n===== 【京东账号${$.index}】${$.nickName || $.UserName} joy 状态 start =====`)
            $.log("在逛街的joy⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️")
            for (let i = 0; i < data.data.activityJoyList.length; i++) {
              //$.wait(50);
              $.log(`id:${data.data.activityJoyList[i].id}|name: ${data.data.activityJoyList[i].name}|level: ${data.data.activityJoyList[i].level}`);
            }
            $.log("\n在铲土的joy⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️")
            for (let i = 0; i < data.data.workJoyInfoList.length; i++) {
              //$.wait(50)
              $.log(`工位: ${data.data.workJoyInfoList[i].location} [${data.data.workJoyInfoList[i].unlock ? `已开` : `未开`}]|joy= ${data.data.workJoyInfoList[i].joyDTO ? `id:${data.data.workJoyInfoList[i].joyDTO.id}|name: ${data.data.workJoyInfoList[i].joyDTO.name}|level: ${data.data.workJoyInfoList[i].joyDTO.level}` : `毛都没有`}`)
            }
            $.log(`===== 【京东账号${$.index}】${$.nickName || $.UserName} joy 状态  end  =====\n`)
          }
          $.activityJoyList = data.data.activityJoyList
          $.workJoyInfoList = data.data.workJoyInfoList
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data.data);
      }
    })
  })
}

function getGameShopList() {
  //await $.wait(20)
  return new Promise(resolve => {
    $.get(taskGetClientActionUrl(`appid=activities_platform&body={"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}`, `gameShopList`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          //排除不能购买的
          data = JSON.parse(data).data.filter(row => row.shopStatus === 1);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

async function doJoyMoveDownAll(workJoyInfoList) {
  if (workJoyInfoList.filter(row => row.joyDTO).length === 0) {
    $.log(`工位清理完成！`)
    return true
  }
  for (let i = 0; i < workJoyInfoList.length; i++) {
    //$.wait(50)
    if (workJoyInfoList[i].unlock && workJoyInfoList[i].joyDTO) {
      $.log(`从工位移除 => id:${workJoyInfoList[i].joyDTO.id}|name: ${workJoyInfoList[i].joyDTO.name}|level: ${workJoyInfoList[i].joyDTO.level}`)
      await doJoyMove(workJoyInfoList[i].joyDTO.id, 0)
    }
  }
  //check
  await getJoyList()
  await doJoyMoveDownAll($.workJoyInfoList)
}

async function doJoyMergeAll(activityJoyList) {
  let minLevel = Math.min.apply(Math, activityJoyList.map(o => o.level))
  let joyMinLevelArr = activityJoyList.filter(row => row.level === minLevel);
  if (joyMinLevelArr.length >= 2) {
    $.log(`开始合成 ${minLevel} ${joyMinLevelArr[0].id} <=> ${joyMinLevelArr[1].id} 【限流严重，2秒后合成！如失败会重试】`);
    await $.wait(2000)
    await doJoyMerge(joyMinLevelArr[0].id, joyMinLevelArr[1].id);
    await getJoyList()
    await doJoyMergeAll($.activityJoyList)
  }
}

function doJoyMove(joyId, location) {
  //await $.wait(20)
  return new Promise(resolve => {
    $.post(taskGetClientActionUrl(`body={"joyId":${joyId},"location":${location},"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&appid=activities_platform`, `joyMove`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (location !== 0) {
            $.log(`下地完成了！`);
          }
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data.data);
      }
    })
  })
}

function doJoyMerge(joyId1, joyId2) {
  //await $.wait(20)
  return new Promise(resolve => {
    $.get(taskGetClientActionUrl(`body={"joyOneId":${joyId1},"joyTwoId":${joyId2},"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&appid=activities_platform`, `joyMergeGet`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
          data = {}
        } else {
          data = JSON.parse(data);
          $.log(`合成 ${joyId1} <=> ${joyId2} ${data.success ? `成功！` : `失败！【${data.errMsg}】 code=${data.code}`}`)
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data.data);
      }
    })
  })
}

async function doJoyBuy(level) {
  //await $.wait(20)
  return new Promise(resolve => {
    $.post(taskPostClientActionUrl(`body={"level":${level},"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&appid=activities_platform`, `joyBuy`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          let codeMsg = '【不知道啥意思】'
          switch (data.code) {
            case 519:
              codeMsg = '【没钱了】';
              break
            case 518:
              codeMsg = '【没空位】';
              break
            case 0:
              codeMsg = '【OK】';
              break
          }
          $.log(`购买joy level: ${level} ${data.success ? `成功！` : `失败！${data.errMsg} code=${data.code}`}  code的意思是=${codeMsg}`);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function showMsg() {
  return new Promise(resolve => {
    $.msg('【提醒⏰】汪汪乐园过新手任务脚本已运行完毕\n有卡在新手任务火爆的请前往：京东极速版APP--汪汪乐园\n按提示手动完成新手任务');
    resolve()
  })
}

function doJoyRecovery(joyId) {
  return new Promise(resolve => {
    $.post(taskPostClientActionUrl(`body={"joyId":${joyId},"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&appid=activities_platform`, `joyRecovery`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
          data = {}
        } else {
          data = JSON.parse(data);
          $.log(`回收🐶 ${data.success ? `成功！` : `失败！【${data.errMsg}】 code=${data.code}`}`)
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function taskPostClientActionUrl(body, functionId) {
  return {
    url: `https://api.m.jd.com/client.action?${functionId ? `functionId=${functionId}` : ``}`,
    body: body,
    headers: {
      'User-Agent': $.user_agent,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Host': 'api.m.jd.com',
      'Origin': 'https://joypark.jd.com',
      'Referer': 'https://joypark.jd.com/?activityId=LsQNxL7iWDlXUs6cFl-AAg&lng=113.387899&lat=22.512678&sid=4d76080a9da10fbb31f5cd43396ed6cw&un_area=19_1657_52093_0',
      'Cookie': cookie,
    }
  }
}

function taskGetClientActionUrl(body, functionId) {
  return {
    url: `https://api.m.jd.com/client.action?functionId=${functionId}${body ? `&${body}` : ``}`,
    // body: body,
    headers: {
      'User-Agent': $.user_agent,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Host': 'api.m.jd.com',
      'Origin': 'https://joypark.jd.com',
      'Referer': 'https://joypark.jd.com/?activityId=LsQNxL7iWDlXUs6cFl-AAg&lng=113.388006&lat=22.512549&sid=4d76080a9da10fbb31f5cd43396ed6cw&un_area=19_1657_52093_0',
      'Cookie': cookie,
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
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
