/*
Node.JS专用
cron 0 0 * * *  https://raw.githubusercontent.com/zero205/JD_tencent_scf/main/jd_bean_sign.js
金融签到有一定使用门槛,需要请仔细阅读下方文字:
JRBODY抓取网站:ms.jr.jd.com/gw/generic/hy/h5/m/appSign(进入金融APP签到页面手动签到);抓取请求body,格式:"reqData=xxx"
变量填写示例:JRBODY: reqData=xxx&reqData=xxx&&reqData=xxx(比如第三个号没有,则留空,长度要与CK一致)

强烈建议用文件,环境变量太长了
云函数用户在config分支新建diy/JRBODY.txt即可(也就是diy文件夹下新建JRBODY.txt).每行一个jrbody,结尾行写'Finish'
例子:
reqData=xxx
(这个号没有,这行空着)
reqData=xxx
Finish

其他环境用户除了JRBODY环境变量可以选用JRBODY.txt文件,放在同目录下,格式同上.
注:优先识别环境变量,如使用txt文件请不要设置环境变量.JRBODY换行符(应为unix换行符)可能影响脚本读取!

出现任何问题请先删除CookieSet.json(云函数不用操作)
云函数提示写入失败正常,无任何影响
 */
console.log('京东多合一签到SCF开始')
const sendNotify = require('./sendNotify.js').sendNotify
const fs = require('fs')
const jr_file = 'JRBODY.txt'
const readline = require('readline')
let cookiesArr = []
let notification = ''
const stopVar = process.env.JD_BEAN_STOP ? process.env.JD_BEAN_STOP : '1000-2000';
console.log('Stop:',stopVar)

async function processLineByLine(jrbodys) {
  const fileStream = fs.createReadStream(jr_file)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  for await (let line of rl) {
    line = line.trim()
    if (line == 'Finish'){
      console.log(`识别到读取结束符号,结束.共读取${jrbodys.length}个`)
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
  let jrbodys = []
  if(process.env.JRBODY) {
    jrbodys = process.env.JRBODY.split('&')
  }else{
    console.log(`未检测到JRBODY环境变量,开始检测${jr_file}`)
    try {
      await fs.accessSync('./'+jr_file, fs.constants.F_OK)
      console.log(`${jr_file} '存在,读取配置'`)
      await processLineByLine(jrbodys)
    } catch (err) {
      console.log(`${jr_file} '不存在,跳过'`)
    }
  }
  if (jrbodys.length != cookiesArr.length) {
    console.error(`CK和JRBODY长度不匹配,不使用JRBODY,请阅读脚本开头说明.当前ck长度:${cookiesArr.length},JRBODY长度:${jrbodys.length}`)
    jrbodys = undefined
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
