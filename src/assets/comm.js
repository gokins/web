// import Vue from 'vue';
import moment from 'moment';
import { Post, ApiUrl } from '@/assets/js/api'

function fix(num, length) {
    return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
}
export default {
    install(Vue) {
        Vue.prototype.$post = Post;
        Vue.prototype.$ApiUrl = ApiUrl;
        /* Vue.prototype.$EventBus = new Vue();
        Vue.prototype.$mntdUInfo = function(fn) {
            try {
                if (this.$store.state.userStat == true)
                    fn(this.$store.state.user, this.$store.state.userInfo);
                else {
                    this.$EventBus.$on('onGetUserInfo', fn);
                }
            } catch (e) {}
        };
        Vue.prototype.$offUInfo = function(fn) {
            this.$EventBus.$off('onGetUserInfo', fn);
        }
        Vue.prototype.$refreshUInfo = function() {
            this.$EventBus.$emit('refreshUserInfo');
        } */
        Vue.prototype.$isEndStatus = function(stat) {
            switch (stat) {
                case 'ok':
                case 'cancel':
                case 'error':
                    return true;
            }
            return false;
        }
        Vue.prototype.$dateFmt = function(dates, fs) {
            // let date = new Date(dates);
            let mom = moment(dates);
            switch (fs) {
                case 1:
                    return mom.format('YYYY-MMM-DD');
                case 2:
                    return mom.format('hh:mm:ss');
                case 3:
                    return mom.format('mm:ss');
            }
            return mom.format('YYYY-MM-DD hh:mm:ss');
        }
        Vue.prototype.$dateZero = function(dates) {
            if (!dates || dates == '' || dates == '0001-01-01T00:00:00Z')
                return true
            let date = new Date(dates)
            if (date.getYear() == 0 || date.getYear() == 1)
                return true
            return false
        }
        Vue.prototype.$dateCha = function(begins, ends) {
            if (this.$dateZero(begins)) {
                return '0'
            }
            let dateBegin = new Date(begins);
            let dateEnd = new Date();
            if (!this.$dateZero(ends))
                dateEnd = new Date(ends);
            let dateDiff = dateEnd.getTime() - dateBegin.getTime();
            let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
            let leave1 = dateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
            let hours = Math.floor(leave1 / (3600 * 1000)) //计算出小时数
                //计算相差分钟数
            let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
            let minutes = Math.floor(leave2 / (60 * 1000)) //计算相差分钟数
                //计算相差秒数
            let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
            let seconds = Math.round(leave3 / 1000)
            if (dayDiff > 0) {
                return dayDiff + ':' + fix(hours, 2) + ':' + fix(minutes, 2) + ':' + fix(seconds, 2)
            } else if (hours > 0) {
                return fix(hours, 2) + ':' + fix(minutes, 2) + ':' + fix(seconds, 2)
            }
            /* else if (minutes > 0) {
                           return minutes + ':' + seconds
                       } */
            return fix(minutes, 2) + ':' + fix(seconds, 2)
        }
    }
}