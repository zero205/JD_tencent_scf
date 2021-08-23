// @grant    require
/*
Node.JS专用
https://raw.githubusercontent.com/zero205/JD_tencent_scf/main/jd_bean_sign.js
更新时间：2021-8-23
金融签到在测试,有能力可以单独反馈.
JRBODY抓取网站:ms.jr.jd.com/gw/generic/hy/h5/m/appSign(进入金融APP签到页面手动签到);格式:"reqData=xxx"
变量填写示例:JRBODY: reqData=xxx&reqData=xxx&&reqData=xxx(比如第三个号没有,则留空,长度要与CK一致)
云函数AC用户Secrests添加JRBODY_SCF,每行一个jrbody,结尾行写'Finish',某个帐号无jrbody则留空行
其他环境用户除了JRBODY环境变量可以选用JRBODY.txt文件,放在同目录下,规则同上一行AC用户.
注:优先识别环境变量,如使用txt文件请不要设置环境变量.
 */
console.log('京东多合一签到SCF开始')
const sendNotify = require('./sendNotify.js').sendNotify
const fs = require('fs')
const jr_file = 'JRBODY.txt'
const readline = require('readline')
let cookiesArr = []

async function processLineByLine(jrbodys) {
  const fileStream = fs.createReadStream(jr_file)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  for await (let line of rl) {
    line = line.trim()
    if (line == 'Finish'){
      console.log(`识别到读取结束符号,结束.供读取${jrbodys.length}个`)
      return
    }
    jrbodys.push(line)
  }
}
(async () => {
  const jdCookieNode = require('./jdCookie.js')
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  let jrbodys
  console.log(cookiesArr)
  if(process.env.JRBODY) {
    jrbodys = process.env.JRBODY.split('&')
    if (jrbodys.length != cookiesArr.length) {
      console.error('CK和JRBODY长度不匹配,不使用JRBODY,请阅读脚本开头说明')
      jrbodys = undefined
    }
  }else{
    console.log(`为检测到JRBODY环境变量,开始检测${jr_file}`)
    try {
      await fs.accessSync('./'+jr_file, fs.constants.F_OK)
      console.log(`${jr_file} '存在,读取配置'`)
      jrbodys = []
      await processLineByLine(jrbodys)
    } catch (err) {
      console.log(`${jr_file} '不存在,跳过'`)
    }
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    const data = {
      'cookie':cookiesArr[i]
    }
    if (jrbodys) {
      if(jrbodys[i].startsWith('reqData=')){
          data['jrBody'] = jrbodys[i]
        }else{
          console.log(`跳过第${i+1}个JRBODY,为空或格式不正确`)
        }
    }
    cookiesArr[i] = data
  }
  console.log('main block finished')
})()
.then(() => {
console.log('Nobyda签到部分开始')

}).catch(e => {
console.error("ERRROR:",e)
})
