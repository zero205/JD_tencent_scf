const USER_AGENTS = []
/**
 * 生成随机数字
 * @param {number} min 最小值（包含）
 * @param {number} max 最大值（不包含）
 */
function randomNumber(min = 0, max = 100) {
    return Math.min(Math.floor(min + Math.random() * (max - min)), max);
}

/**
 * 得到一个两数之间的随机整数，包括两个数在内
 * @param min
 * @param max
 * @returns {number}
 */
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
}
/**
 * 生成随机 iPhoneID
 * @returns {string}
 */
function randPhoneId() {
    return Math.random().toString(36).slice(2, 10) +
        Math.random().toString(36).slice(2, 10) +
        Math.random().toString(36).slice(2, 10) +
        Math.random().toString(36).slice(2, 10) +
        Math.random().toString(36).slice(2, 10);
}

const USER_AGENT = `jdapp;iPhone;10.2.0;${Math.ceil(Math.random()*4+10)}.${Math.ceil(Math.random()*4)};${randPhoneId()};network/4g;model/iPhone11,8;addressid/1188016812;appBuild/167724;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS ${getRandomIntInclusive(11, 14)}_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`;

module.exports = {
    USER_AGENT
}
