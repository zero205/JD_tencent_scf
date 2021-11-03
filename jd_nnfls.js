/**
 京喜-首页-牛牛福利
 Author：zxx
 Date：2021-11-2
先内部助力，有剩余助力作者
 cron 1 0,9,19,23 * * * zx_nnfls.js
 一天要跑2次
 */
const util = require('./util.js')
const $ = new util.Env('牛牛福利');
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const CryptoJS = $.isNode() ? require('crypto-js') : CryptoJS;
let cookiesArr = [];
let shareCodes = [];
let authorCodes = [];
let coin = 0;
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    });
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
    cookiesArr = [
        $.getdata("CookieJD"),
        $.getdata("CookieJD2"),
        ...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie)].filter((item) => !!item);
};
!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
        return;
    }
    for (let i = 0; i < cookiesArr.length; i++) {
        $.index = i + 1;
        $.cookie = cookiesArr[i];
        $.isLogin = true;
        $.nickName = '';
        $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
        await TotalBean();
        console.log(`\n*****开始【京东账号${$.index}】${$.nickName || $.UserName}*****\n`);
        if (!$.isLogin) {
            $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });

            if ($.isNode()) {
                await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
            }
            continue
        }
        res = await UserSignNew();
        // await drawUserTask();
    }
    if (shareCodes.length > 0) {
        console.log(`\n开始互助\n`);
    }
//     const author = Math.random() > 0.5 ? 'zero205' : 'zxx'
    const author = 'zero205'
    await getShareCode('nnfls.json',author,3,true)
    shareCodes = [...new Set([...shareCodes, ...($.shareCode || [])])];
    for (let i = 0; i < cookiesArr.length; i++) {
        $.cookie = cookiesArr[i];
        $.canHelp = true;
        $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
        console.log(`====开始账号${$.UserName}===助力`)
        for (let j = 0; j < shareCodes.length; j++) {
            if (!$.canHelp) {
                break;
            }
            await help(shareCodes[j]);
            await $.wait(1000);
        }
    }
    console.log(`\再次抽奖\n`);
    for (let i = 0; i < cookiesArr.length; i++) {
        $.cookie = cookiesArr[i];
        $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
        console.log(`====开始账号${$.UserName}===`)
        await drawUserTask();
    }
})().catch((e) => { $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '') }).finally(() => { $.done(); })

