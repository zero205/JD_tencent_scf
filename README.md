## 主仓库地址: https://github.com/zero205/JD_tencent_scf/tree/main
## 为了您的数据安全,仓库必须为私有!!!
## 配置文件部署方式说明:
1. 需要配合配置文件分支config使用.(请运行对应action获取分支,获取后点击左上方 main 来切换分支.)
2. TENCENT开头的NAME/REGION(SCF_REGION)/MEMORYSIZE/TIMEOUT依然使用Secrets
3. PAT依然使用Secrests
4. TENCENT的SECRET_ID/SECRET_KEY请填入config分支的.env文件.
5. 其余所有环境变量填入config分支的config.yml格式请照第一行填写(追加在后面,每个一行,英文冒号,注意冒号后方空格.bool值(true/false),请带引号, 如XXXX: 'false').

## 云函数部分常用变量说明(默认值见仓库serverless.yml):
1. TENCENT_NAME(Secret): 函数名字,修改后注意删除原来名字的函数,名字强烈建议自己搞一个,别用默认的.
2. TENCENT_NAME_MEMORYSIZE(Secret): 运行内存64,128,256.大内存会加快配额消耗.单位Mb.不建议修改.
3. TENCENT_TIMEOUT(Secret): 云函数超时时间,单位秒.不建议修改.
4. SCF_REGION(Secret): 云函数部署地区,注意修改后删除原地区旧函数.[地区费用表](https://cloud.tencent.com/document/product/583/12281).
5. NOT_RUN(环境变量): 不运行的脚本.如: jd_cfd&jd_joy&jd_jdfactory. 无默认值

## FAQ(常见问题):
### Github部署日志:ETIMEOUT ERROR
1. 请尝试手动删除/添加config分支.env文件中的GLOBAL_ACCELERATOR_NA=true,尝试关闭/或开启境外加速.(默认开启,且建议开启)
2. 启用随机分钟部署(默认开启,在定时的小时随机抽取分钟进行执行).关闭请直接禁用Random Cron workflow
### Github部署日志:未找到函数执行入口文件
云函数面板删除函数,更改Secret函数名字TENCENT_NAME,重新运行action部署.
### 云函数流量异常高,触发日志与流量日志对不上
解决方法同上
### 云函数如何调试/手动运行脚本
@hshx123大佬教程测试那步怎么写的你就怎么用.
## 其他通知(有时会有临时性通知):

**云函数问题可以入群寻求帮助(仔细阅读教程,需要有一定基础,进群后看置顶反馈流程后再提问).入群地址见主仓库.**

**群内回复'云函数扣费'可以获得云函数扣费分析方法和正常扣费水平.**

额外说一句: 云函数只是一个运行环境,怎么用还是看人,并不是很多脚本云函数就不能跑,只是你不会用...觉得麻烦考虑转青龙吧,各有各的优点.云函数对于个人用来说还是很友好的.

## 面向高级用户:
1. 金融签到可以在config分支新建JRBODY.txt文件,按jd_bean_sign开头格式写入JRBODY.(请将JRBODY.txt按一条放入diy文件夹)
2. config分支内diy文件夹内所有内容(如果有的话)会覆盖/加入仓库文件并部署上去(当然包含serverless.yml).diy文件夹创建方法:在config分支下,点击右上方'Add File'->'Create New File', 名字写diy/xxx, 填好内容点commit即可
3. config分支diy.sh如果有的话会自动运行
4. 支持config_diy.json自定义运行规则,见下文.
5. 之前添加Secret:EXPERIMENT.请删除.避免下一次测试开启自动载入.
### config_diy.json使用说明/例子:
**前排提醒,diy文件夹下confg_diy.json中的内容会对config.json也就是官方默认配置的规则是:有则覆盖,无则合并.比如config.json中某脚本4小时运行一次,我在confg_diy.json中3小时运行一次,则规则覆盖.如果那个脚本官方配置中没有,则使用confg_diy.json的配置**

1. 在diy文件夹下新加入config_diy.json来自定义脚本运行,格式与config.json相同. 比如我想自定义运行xx_aaa脚本,从每天6点到23点(另一种时间写入方式见下方第3条)则config_diy为:
```json
{
    "xx_aaa": [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
}
```
2. 同步执行(顺序执行,推荐 总体运行时间短的/高级用户 开启):
- 默认异步运行
- 异步运行脚本运行时间更短,同步是顺序运行,时间更长.
- 同步运行解决了异步运行有潜在的脚本同时运行产生冲突可能性
- 理论上更安全
- 异步运行不支持timeout参数,也就是单脚本有异常也不会在自定义超时时间停止,只能靠TENCENT_TIMEOUT整体超时参数结束.
- 同步执行每个脚本运行完后(或设定超时触发后)才会打印日志,但如果是TENCENT_TIMEOUT整体超时触发,则看不到日志.鉴于影响也不是特别大.暂时没考虑怎么解决,希望大佬给个意见.
```json
{
    "params":
    {
        "global":
        {
            "exec": "sync"
        }
    }
}
```
3. 自定义每个脚本的超时时常为15分钟(同步执行才生效).注意:TENCENT_TIMEOUT为全局超时,也就是每次整个函数运行时候的超时时间,建议使用默认值3600.(此处例子我想要xx_aaa脚本每3小时运行,注意3两侧没有方括号).
```json
{
    "xx_aaa": 3,
    "params":
    {
        "global":
        {
            "exec": "sync",
            "timeout": 15
        }
    }
}
```
4. 自定义某个脚本(例子中是jd_speed_sign)超时时常为50分钟(同步执行才生效),在执行这个脚本时,超时会使用50分钟,而不是15分钟:
```json
{
    "xx_aaa": 3,
    "params":
    {
        "global":
        {
            "exec": "sync",
            "timeout": 15
        },
        "jd_speed_sign":
        {
            "timeout": 50
        }
    }
}
```
5. 部分兑换类脚本单独使用一个触发器,且不受timeout参数控制.详见:serverless.yml
6. jd_cfd_loop已经移除,需要请自己添加至config_diy.json,参考cron:"jd_cfd_loop",只建议同步用户添加: 
```json
{
    "jd_cfd_loop": [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
}
```
