## 鉴于目前仓库fork人数过多，为防止账号再次遭到封禁，临时建立了一个TG群
## 有条（科学）件（上网）的可以加入TG群防止失联
## TG群频道：https://t.me/jd_zero205

# 为防止仓库再次被封，本仓库仅保留腾讯云函数、elecV2P两种方式运行
# 想继续使用AC运行的朋友请移步原仓库，没有大的更新随缘维护：https://github.com/zero205/JD  

## 注意！原来使用zero205/JD仓库的用户可不用重新创建仓库，替换原脚本的代码即可同步本仓库
* 1.先打开自己的仓库，然后找到syncGit.yml文件【`路径：./.github/workflows/syncGit.yml`】，点击右上角铅笔图标进行修改  
* 2.[点此打开最新同步脚本](https://ghproxy.com/https://raw.githubusercontent.com/zero205/JD_tencent_scf/main/.github/workflows/syncGit.yml)，然后复制全部代码替换原代码  
* 3.点击右边绿色`Start commit`,点击`Commit changes`，手动运行一次此任务即可

## 使用教程（不要fork！觉得有用的可以点个star :blush:）
* > ~~Github Action 运行~~ (响应lxk大佬要求，删除AC教程)
* > 腾讯云函数部署【推荐】。[点此查看](./backUp/tencentscf.md)
* > [elecV2P](https://github.com/elecV2/elecV2P) 部署【备用】。
    * 安装教程：[点此查看](https://github.com/elecV2/elecV2P-dei/blob/master/docs/01-overview.md)  
    * 相关补充说明：[点此查看](./backUp/elecV2P.md)  


## 自动同步脚本教程：[点此查看](https://github.com/zero205/JD_tencent_scf/blob/main/backUp/reposync.md)  </br>

## AC运行常见问题  
* 此处借用[RayWangQvQ](https://github.com/RayWangQvQ)大佬的教程  
* [点击查看常见问题](https://github.com/RayWangQvQ/BiliBiliTool.Docs/blob/main/questions.md)  

## 特别声明: 

* 本仓库发布的Script项目中涉及的任何解锁和解密分析脚本，仅用于测试和学习研究，禁止用于商业用途，不能保证其合法性，准确性，完整性和有效性，请根据情况自行判断.

* 本项目内所有资源文件，禁止任何公众号、自媒体进行任何形式的转载、发布。

* lxk0301对任何脚本问题概不负责，包括但不限于由任何脚本错误导致的任何损失或损害.

* 间接使用脚本的任何用户，包括但不限于建立VPS或在某些行为违反国家/地区法律或相关法规的情况下进行传播, lxk0301 对于由此引起的任何隐私泄漏或其他后果概不负责.

* 请勿将Script项目的任何内容用于商业或非法目的，否则后果自负.

* 如果任何单位或个人认为该项目的脚本可能涉嫌侵犯其权利，则应及时通知并提供身份证明，所有权证明，我们将在收到认证文件后删除相关脚本.

* 任何以任何方式查看此项目的人或直接或间接使用该Script项目的任何脚本的使用者都应仔细阅读此声明。lxk0301 保留随时更改或补充此免责声明的权利。一旦使用并复制了任何相关脚本或Script项目的规则，则视为您已接受此免责声明.

 **您必须在下载后的24小时内从计算机或手机中完全删除以上内容.**  </br>
> ***您使用或者复制了本仓库且本人制作的任何脚本，则视为`已接受`此声明，请仔细阅读*** 

## Script脚本列表

#### 说明

1. 其中 [jd_bean_sign.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_bean_sign.js) 可N个京东账号，Node.js专用，核心脚本是JD_DailyBonus.js， IOS软件用户请使用NobyDa的 [JD_DailyBonus.js](https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js)

2. 以字母排序。

<!-- 这是隐藏信息，用来给 update_list.sh 脚本提供标记信息的，用于自动生成下面的脚本清单，请勿删除这里的标记信息。 -->
<!-- 此表格由 update_list.sh 脚本自动生成，请不要人工修改。 -->
<!-- 清单标记开始 -->
| 序号 | 文件 | 名称 | 活动入口 |
| :-: | - | - | - |
|1|[jd_bean_change.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_bean_change.js)|京东资产变动通知||
|2|[jd_bean_home.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_bean_home.js)|领京豆额外奖励|京东APP首页-领京豆|
|3|[jd_bean_sign.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_bean_sign.js)|京东多合一签到|各处的签到汇总|
|4|[jd_beauty.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_beauty.js)|美丽研究院|京东app首页-美妆馆-底部中间按钮|
|5|[jd_blueCoin.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_blueCoin.js)|东东超市兑换奖品|京东APP我的-更多工具-东东超市|
|6|[jd_bookshop.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_bookshop.js)|口袋书店|京东app首页-京东图书-右侧口袋书店|
|7|[jd_car.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_car.js)|京东汽车|京东APP首页-京东汽车-屏幕右中部，车主福利|
|8|[jd_car_exchange.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_car_exchange.js)|京东汽车兑换|京东APP首页-京东汽车-屏幕右中部，车主福利|
|9|[jd_cash.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_cash.js)|签到领现金|京东APP搜索领现金进入|
|10|[jd_cfd.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_cfd.js)|京喜财富岛|京喜APP-我的-京喜财富岛|
|11|[jd_club_lottery.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_club_lottery.js)|摇京豆|京东APP首页-领京豆-摇京豆/京东APP首页-我的-京东会员-摇京豆|
|12|[jd_crazy_joy.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_crazy_joy.js)|crazyJoy任务|京东APP我的-更多工具-疯狂的JOY|
|13|[jd_crazy_joy_bonus.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_crazy_joy_bonus.js)|监控crazyJoy分红|京东APP我的-更多工具-疯狂的JOY|
|14|[jd_crazy_joy_coin.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_crazy_joy_coin.js)|crazyJoy挂机|京东APP我的-更多工具-疯狂的JOY|
|15|[jd_daily_egg.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_daily_egg.js)|天天提鹅|京东金融-天天提鹅|
|16|[jd_delCoupon.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_delCoupon.js)|删除优惠券|京东APP我的-优惠券|
|17|[jd_dreamFactory.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_dreamFactory.js)|京喜工厂|京东APP-游戏与互动-查看更多-京喜工厂|
|18|[jd_dreamFactory2.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_dreamFactory2.js)|京喜工厂|京东APP-游戏与互动-查看更多-京喜工厂|
|19|[jd_family.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_family.js)|京东家庭号|玩一玩-家庭号|
|20|[jd_fruit.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_fruit.js)|东东农场|京东APP我的-更多工具-东东农场|
|21|[jd_get_share_code.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_get_share_code.js)|获取互助码||
|22|[jd_global.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_global.js)|环球挑战赛|京东app搜索京东国际-环球挑战赛|
|23|[jd_global_mh.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_global_mh.js)|京东国际盲盒|京东app首页浮动窗口|
|24|[jd_jdfactory.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_jdfactory.js)|东东工厂|京东APP首页-数码电器-东东工厂|
|25|[jd_jdzz.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_jdzz.js)|京东赚赚|京东赚赚小程序|
|26|[jd_joy.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_joy.js)|宠汪汪|京东APP我的-更多工具-宠汪汪|
|27|[jd_joy_feedPets.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_joy_feedPets.js)|宠汪汪🐕喂食|京东APP我的-更多工具-宠汪汪|
|28|[jd_joy_help.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_joy_help.js)|宠汪汪强制为别人助力|京东APP我的-更多工具-宠汪汪|
|29|[jd_joy_reward.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_joy_reward.js)|宠汪汪积分兑换奖品|京东APP我的-更多工具-宠汪汪|
|30|[jd_joy_run.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_joy_run.js)|宠汪汪赛跑|京东APP我的-更多工具-宠汪汪|
|31|[jd_jxd.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_jxd.js)|京小兑|微信搜索小程序-京小兑|
|32|[jd_jxnc.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_jxnc.js)|京喜农场|京喜APP我的-京喜农场|
|33|[jd_kd.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_kd.js)|京东快递签到|[活动地址](https://jingcai-h5.jd.com/#/)|
|34|[jd_live.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_live.js)|京东直播|京东APP首页-京东直播|
|35|[jd_live_redrain.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_live_redrain.js)|超级直播间红包雨||
|36|[jd_lotteryMachine.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_lotteryMachine.js)|京东抽奖机|京东APP中各种抽奖活动的汇总|
|37|[jd_mohe.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_mohe.js)|5G超级盲盒|[活动地址](https://isp5g.m.jd.com)|
|38|[jd_moneyTree.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_moneyTree.js)|京东摇钱树|京东APP我的-更多工具-摇钱树|
|39|[jd_ms.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_ms.js)|京东秒秒币|京东app-京东秒杀-签到领红包|
|40|[jd_necklace.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_necklace.js)|点点券|京东APP-领券中心/券后9.9-领点点券|
|41|[jd_nzmh.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_nzmh.js)|女装盲盒抽京豆|京东app-女装馆-赢京豆|
|42|[jd_pet.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_pet.js)|东东萌宠|京东APP我的-更多工具-东东萌宠|
|43|[jd_pigPet.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_pigPet.js)|金融养猪|京东金融养猪猪|
|44|[jd_plantBean.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_plantBean.js)|京东种豆得豆|京东APP我的-更多工具-种豆得豆|
|45|[jd_price.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_price.js)|京东保价|京东保价|
|46|[jd_rankingList.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_rankingList.js)|京东排行榜|京东APP首页-更多频道-排行榜-悬浮按钮|
|47|[jd_redPacket.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_redPacket.js)|京东全民开红包|京东APP首页-领券-锦鲤红包|
|48|[jd_sgmh.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_sgmh.js)|闪购盲盒|京东APP首页-闪购-闪购盲盒|
|49|[jd_shop.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_shop.js)|进店领豆|京东APP首页-领京豆-进店领豆|
|50|[jd_sign.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_sign.js)|京东卡包签到||
|51|[jd_small_home.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_small_home.js)|东东小窝|京东APP我的-游戏与更多-东东小窝|
|52|[jd_speed.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_speed.js)|✈️天天加速|京东APP我的-更多工具-天天加速|
|53|[jd_speed_sign.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_speed_sign.js)|京东极速版|京东极速版app-现金签到|
|54|[jd_superMarket.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_superMarket.js)|东东超市|京东APP首页-京东超市-底部东东超市|
|55|[jd_syj.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_syj.js)|赚京豆|赚京豆(微信小程序)-赚京豆-签到领京豆|
|56|[jd_unsubscribe.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_unsubscribe.js)|取关京东店铺和商品||
|57|[jx_sign.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jx_sign.js)|京喜签到||
<!-- 清单标记结束 -->
<!-- 此表格由 update_list.sh 脚本自动生成，请不要人工修改。 -->
<!-- 这是隐藏信息，用来给 update_list.sh 脚本提供标记信息的，用于自动生成上面的脚本清单，请勿删除这里的标记信息。 -->

#### 搬运脚本

1.  【 [@yangtingxiao](https://github.com/yangtingxiao) 】 京东抽奖机([jd_lotteryMachine.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_lotteryMachine.js))

2.  【 [@yangtingxiao](https://github.com/yangtingxiao) 】 京东排行榜([jd_rankingList.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_rankingList.js))

**脚本兼容: [QuantumultX](https://apps.apple.com/us/app/quantumult-x/id1443988620), [Surge](https://apps.apple.com/us/app/surge-4/id1442620678), [Loon](https://apps.apple.com/us/app/loon/id1373567447), 小火箭, JSBox, Node.js**

## 邀请码互助

- [获取各类活动互助码脚本 jd_get_share_code.js](https://gitee.com/lxk0301/jd_scripts/raw/master/jd_get_share_code.js)

- [邀请码使用规范](githubAction.md#互助码类环境变量)(仅限云端)

## 食用方法

### ~~1. Docker~~

- ~~[部署方法](./docker)~~

- [环境变量集合](./githubAction.md)
 
- 获取京东cookie教程可参考：
  
  + [浏览器获取京东cookie教程](./backUp/GetJdCookie.md)
    
  + [插件获取京东cookie教程](./backUp/GetJdCookie2.md)
    
  + 京东APP扫码获取cookie(此种方式获取的cookie有效期为30天)(执行`node getJDCookie.js`即可)

### 2. iOS代理软件（QuantumultX, Surge, Loon, 小火箭）

##### BoxJs订阅地址：[lxk0301.boxjs.json](https://gitee.com/lxk0301/jd_scripts/raw/master/lxk0301.boxjs.json)

##### 获取京东cookie [JD_extra_cookie.js](https://gitee.com/lxk0301/jd_scripts/raw/master/JD_extra_cookie.js)

##### 订阅链接：

- Surge：Task&Cookies脚本模块地址: [lxk0301_Task.sgmodule.sgmodule](https://gitee.com/lxk0301/jd_scripts/raw/master/Surge/lxk0301_Task.sgmodule.sgmodule)

- Loon：Task&Cookies脚本订阅链接: [lxk0301_LoonTask.conf](https://gitee.com/lxk0301/jd_scripts/raw/master/Loon/lxk0301_LoonTask.conf)

- QuantumultX Task脚本订阅链接: [lxk0301_gallery.json](https://gitee.com/lxk0301/jd_scripts/raw/master/QuantumultX/lxk0301_gallery.json)，cookie(重写)订阅链接: [lxk0301_cookies.conf](https://gitee.com/lxk0301/jd_scripts/raw/master/QuantumultX/lxk0301_cookies.conf)

## 通知频道 [https://t.me/jdfruit](https://t.me/jdfruit)

## 赞赏码(开发维护不易,请赏杯茶水费)

<div align=center><img width="250" height="250" src="./icon/thanks.jpg"/></div>


## 特别感谢(排名不分先后)：


* [@NobyDa](https://github.com/NobyDa)

* [@chavyleung](https://github.com/chavyleung)

* [@liuxiaoyucc](https://github.com/liuxiaoyucc)

* [@Zero-S1](https://github.com/Zero-S1)

* [@uniqueque](https://github.com/uniqueque)

* [@nzw9314](https://github.com/nzw9314)
