"""
const $ = new Env("热爱环游记逛店铺抽金币);
热爱环游记底部小程序任务
活动入口：热爱环游记

cron:
15 0 * * * jd_hyjcoin.py
"""
import os
import requests
import time
import random
import re
import sys


def gettimestamp():
    return str(int(time.time() * 1000))


def printf(text):
    print(text)
    sys.stdout.flush()


def randomstr(num):
    randomstr = ""
    for i in range(num):
        randomstr = randomstr + random.choice("abcdefghijklmnopqrstuvwxyz0123456789")
    return randomstr


def getheader(ck, miniAppId):
    return {
        'referer': 'https://service.vapp.jd.com/%s/1/page-frame.html' % miniAppId,
        'cookie': ck,
        'charset': 'utf-8',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 5.1.1; vmos Build/LMY48G; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2743.100 Mobile Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': 'api.m.jd.com',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip',
    }


def getShops(ck):
    url = "https://api.m.jd.com/client.action?functionId=qryCompositeMaterials"
    body = 'functionId=qryCompositeMaterials&body={"qryParam":"[{\\"type\\":\\"advertGroup\\",\\"mapTo\\":\\"babelCountDownFromAdv\\",\\"id\\":\\"05884370\\"},{\\"type\\":\\"advertGroup\\",\\"mapTo\\":\\"feedBannerT\\",\\"id\\":\\"05860672\\"},{\\"type\\":\\"advertGroup\\",\\"mapTo\\":\\"feedBannerS\\",\\"id\\":\\"05861001\\"},{\\"type\\":\\"advertGroup\\",\\"mapTo\\":\\"feedBannerA\\",\\"id\\":\\"05861003\\"},{\\"type\\":\\"advertGroup\\",\\"mapTo\\":\\"feedBannerB\\",\\"id\\":\\"05861004\\"},{\\"type\\":\\"advertGroup\\",\\"mapTo\\":\\"feedBottomHeadPic\\",\\"id\\":\\"05872092\\"},{\\"type\\":\\"advertGroup\\",\\"mapTo\\":\\"feedBottomData0\\",\\"id\\":\\"05908556\\"},{\\"type\\":\\"advertGroup\\",\\"mapTo\\":\\"fissionData\\",\\"id\\":\\"05863777\\"},{\\"type\\":\\"advertGroup\\",\\"mapTo\\":\\"newProds\\",\\"id\\":\\"05864483\\"}]","activityId":"2vVU4E7JLH9gKYfLQ5EVW6eN2P7B","pageId":"","reqSrc":"","applyKey":"jd_star"}&client=wh5&clientVersion=1.0.0&uuid=D213233343536-3030353566623&eu=D213233343536&fv=3030353566623'
    headers = {
        'Host': 'api.m.jd.com',
        'Connection': 'keep-alive',
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'https://wbbny.m.jd.com',
        'User-Agent': 'jdapp;android;10.1.0;5.1.1;D213233343536-3030353566623;network/wifi;model/vmos;addressid/0;aid/a1b50b08ea25d3c8;oaid/;osVer/22;appBuild/89568;partner/jd-msy;eufv/1;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 5.1.1; vmos Build/LMY48G; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045714 Mobile Safari/537.36',
        'Sec-Fetch-Mode': 'cors',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'com.jingdong.app.mall',
        'Sec-Fetch-Site': 'same-site',
        'Referer': 'https://wbbny.m.jd.com/babelDiy/Zeus/2vVU4E7JLH9gKYfLQ5EVW6eN2P7B/index.html?babelChannel=jdappsyfc&from=home&sid=c5932fbc544cb6a6e48323799c01ae8w&un_area=1_72_2799_0',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cookie': ck
    }
    r = requests.post(url, headers=headers, data=body)
    return r.json()["data"]["feedBottomData0"]["list"]


