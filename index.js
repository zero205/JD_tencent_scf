//'use strict';
exports.main_handler = async (event, context, callback) => {
    var parser = require('cron-parser');

    let params = {}
    let scripts = []
    const single_flag = event["Message"] != 'config'
    if (single_flag) {
        if (!event["Message"]) {
            console.error('未接收到任何参数,请阅读@hshx123大佬教程的测试步骤,查看如何使用.')
            return 
        }
        console.log('参数触发方式(不读取配置文件),触发参数:', event["Message"])
        scripts = event["Message"].split("&")
    } else {
        const now_hour = (new Date().getUTCHours() + 8) % 24
        const now_Minu = new Date().getUTCMinutes()
        console.log('hourly config触发:', now_hour)
        const { readFileSync, accessSync, constants } = require('fs')
        const config_file = 'config.json'
        try {
            await accessSync('./' + config_file, constants.F_OK)
            console.log(`${config_file} 存在`)
        } catch (err) {
            console.error(`${config_file} 不存在,结束`)
            return
        }
        let config
        try {
            config = JSON.parse(await readFileSync(config_file))
        } catch (e) {
            console.error(`read config error:${e}`)
            return
        }
        // console.debug(JSON.stringify(config))
        params = config['params']
        delete config['params']

        const config_diy_file = 'config_diy.json'
        try {
            await accessSync('./' + config_diy_file, constants.F_OK)
            console.log(`${config_diy_file} 存在`)
            const config_diy = JSON.parse(await readFileSync(config_diy_file))
            if (config_diy['params']) {
                params = { ...params, ...config_diy['params'] }
                delete config_diy['params']
            }
            config = { ...config, ...config_diy }
        } catch (err) {
            console.error(`${config_diy_file} 不存在或解析异常`)
        }
        console.log("params:", params)
        for (let script in config) {
            // console.debug(`script:${script}`)
            const cron = config[script]
            if (typeof cron == 'number') {
                // console.debug(`number param:${cron}`)
                if (now_hour % cron == 0 && now_Minu == 0) {
                    console.debug(`${script}:number cron triggered!`)
                    scripts.push(script)
                }
            } else {
                if (typeof cron == 'string') {
                  // console.debug(`string param:${cron}`)
                  try {
                    var options = {
                      currentDate: Date.now(),
                      tz: process.env.TZ
                    };
                    var interval = parser.parseExpression(cron, options);
                    if (Math.abs((new Date(options.currentDate) - new Date(interval.next().getTime())) / 1000) < 10 
                    || Math.abs((new Date(options.currentDate) - new Date(interval.prev().getTime())) / 1000) < 10) {
                      console.debug(`${script}:string cron triggered!`)
                      scripts.push(script)
                    }
                  } catch (err) {
                    console.log('Error: ' + err.message);
                  }
                } else {
                    // console.debug(`dict param:${cron}`)
                    if (cron.includes(now_hour) && now_Minu == 0) {
                        console.debug(`${script}:array cron triggered!`)
                        scripts.push(script)
                    }                    
                }
            }
        }
    }
    if (process.env.NOT_RUN) {
        const not_run = process.env.NOT_RUN.split("&")
        scripts = scripts.filter(script => {
            const flag = not_run.includes(script)
            if (flag) {
                console.log(`not run:${script}`)
            }
            return !flag
        })
    }
    if (!scripts.length){
        console.log('No Script to Execute, Exit!')
        return
    }
    const is_sync = (params['global'] && params['global']['exec'] == 'sync')
    console.log('当前是', is_sync ? '同' : '异', '步执行')
    if (is_sync) {
        const { execFile } = require('child_process')
        const min = 1000 * 60
        const param_names = ['timeout']
        for (const script of scripts) {
            const name = './' + script + '.js'
            const param_run = {}
            if (!single_flag) {
                const param = params[script]
                for (const param_name of param_names) {
                    if (param) {
                        if (param[param_name]) {
                            console.debug(`${script} has specific ${param_name}:${param[param_name]}`)
                            param_run[param_name] = min * param[param_name]
                        }
                    } else if (params['global'] && params['global'][param_name]) {
                        console.debug(`${script} use global ${param_name}`)
                        param_run[param_name] = min * params['global'][param_name]
                    } else {
                        console.warn(`No global ${param_name}!`)
                    }
                }
            }
            console.log(`run script:${script}`)
            try {
                await (async () => {
                    return new Promise((resolve) => {
                        const child = execFile(process.execPath, [name], param_run)
                        child.stdout.on('data', function(data) {
                            console.log(data)
                        })
                        child.stderr.on('data', function(data) {
                            console.error(data)
                        })
                        child.on('close', function(code) {
                            console.log(`${script} finished`)
                            resolve()
                        })
                    })
                })()
            } catch (e) {
                console.error(`${script} ERROR:${e}`)
                console.error(`stdout:${e.stdout}`)
            }
        }
    } else {
        console.log('异步执行不支持params参数!');
        ['log', 'warn', 'error', 'debug', 'info'].forEach((methodName) => {
            const originalMethod = console[methodName]
            console[methodName] = (...args) => {
                try {
                    throw new Error()
                } catch (error) {
                    let stack = error
                        .stack // Grabs the stack trace
                        .split('\n')[2] // Grabs third line
                        .split("/").slice(-1)[0] // Grabs  file name and line number
                        .replace('.js', '')
                    stack = `${stack.substring(0, stack.lastIndexOf(':'))}:`
                    originalMethod.apply(
                        console,
                        [
                            stack,
                            ...args
                        ]
                    )
                }
            }
        })
        for (const script of scripts) {
            console.log(`run script:${script}`)
            const name = './' + script + '.js'
            require(name)
        }
    }
}
