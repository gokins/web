export const regPhone = /^1\d{10}$/i;

export const backtop = () => {
    var timer = setInterval(function() {
        let osTop = document.documentElement.scrollTop || document.body.scrollTop;
        let ispeed = Math.floor(-osTop / 5);
        document.documentElement.scrollTop = document.body.scrollTop = osTop + ispeed;
        if (osTop <= 0) {
            clearInterval(timer);
        }
    }, 30)
    return timer;
}
export const getFlSize = (size) => {
    var rets = "0K";
    if (size == null || size <= 0) return rets
    if (size >= 1073741824)
        rets = (parseFloat(size) / 1073741824).toFixed(2) + "G";
    else if (size >= 1048576)
        rets = (parseFloat(size) / 1048576).toFixed(2) + "M";
    else if (size >= 1024)
        rets = (parseFloat(size) / 1048576).toFixed(2) + "K";
    else
        rets = size + "B";
    return rets;
}
export const isMobile = () => {
    var sUserAgent = navigator.userAgent.toLowerCase();
    console.log("UserAgent:" + sUserAgent);
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        return true;
    }
    return false;
}
export const browserRedirect = (ul, vo) => {
    // console.log('browserRedirect', isMobile(), ul);
    if (isMobile()) {
        if ((!ul || ul == '') && vo && vo.$route)
            ul = vo.$route.path;
        window.top.location.replace('http://m.jazpan.com' + ul);
    }
}

export const notPcWechat = () => {
    return navigator.userAgent.indexOf('WindowsWechat') < 0;
}


export const jsDateFormat = function(date, fmt) {
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //24小时制
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;

};

export const parseGoTimestr = (tms, fmts) => {
    if (tms == '') return "<error>"
    let date = new Date(tms)
    return jsDateFormat(date, fmts || 'yyyy-MM-dd hh:mm:ss');
}

export const parseGoTimestrs = (tms) => {
    if (tms == '') return "<error>"
    let now = new Date()
    let date = new Date(tms);
    let times = now.getTime() - date.getTime();
    //  let mon = date.getMonth();
    let day = Math.floor(times / (24 * 3600 * 1000));
    let hour = Math.floor(times / (3600 * 1000));
    let min = Math.floor(times / (60 * 1000));
    let sec = Math.floor(times / (1000));

    let rets = '';
    if (day <= 100) {
        if (day > 0) {
            rets += day + '天'
            hour = hour - (day * 24);
            rets += hour + '小时'
        } else if (hour > 0) {
            rets += hour + '小时'
            min = min - (hour * 60);
            rets += min + '分钟'
        } else if (min > 0)
            rets += min + '分钟'
        else if (sec >= 0)
            rets += sec + '秒'
        rets += '前';
    } else {
        rets = jsDateFormat(date, 'yyyy-MM-dd hh:mm:ss');
    }
    return rets;
}
export const copyText = (txt) => {
    var copyok = false;
    try {
        window.getSelection().removeAllRanges();
    } catch (e) {
        console.log(e)
    }
    var txte = document.createElement("textarea");
    txte.value = txt
    document.body.appendChild(txte)
    try {
        txte.select();
        copyok = document.execCommand('copy', false, null);
    } catch (e) {
        console.log(e)
    }
    document.body.removeChild(txte)
    return copyok
}