def getShopInfo(ck, id):
    url = "https://api.m.jd.com/client.action?functionId=jm_promotion_queryPromotionInfoByShopId"
    body = 'functionId=jm_promotion_queryPromotionInfoByShopId&body={"shopId":"%s","channel":20}&client=wh5&clientVersion=1.0.0' % id
    headers = {
        'Host': 'api.m.jd.com',
        'Connection': 'keep-alive',
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'https://wbbny.m.jd.com',
        'User-Agent': 'jdapp;android;10.1.0;5.1.1;D213233343536-3131336133616;network/wifi;model/vmos;addressid/;aid/76ad0c59c9b2ec0b;oaid/;osVer/22;appBuild/89568;partner/jd-msy;eufv/1;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 5.1.1; vmos Build/LMY48G; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045714 Mobile Safari/537.36',
        'Sec-Fetch-Mode': 'cors',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'com.jingdong.app.mall',
        'Sec-Fetch-Site': 'same-site',
        'Referer': 'https://wbbny.m.jd.com/babelDiy/Zeus/2vVU4E7JLH9gKYfLQ5EVW6eN2P7B/index.html',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cookie': ck
    }
    r = requests.post(url, headers=headers, data=body).json()['data']['wxUrl']
    appId = re.findall(r'appId=(.*?)&', r)[0]
    shopId = re.findall(r'shopId=(.*?)&', r)[0]
    venderId = re.findall(r'venderId=(.*?)&', r)[0]
    return shopId, venderId, appId


# 获取任务列表
def getTaskList(ck, shopId, venderId, miniAppId):
    url = "https://api.m.jd.com/client.action"
    body = 'functionId=jm_marketing_maininfo&body={"shopId":"%s","venderId":"%s","miniAppId":"%s"}&t=%s&appid=shop_view&clientVersion=10.0.0&client=wh5&uuid=%s' % (
        shopId, venderId, miniAppId, gettimestamp(), randomstr(16))
    # printf(body)
    headers = getheader(ck, miniAppId)
    r = requests.post(url, headers=headers, data=body).json()
    return r["data"]["project"]["viewTaskVOS"]


# 逛一逛“热爱环游记”互动
def TaskType8(ck, shopId, venderId, miniAppId, taskId, token):
    time.sleep(5)
    url = "https://api.m.jd.com/client.action"
    body = 'functionId=jm_task_process&body={"shopId":"%s","venderId":"%s","miniAppId":"%s","taskId":%s,"token":"%s","opType":1}&t=%s&appid=shop_view&clientVersion=10.0.0&client=wh5&uuid=%s' % (
        shopId, venderId, miniAppId, taskId, token, gettimestamp(), randomstr(16))
    headers = getheader(ck, miniAppId)
    r = requests.post(url, headers=headers, data=body)
    if r.json()["code"] == 200:
        printf('开始做逛一逛“热爱环游记”互动任务，休息10秒')
        time.sleep(10)
        body = 'functionId=jm_task_process&body={"shopId":"%s","venderId":"%s","miniAppId":"%s","taskId":%s,"token":"%s","opType":2}&t=%s&appid=shop_view&clientVersion=10.0.0&client=wh5&uuid=%s' % (
            shopId, venderId, miniAppId, taskId, token, gettimestamp(), randomstr(16))
        r = requests.post(url, headers=headers, data=body)
        if r.json()["code"] == 810:
            printf("任务已完成")
        else:
            printf("任务完成失败")
    else:
        printf(r.text)
        printf('做逛一逛“热爱环游记”互动任务失败')


# 逛逛店铺
def TaskType4(ck, shopId, venderId, miniAppId, taskId, token):
    time.sleep(5)
    url = "https://api.m.jd.com/client.action"
    body = 'functionId=jm_task_process&body={"shopId":"%s","venderId":"%s","miniAppId":"%s","taskId":%s,"token":"%s","opType":1}&t=%s&appid=shop_view&clientVersion=10.0.0&client=wh5&uuid=%s' % (
        shopId, venderId, miniAppId, taskId, token, gettimestamp(), randomstr(16))
    headers = getheader(ck, miniAppId)
    r = requests.post(url, headers=headers, data=body)
    if r.json()["code"] == 200:
        printf('开始做逛逛店铺任务，休息6秒')
        time.sleep(6)
        body = 'functionId=jm_task_process&body={"shopId":"%s","venderId":"%s","miniAppId":"%s","taskId":%s,"token":"%s","opType":2}&t=%s&appid=shop_view&clientVersion=10.0.0&client=wh5&uuid=%s' % (
            shopId, venderId, miniAppId, taskId, token, gettimestamp(), randomstr(16))
        r = requests.post(url, headers=headers, data=body)
        if r.json()["code"] == 810:
            printf("任务已完成")
        else:
            printf("任务完成失败")
    else:
        printf(r.text)
        printf('做逛一逛“逛逛店铺”互动任务失败')