function getShareCode(name,author = 'zero205',num = -1,shuffle=false) {
  return new Promise(resolve => {
    $.get({
      url: `https://raw.fastgit.org/${author}/updateTeam/main/shareCodes/${name}`,
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }
    }, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`);
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          console.log(`优先账号内部互助，有剩余助力次数再帮作者助力`);
          $.shareCode = JSON.parse(data) || []
          if (shuffle) {
            $.shareCode = $.shareCode.sort(() => 0.5 - Math.random())
          }
          if (num != -1) {
            $.shareCode = $.shareCode.slice(0,num)
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

async function help(sharecode) {
    console.log(`${$.UserName} 去助力 ${sharecode}`)
    res = await api('sign/helpSign', 'flag,sceneval,token', { flag: 0, token: sharecode })
    await $.wait(3000)
    res = await api('sign/helpSign', 'flag,sceneval,token', { flag: 1, token: sharecode })
    console.log('助力结果', res.errMsg)
    if (res.errMsg === 'help day limit') {
        $.canHelp = false;
        return;
    }

    await $.wait(2000)
}

async function drawUserTask() {
    res = await api('task/QueryUserTask', 'sceneval,taskType', { taskType: 0 })
    let tasks = []
    if (res.datas) {
        for (let t of res.datas) {
            if (t.state !== 2)
                tasks.push(t.taskId)
        }
    } else {
        res = await api('task/QueryPgTaskCfg', 'sceneval', {})
        if (tasks.length === 0) {
            for (let t of res.data.tasks) {
                tasks.push(t.taskId)
            }
        }
    }
    console.log('tasks:', tasks && tasks.length)
    await $.wait(2000)

    res = await api('task/QueryPgTaskCfg', 'sceneval', {})
    for (let t of res.data.tasks) {
        if (tasks.includes(t.taskId)) {
            console.log(t.taskName)
            res = await api('task/drawUserTask', 'sceneval,taskid', { taskid: t.taskId })
            await $.wait(1000)
            res = await api('task/UserTaskFinish', 'sceneval,taskid', { taskid: t.taskId })
            await $.wait(2000)

        }
    }

    res = await api('active/LuckyTwistUserInfo', 'sceneval', {})
    let surplusTimes = res.data.surplusTimes
    console.log('剩余抽奖次数', surplusTimes)
    for (let j = 0; j < surplusTimes && coin >= 10; j++) {
        res = await api('active/LuckyTwistDraw', 'active,activedesc,sceneval', { active: 'rwjs_fk1111', activedesc: encodeURIComponent('幸运扭蛋机抽奖') })
        console.log('抽奖成功', res.data.prize[0].prizename)
        coin -= 10
        await $.wait(5000)
    }
    await $.wait(2000)
}

async function UserSignNew() {
    let fn = "sign/UserSignNew";
    let stk = "sceneval,source";
    let params = { source: '' };
    let res = await api(fn, stk, params);
    if (res) {
        console.log('签到', res.retCode == 0 ? "success" : "fail")
        console.log('助力码', res.data.token)
        shareCodes.push(res.data.token);
        coin = res.data.pgAmountTotal
        console.log('金币', coin)
    }
    return res;
}


function decrypturl(url, stk, params, appId = 10012) {
    for (const [key, val] of Object.entries(params)) {
        url += `&${key}=${val}`
    }
    url += '&h5st=' + decrypt(url, stk, appId)
    return url
}

function decrypt(url, stk, appId) {
    stk = stk || (url ? getJxmcUrlData(url, '_stk') : '')
    if (stk) {
        const timestamp = new Date().Format("yyyyMMddhhmmssSSS");
        let hash1 = '';
        if ($.fingerprint && $.Jxmctoken && $.enCryptMethodJD) {
            hash1 = $.enCryptMethodJD($.Jxmctoken, $.fingerprint.toString(), timestamp.toString(), appId.toString(), CryptoJS).toString(CryptoJS.enc.Hex);
        } else {
            const random = '5gkjB6SpmC9s';
            $.Jxmctoken = `tk01wcdf61cb3a8nYUtHcmhSUFFCfddDPRvKvYaMjHkxo6Aj7dhzO+GXGFa9nPXfcgT+mULoF1b1YIS1ghvSlbwhE0Xc`;
            $.fingerprint = 5287160221454703;
            const str = `${$.Jxmctoken}${$.fingerprint}${timestamp}${appId}${random}`;
            hash1 = CryptoJS.SHA512(str, $.Jxmctoken).toString(CryptoJS.enc.Hex);
        }
        let st = '';
        stk.split(',').map((item, index) => {
            st += `${item}:${getJxmcUrlData(url, item)}${index === stk.split(',').length - 1 ? '' : '&'}`;
        })
        const hash2 = CryptoJS.HmacSHA256(st, hash1.toString()).toString(CryptoJS.enc.Hex);
        return encodeURIComponent(["".concat(timestamp.toString()), "".concat($.fingerprint.toString()), "".concat(appId.toString()), "".concat($.Jxmctoken), "".concat(hash2)].join(";"))
    } else {
        return '20210318144213808;8277529360925161;10001;tk01w952a1b73a8nU0luMGtBanZTHCgj0KFVwDa4n5pJ95T/5bxO/m54p4MtgVEwKNev1u/BUjrpWAUMZPW0Kz2RWP8v;86054c036fe3bf0991bd9a9da1a8d44dd130c6508602215e50bb1e385326779d'
    }
}

function getJxmcUrlData(url, name) {
    if (typeof URL !== "undefined") {
        let urls = new URL(url);
        let data = urls.searchParams.get(name);
        return data ? data : '';
    } else {
        const query = url.match(/\?.*/)[0].substring(1)
        const vars = query.split('&')
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=')
            if (pair[0] === name) {
                return vars[i].substr(vars[i].indexOf('=') + 1);
            }
        }
        return ''
    }
}

async function api(fn, stk, params) {
    let url = `https://m.jingxi.com/pgcenter`;
    url = await decrypturl(`${url}/${fn}?sceneval=2&_stk=sceneval&_ste=1&_=${Date.now()}&sceneval=2`, stk, params, 10012)
    let myRequest = taskUrl(url);
    return new Promise(async resolve => {
        let rv = "";
        $.get(myRequest, (err, resp, data) => {
            try {
                if (data) {
                    data = JSON.parse(data)
                    rv = data
                }
            } catch (e) {
                console.log(data);
                $.logErr(e, resp)
                resolve();
            } finally {
                resolve(rv);
            }
        })
    })
}
function taskUrl(url) {
    return {
        url,
        headers: {
            "Host": "m.jingxi.com",
            "Connection": "keep-alive",
            "User-Agent": "jdpingou",
            "Accept": "*/*",
            "Referer": "https://st.jingxi.com/pingou/taskcenter/index.html",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
            "Cookie": $.cookie,
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
    }
}

function randomWord(randomFlag, min, max) {
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
    }
    for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
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


Date.prototype.Format = function (fmt) {
    var e,
        n = this, d = fmt, l = {
            "M+": n.getMonth() + 1,
            "d+": n.getDate(),
            "D+": n.getDate(),
            "h+": n.getHours(),
            "H+": n.getHours(),
            "m+": n.getMinutes(),
            "s+": n.getSeconds(),
            "w+": n.getDay(),
            "q+": Math.floor((n.getMonth() + 3) / 3),
            "S+": n.getMilliseconds()
        };
    /(y+)/i.test(d) && (d = d.replace(RegExp.$1, "".concat(n.getFullYear()).substr(4 - RegExp.$1.length)));
    for (var k in l) {
        if (new RegExp("(".concat(k, ")")).test(d)) {
            var t, a = "S+" === k ? "000" : "00";
            d = d.replace(RegExp.$1, 1 == RegExp.$1.length ? l[k] : ("".concat(a) + l[k]).substr("".concat(l[k]).length))
        }
    }
    return d;
}
