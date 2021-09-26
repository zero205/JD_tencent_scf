## 主仓库地址: https://github.com/zero205/JD_tencent_scf/tree/main
## 为了您的数据安全,必须将仓库私有,具体内容请到主仓库地址查看.
## 当前:配置文件部署方式(暂时只推荐有一点点基础的用户使用)
## 配置文件部署方式说明:
1. 需要配合配置文件分支config使用.(请运行对应action获取分支)
2. TENCENT开头的NAME/REGION(SCF_REGION)/MEMORYSIZE/TIMEOUT依然使用Secrets
3. PAT依然使用Secrests
4. TENCENT的SECRET_ID/SECRET_KEY请填入config分支的.env文件
5. 其余所有环境变量填入config分支的config.yml格式请照第一行填写(追加在后面,每个一行,注意冒号后方空格).
6. 金融签到可以在config分支新建JRBODY.txt文件,按jd_bean_sign开头格式写入JRBODY.(此条未来会逐步废弃,请按下一条将JRBODY.txt放入diy文件夹)
7. config分支内diy文件夹内所有内容(如果有的话)会覆盖/加入仓库文件并部署上去(当然包含serverless.yml).仅适用于有高级需求的朋友.
8. config分支diy.sh如果有的话会自动运行(仅面向高级用户)
9. 添加一个Secret:EXPERIMENT即可使用实验性特性(执行顺序在上述两个diy操作之前,所以diy内容如果跟实验性特性有冲突,会覆盖,也方便各位大佬施展自己的骚操作).具体请看下方.

## 未来可能的更新(实验性特性,仅限高级用户):
https://github.com/Ca11back/scf-experiment

欢迎各位大佬尝试/PR实验性特性.
## FAQ(常见问题):
### Github部署日志:ETIMEOUT ERROR
ETIMEDOUT 错误腾讯是腾讯问题,初步怀疑同时部署人数较多
1. 请尝试手动删除/添加config分支.env文件中的GLOBAL_ACCELERATOR_NA=true,尝试关闭/或开启境外加速.(默认开启,且建议开启)
2. 启用随机分钟部署(默认开启,在定时的小时随机抽取分钟进行执行).关闭请直接禁用Random Cron workflow

如果还是经常失败的话,请进群反馈(置顶反馈流程)!提供完整github部署日志.除了失败别的什么也提供不了.我修不了或者干脆不修你们也能理解吧.

## 其他通知(有时会有临时性通知):

**云函数问题可以入群寻求帮助(仔细阅读教程,需要有一定基础,进群后看反馈流程后再提问).入群地址见主仓库.**

**群内回复'云函数扣费'可以获得云函数扣费分析方法和正常扣费水平.**