# 加购商品
def TaskType5(ck, shopId, venderId, miniAppId, taskId, token, times):
    time.sleep(5)
    url = "https://api.m.jd.com/client.action"
    body = 'functionId=jm_goods_taskGoods&body={"shopId":"%s","venderId":"%s","miniAppId":"%s","taskId":%s}&t=%s&appid=shop_view&clientVersion=10.0.0&client=wh5&uuid=%s' % (
        shopId, venderId, miniAppId, taskId, gettimestamp(), randomstr(16))
    headers = getheader(ck, miniAppId)
    r = requests.post(url, headers=headers, data=body)
    if r.json()["code"] == 200:
        printf("开始做加购商品任务")
        skuList = r.json()["data"]["skuList"]
        for i in range(times):
            time.sleep(5)
            # url = "https://mapi.m.jd.com/cart/add.json?wareId=%s&num=1&resourceType=jshop&resourceValue=jshop" % (
            #     skuList[i]["skuId"])
            # headers["Host"] = "mapi.m.jd.com"
            # r = requests.post(url, headers=headers, data="")
            # if r.json()["errId"] == "0":
            #     printf("加购 %s 成功" % skuList[i]["name"])
            #     headers["Host"] = "api.m.jd.com"
            body = 'functionId=jm_task_process&body={"shopId":"%s","venderId":"%s","miniAppId":"%s","taskId":%s,"token":"%s","opType":2,"referSource":%s}&t=%s&appid=shop_view&clientVersion=10.0.0&client=wh5&uuid=%s' % (
                shopId, venderId, miniAppId, taskId, token, skuList[i]["skuId"], gettimestamp(), randomstr(16))
            r = requests.post(url, headers=headers, data=body)
            if r.json()["code"] == 810:
                printf("任务已完成")
            else:
                printf("任务完成失败")
            # else:
            #     printf("加购失败")
    else:
        printf("做加购商品任务失败")


# 看看好物
def TaskType3(ck, shopId, venderId, miniAppId, taskId, token, times):
    time.sleep(5)
    url = "https://api.m.jd.com/client.action"
    body = 'functionId=jm_goods_taskGoods&body={"shopId":"%s","venderId":"%s","miniAppId":"%s","taskId":%s}&t=%s&appid=shop_view&clientVersion=10.0.0&client=wh5&uuid=%s' % (
        shopId, venderId, miniAppId, taskId, gettimestamp(), randomstr(16))
    headers = getheader(ck, miniAppId)
    r = requests.post(url, headers=headers, data=body)
    # printf(r.text)
    if r.json()["code"] == 200:
        printf("开始做看看好物任务")
        skuList = r.json()["data"]["skuList"]
        body = 'functionId=jm_task_process&body={"shopId":"%s","venderId":"%s","miniAppId":"%s","taskId":%s,"token":"%s","opType":1,"referSource":%s}&t=%s&appid=shop_view&clientVersion=10.0.0&client=wh5&uuid=%s' % (
            shopId, venderId, miniAppId, taskId, token, skuList[1]["skuId"], gettimestamp(), randomstr(16))
        r = requests.post(url, headers=headers, data=body)
        if r.json()["code"] == 200:
            for i in range(times):
                time.sleep(5)
                printf("正在浏览 %s ，等待6秒" % skuList[i]["name"])
                time.sleep(6)
                body = 'functionId=jm_task_process&body={"shopId":"%s","venderId":"%s","miniAppId":"%s","taskId":%s,"token":"%s","opType":2,"referSource":%s}&t=%s&appid=shop_view&clientVersion=10.0.0&client=wh5&uuid=%s' % (
                    shopId, venderId, miniAppId, taskId, token, skuList[i]["skuId"], gettimestamp(), randomstr(16))
                r = requests.post(url, headers=headers, data=body)
                if r.json()["code"] == 810:
                    printf("任务已完成")
                else:
                    printf("任务完成失败")
        else:
            printf("浏览失败")
    else:
        printf("做看看好物任务失败")


