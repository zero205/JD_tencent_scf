/*
东东农场互助码
此文件为Node.js专用。其他用户请忽略
支持京东N个账号
 */
//云服务器腾讯云函数等NOde.js用户在此处填写京东东农场的好友码。
// 同一个京东账号的好友互助码用@符号隔开,不同京东账号之间用&符号或者换行隔开,下面给一个示例
// 如: 京东账号1的shareCode1@京东账号1的shareCode2&京东账号2的shareCode1@京东账号2的shareCode2
let FruitShareCodes = [
'73ce84ec9ec84612b6fa7fd2194c3407@e67a27cc4fdb4258b6b921aadd780fc7@09a3b94d8e0d428486900ad63d10727b',
'b7e175b4704e4c5daca706c9cd065e5c@e67a27cc4fdb4258b6b921aadd780fc7@09a3b94d8e0d428486900ad63d10727b', 
'b7e175b4704e4c5daca706c9cd065e5c@73ce84ec9ec84612b6fa7fd2194c3407@09a3b94d8e0d428486900ad63d10727b', 
'b7e175b4704e4c5daca706c9cd065e5c@73ce84ec9ec84612b6fa7fd2194c3407@e67a27cc4fdb4258b6b921aadd780fc7', 
'b7e175b4704e4c5daca706c9cd065e5c@73ce84ec9ec84612b6fa7fd2194c3407@e67a27cc4fdb4258b6b921aadd780fc7', 
'b7e175b4704e4c5daca706c9cd065e5c@73ce84ec9ec84612b6fa7fd2194c3407@e67a27cc4fdb4258b6b921aadd780fc7', 
'73ce84ec9ec84612b6fa7fd2194c3407@e67a27cc4fdb4258b6b921aadd780fc7@09a3b94d8e0d428486900ad63d10727b', 
'09a3b94d8e0d428486900ad63d10727b@6615b75be2884eef8f5f35140fb6108e@6c9aa3ee5c1c4902a3755b64ca64741c', 
'6615b75be2884eef8f5f35140fb6108e@6c9aa3ee5c1c4902a3755b64ca64741c@80ca9ea7da0a448e8850961e6261a954', 
'6615b75be2884eef8f5f35140fb6108e@6c9aa3ee5c1c4902a3755b64ca64741c@80ca9ea7da0a448e8850961e6261a954', 
'6615b75be2884eef8f5f35140fb6108e@6c9aa3ee5c1c4902a3755b64ca64741c@80ca9ea7da0a448e8850961e6261a954', 
'6615b75be2884eef8f5f35140fb6108e@6c9aa3ee5c1c4902a3755b64ca64741c@80ca9ea7da0a448e8850961e6261a954', 
'80ca9ea7da0a448e8850961e6261a954@b532eb6e048e45e39a37b850ba54c21b@a675df08b1ac46c58d9302cf64bb0d7d', 
'b532eb6e048e45e39a37b850ba54c21b@a675df08b1ac46c58d9302cf64bb0d7d@46b57d979eb647039d5c1d18e746f59d', 
'b532eb6e048e45e39a37b850ba54c21b@a675df08b1ac46c58d9302cf64bb0d7d@46b57d979eb647039d5c1d18e746f59d', 
'b532eb6e048e45e39a37b850ba54c21b@a675df08b1ac46c58d9302cf64bb0d7d@46b57d979eb647039d5c1d18e746f59d'
]
// 判断github action里面是否有水果互助码
if (process.env.FRUITSHARECODES) {
  if (process.env.FRUITSHARECODES.indexOf('&') > -1) {
    console.log(`您的东东农场互助码选择的是用&隔开\n`)
    FruitShareCodes = process.env.FRUITSHARECODES.split('&');
  } else if (process.env.FRUITSHARECODES.indexOf('\n') > -1) {
    console.log(`您的东东农场互助码选择的是用换行隔开\n`)
    FruitShareCodes = process.env.FRUITSHARECODES.split('\n');
  } else {
    FruitShareCodes = process.env.FRUITSHARECODES.split();
  }
} else if (process.env.JD_COOKIE) {
  console.log(`您secret里面未提供助力码，优先进行自己账号内互助，然后再给脚本内置的码进行助力，请知晓！`)
}
for (let i = 0; i < FruitShareCodes.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['FruitShareCode' + index] = FruitShareCodes[i];
}
