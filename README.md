## 主仓库地址: https://github.com/zero205/JD_tencent_scf/tree/main
## 为了您的数据安全,必须将仓库私有,具体内容请到主仓库地址查看.
## 当前:配置文件部署方式
## 配置文件部署方式说明:
1. 需要配合配置文件分支config使用.(请运行对应action获取分支)
2. TENCENT开头的NAME/REGION/MEMORYSIZE/TIMEOUT依然使用Secrets
3. TENCENT的SECRET_ID/SECRET_KEY请填入config分支的.env文件
4. 其余所有环境变量填入config分支的config.yml格式请照第一行填写(追加在后面,每个一行,注意冒号后方空格).
5. 金融签到可以在config分支新建JRBODY.txt文件,按jd_bean_sign开头格式写入JRBODY.
6. config分支内diy文件夹内所有内容(如果有的话)会覆盖/加入仓库文件并部署上去(当然包含serverless.yml).仅适用于有高级需求的朋友.
7. config分支diy.sh如果有的话会自动运行(仅面向高级用户)
暂时只推荐有一点点基础的用户使用.

云函数问题可以入群寻求帮助(仔细阅读教程,需要有一定基础,进群后看反馈流程后再提问).入群地址见主仓库.
## 未来可能的更新
https://github.com/Ca11back/scf-experiment

欢迎各位大佬尝试/PR实验性特性.