def TaskType1(ck, shopId, venderId, miniAppId, taskId, token):
    url = "https://api.m.jd.com/client.action"
    headers = getheader(ck, miniAppId)
    for i in range(20):
        body = 'functionId=jm_task_process&body={"shopId":"%s","venderId":"%s","miniAppId":"%s","taskId":%s,"token":"%s","opType":2}&t=%s&appid=shop_view&clientVersion=10.0.0&client=wh5&uuid=%s' % (
            shopId, venderId, miniAppId, taskId, token, gettimestamp(), randomstr(16))
        r = requests.post(url, headers=headers, data=body)
        if r.json()["code"] == 810:
            printf("抽奖结果：", r.json()["data"]["awardVO"]["name"], r.json()["data"]["awardVO"]["discount"])
        elif r.json()["code"] == 804:
            printf("没有抽奖机会，跳出")
            break
        elif r.json()["code"] == 814:
            printf("当天活动参与总次数达到上限，跳出")
            global limited
            limited = 1
            break
        else:
            printf("抽奖失败")
        time.sleep(5)


def followShop(ck, shopId):
    time.sleep(5)
    url = "https://api.m.jd.com/client.action"
    body = 'functionId=followShop&body={"shopId":"%s","follow":true,"type":0,"sourceRpc":"shop_app_myfollows_shop","refer":"https://wq.jd.com/pages/index/index"}&t=%s&appid=shop_view&clientVersion=10.0.0&client=wh5&uuid=%s' % (
        shopId, gettimestamp(), randomstr(16))
    headers = getheader(ck, miniAppId)
    r = requests.post(url, headers=headers, data=body)
    # printf(r.text)
    if r.json()["msg"] == "关注成功":
        printf("关注店铺成功")
    else:
        printf("关注店铺失败")


if __name__ == '__main__':
    try:
        cks = os.environ["JD_COOKIE"].split("&")
    except:
        f = open("/jd/config/config.sh", "r", encoding='utf-8')
        cks = re.findall(r'Cookie[0-9]*="(pt_key=.*?;pt_pin=.*?;)"', f.read())
        f.close()
    for ck in cks:
        limited = 0
        ptpin = re.findall(r"pt_pin=(.*?);", ck)[0]
        printf("--------开始京东账号" + ptpin + "--------")
        shoplist = getShops(ck)
        for shop in shoplist:
            try:
                if limited != 1:
                    printf("开始执行%s" % shop["name"])
                    shopId, venderId, miniAppId = getShopInfo(ck, shop["link"])
                    followShop(ck, shopId)
                    tasks = getTaskList(ck, shopId, venderId, miniAppId)
                    # printf(tasks)
                    for i in tasks:
                        if i["finishCount"] == 0:
                            if i["type"] == 8:
                                TaskType8(ck, shopId, venderId, miniAppId, i["id"], i["token"])
                            if i["type"] == 4:
                                TaskType4(ck, shopId, venderId, miniAppId, i["id"], i["token"])
                            if i["type"] == 5:
                                TaskType5(ck, shopId, venderId, miniAppId, i["id"], i["token"], i["totalCount"])
                            if i["type"] == 3:
                                TaskType3(ck, shopId, venderId, miniAppId, i["id"], i["token"], i["totalCount"])
                    for i in tasks:
                        if i["type"] == 1:
                            TaskType1(ck, shopId, venderId, miniAppId, i["id"], i["token"])
            except:
                printf("发生异常错误")
