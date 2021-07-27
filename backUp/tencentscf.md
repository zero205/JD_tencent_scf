
# 云函数快速部署京东脚本
> - 如有多个京东账号需要填互助码，请创建多个仓库分别进行部署;不填互助码的话测试同时添加15个账号CK没问题
> - Github Action 部署[点这里](tencentscf.md#github-action-部署)
> - ~~本地安装依赖使用serverless部署~~

# Github Action 部署
## 1. 开通服务

依次登录 [SCF 云函数控制台](https://console.cloud.tencent.com/scf) 和 [SLS 控制台](https://console.cloud.tencent.com/sls) 开通相关服务，确保账户下已开通服务并创建相应[服务角色](https://console.cloud.tencent.com/cam/role) **SCF_QcsRole、SLS_QcsRole**

> 注意！为了确保权限足够，获取这两个参数时不要使用子账户！此外，腾讯云账户需要[实名认证](https://console.cloud.tencent.com/developer/auth)。

## 2. 在这里新建一个访问密钥[新建密钥](https://console.cloud.tencent.com/cam/capi)
> 将SecretId和SecretKey分别配置在仓库的secrets变量里面， TENCENT_SECRET_ID对应你的SecretId的值，TENCENT_SECRET_KEY对应你的SecretKey的值

### secrets变量位置 : `Settings`--`左边栏的Secrets`--`右上角New repository secret`--`Name填变量名称,Value填变量值`  
### secrets变量位置 : `Settings`--`左边栏的Secrets`--`右上角New repository secret`--`Name填变量名称,Value填变量值`  
### secrets变量位置 : `Settings`--`左边栏的Secrets`--`右上角New repository secret`--`Name填变量名称,Value填变量值`  

## 3. 配置secrets变量
  
除必需的`JD_COOKIE`外，secret变量新增两个必填变量`SCF_REGION`和`TENCENT_FUNCTION_NAME`,一个选填变量`TENCENTSCF_MEMORYSIZE`  

`SCF_REGION`用于控制部署区域的选择，value可填`ap-guangzhou`，其他地区具体参数代码填写可以自行查找官方说明 [地域和可用区](https://cloud.tencent.com/document/product/213/6091)  

`TENCENT_FUNCTION_NAME`用于控制部署到云函数后函数名的命名，value可随意，可填`JD`，但必须与下一步里云函数新建的空白函数名一致!!  

`TENCENTSCF_MEMORYSIZE`值为运行内存大小的设定值，默认为`64`，需求更大内存的可填入`128`，云函数有128MB就能满足了  

请注意**提高内存设定值相应地也会加快消耗云函数的免费额度，超出免费额度将会产生费用**

~~## 4. 配置index.js中secrets变量说明【可不填，建议默认即可】
现在可以通过secret设置自定义index.js中的执行方式，环境变量分别为`TENCENTSCF_SOURCE_TYPE`，`TENCENTSCF_SOURCE_URL`和`TENCENTSCF_MEMORYSIZE`<br>
`TENCENTSCF_SOURCE_TYPE`值可以选取`local`、`git`、`custom`具体含义可查看仓库中的`index.js`文件说明
`TENCENTSCF_SOURCE_URL`格式为包含raw的URL，例如：`https://raw.fastgit.org/zero205/JD_tencent_scf/main/`或`https://gitee.com/zero205/JD_tencent_scf/raw/main/`~~


### __重要的说三遍__   
### 如果涉及一个变量配置多个值，如多个cookie，互助码，多个取消订阅关键字，去掉里面的 *__[空格]()__* 和 __*[换行]()*__ 使用 `&` 连接   
### 如果涉及一个变量配置多个值，如多个cookie，互助码，多个取消订阅关键字，去掉里面的 *__[空格]()__* 和 __*[换行]()*__ 使用 `&` 连接   
### 如果涉及一个变量配置多个值，如多个cookie，互助码，多个取消订阅关键字，去掉里面的 *__[空格]()__* 和 __*[换行]()*__ 使用 `&` 连接   


> 排查问题第一步先看自己[腾讯云函数](https://console.cloud.tencent.com/scf/list-detail?rid=5&ns=default&id=jd)那边的环境变量跟自己在仓库配置的 `secrets` 是否一致
![image](https://user-images.githubusercontent.com/6993269/99937191-06617680-2da0-11eb-99ea-033f2c655683.png)

## 5. 新建空白云函数[登录云函数之后点此直达](https://console.cloud.tencent.com/scf/list-create?rid=1&ns=default&functionName=jd&createType=empty)

**先在需要部署的区域下新建一个空函数，名称可以任意，比如：`jd`，此时secret中`TENCENT_FUNCTION_NAME`值也必须是`jd`，保持与云函数的函数名一致，目前部署云函数的策略是覆盖的方式，故而此步骤至关重要。**  
![image](https://user-images.githubusercontent.com/26343559/113259916-40b7c300-9300-11eb-8771-87f8bfd76707.jpg)


## 6. 执行action workflow进行部署，workflow未报错即部署成功


![image](https://user-images.githubusercontent.com/6993269/99513289-6a152980-29c5-11eb-9266-3f56ba13d3b2.png)
## 7. 查看和测试
登录后，在 [腾讯云函数地址](https://console.cloud.tencent.com/scf/index) 点击管理控制台，查看最新部署的函数。

在左侧栏的日志查询中，可以查看到触发的日志，包括是否打卡成功等。

![测试函数](https://user-images.githubusercontent.com/6993269/99628053-5a9eea80-2a70-11eb-906f-f1d5ea2bfa3a.png)
