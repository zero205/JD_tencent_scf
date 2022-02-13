
# 云函数快速部署京东脚本
> - Github Action 部署[点这里](tencentscf.md#github-action-部署)  
> - ~~本地安装依赖使用serverless部署~~

# Github Action 部署
## 1. 开通服务

依次登录 [SCF 云函数控制台](https://console.cloud.tencent.com/scf) 和 [SLS 控制台](https://console.cloud.tencent.com/sls) 开通相关服务，确保账户下已开通服务并创建相应[服务角色](https://console.cloud.tencent.com/cam/role) **SCF_QcsRole、SLS_QcsRole**

> 注意！为了确保权限足够，获取这两个参数时不要使用子账户！此外，腾讯云账户需要[实名认证](https://console.cloud.tencent.com/developer/auth)。

## 2. 新建一个访问密钥 [点此新建密钥](https://console.cloud.tencent.com/cam/capi)
> 将获得的`SecretId`和`SecretKey`分别添加到仓库的secrets变量里面  
> 变量名Name：`TENCENT_SECRET_ID`，变量值Value：`SecretId`的值  
> 变量名Name：`TENCENT_SECRET_KEY`，变量值Value：`SecretKey`的值  

**secrets变量位置 : `仓库Settings`->`左边栏的Secrets`->`右上角New repository secret`->`Name填变量名称，Value填变量值`**  
**secrets变量位置 : `仓库Settings`->`左边栏的Secrets`->`右上角New repository secret`->`Name填变量名称，Value填变量值`**  
**secrets变量位置 : `仓库Settings`->`左边栏的Secrets`->`右上角New repository secret`->`Name填变量名称，Value填变量值`**  

## 3. 配置secrets变量
  
除必需的`JD_COOKIE`外，secret变量新增三个选填变量`SCF_REGION`,`TENCENT_FUNCTION_NAME`,`TENCENTSCF_MEMORYSIZE`（都有默认值,可不修改）

`SCF_REGION`用于控制部署区域的选择，value可填`ap-guangzhou`，其他地区具体参数代码填写可以自行查找官方说明 [地域和可用区](https://cloud.tencent.com/document/product/213/6091)  

`TENCENT_FUNCTION_NAME`用于控制部署到云函数后函数名的命名（别瞎改，改名的话确保之前的已经删除）

`TENCENTSCF_MEMORYSIZE`值为运行内存大小的设定值，默认为`64`（需求更大内存的可填入`128`，云函数有64MB就基本能满足日常需求了)

**【注意】提高内存设定值相应地也会加快消耗云函数的免费额度，超出免费额度将会产生费用**

### __重要的说三遍__   
### 如果涉及一个变量配置多个值，如多个cookie，互助码，多个取消订阅关键字，去掉里面的 *__[空格]()__* 和 __*[换行]()*__ 使用 `&` 连接   
### 如果涉及一个变量配置多个值，如多个cookie，互助码，多个取消订阅关键字，去掉里面的 *__[空格]()__* 和 __*[换行]()*__ 使用 `&` 连接   
### 如果涉及一个变量配置多个值，如多个cookie，互助码，多个取消订阅关键字，去掉里面的 *__[空格]()__* 和 __*[换行]()*__ 使用 `&` 连接   

## 4. 执行action workflow进行部署，workflow未报错即部署成功
**下图workflow名字现在叫做Deploy**

![image](https://user-images.githubusercontent.com/6993269/99513289-6a152980-29c5-11eb-9266-3f56ba13d3b2.png)
## 5. 查看和测试
登录后，在 [腾讯云函数地址](https://console.cloud.tencent.com/scf/index) 点击管理控制台，查看最新部署的函数。

在左侧栏的日志查询中，可以查看到触发的日志，包括是否打卡成功等。

**请点击右下角切换旧版编辑器!**

**自己参照图内填写测试脚本名称,不带后缀,测什么,填什么**
![测试函数](https://user-images.githubusercontent.com/6993269/99628053-5a9eea80-2a70-11eb-906f-f1d5ea2bfa3a.png)
