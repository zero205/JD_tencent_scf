## 【青龙】拉取仓库命令：

#### 可以直链github/国外机:
`ql repo https://github.com/zero205/JD_tencent_scf.git "jd_|jx_|jdCookie"  "backUp|icon" "^jd[^_]|USER|sendNotify|sign_graphics_validate|JDJR|JDSign|ql" "main"`

#### 国内镜像（选一个即可）:

`ql repo https://hub.fastgit.xyz/zero205/JD_tencent_scf.git "jd_|jx_|jdCookie"  "backUp|icon" "^jd[^_]|USER|sendNotify|sign_graphics_validate|JDJR|JDSign|ql" "main"`

`ql repo https://hub.0z.gs/zero205/JD_tencent_scf.git "jd_|jx_|jdCookie"  "backUp|icon" "^jd[^_]|USER|sendNotify|sign_graphics_validate|JDJR|JDSign|ql" "main"`

`ql repo https://hub.shutcm.cf/zero205/JD_tencent_scf.git "jd_|jx_|jdCookie"  "backUp|icon" "^jd[^_]|USER|sendNotify|sign_graphics_validate|JDJR|JDSign|ql" "main"`


### (直连/镜像均不可用时,请参照下面使用直连命令并设置代理)

设置代理/国内加速:

老版青龙(临时解决),需要设置config.sh(如果还有extra.sh的话,也改)中的GithubProxyUrl改为
https://pd.zwc365.com/ 或 https://pd.zwc365.com/cfworker/

新版青龙可以改ProxyUrl为自己的科学上网代理,来走自己的代理

或者直接将上面两个代理地址追加到url之前来临时解决
`ql repo https://pd.zwc365.com/https://github.com/zero205/JD_tencent_scf.git "jd_|jx_|jdCookie"  "backUp|icon" "^jd[^_]|USER|sendNotify|sign_graphics_validate|JDJR|JDSign|ql" "main"``

[高级用户,可以自己创建自己的cf woker做git代理(注意将cnpmjs设为0)](https://github.com/hunshcn/gh-proxy#cf-worker%E7%89%88%E6%9C%AC%E9%83%A8%E7%BD%B2)

[或者尝试修改host来尝试直连](https://www.cnblogs.com/jiannanchun/p/15397235.html)