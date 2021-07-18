//'use strict';
exports.main_handler = async (event, context, callback) => {
  ['log', 'warn', 'error', 'debug','info'].forEach((methodName) => {
    const originalMethod = console[methodName];
    console[methodName] = (...args) => {
        try {
            throw new Error();
        } catch (error) {
            let stack = error
                .stack // Grabs the stack trace
                .split('\n')[2] // Grabs third line
                .split("/").slice(-1)[0] // Grabs third file name and line number
                .replace('.js','')
            stack = `${stack.substring(0, stack.lastIndexOf(':'))}:`
            originalMethod.apply(
                console,
                [
                    stack,
                    ...args
                ]
            );
        }
    };
  });
  try {
    const { TENCENTSCF_SOURCE_TYPE, TENCENTSCF_SOURCE_URL } = process.env
    //如果想在一个定时触发器里面执行多个js文件需要在定时触发器的【附加信息】里面填写对应的名称，用 & 链接
    //例如我想一个定时触发器里执行jd_speed.js和jd_bean_change.js，在定时触发器的【附加信息】里面就填写 jd_speed&jd_bean_change
    for (const v of event["Message"].split("&")) {
      console.log(v);
      var request = require('request');
      switch (TENCENTSCF_SOURCE_TYPE) {
        case 'git':
          //2.执行github远端的js文件(因github的raw类型的文件被墙,此方法云函数不推荐)
          request(`https://ghproxy.com/https://raw.githubusercontent.com/zero205/JD_tencent_scf/main/${v}.js`, function (error, response, body) {
            eval(response.body)
          })
          break;
        case 'custom':
          //3.执行自定义远端js文件网址
          if (!TENCENTSCF_SOURCE_URL) return console.log('自定义模式需要设置TENCENTSCF_SOURCE_URL变量')
          request(`${TENCENTSCF_SOURCE_URL}${v}.js`, function (error, response, body) {
            eval(response.body)
          })
          break;
        default:
          //执行自己上传的js文件
          const script = './'+v+'.js'
          delete require.cache[require.resolve(script)];
          require(script)
      }
    }
  } catch (e) {
    console.error(e)
  }
}
