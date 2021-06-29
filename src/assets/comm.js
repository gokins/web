import Vue from 'vue';
import moment from 'moment';
import { Post, ApiUrl } from '@/assets/js/api'

export default {
    install(Vue) {
        Vue.prototype.$post = Post;
        Vue.prototype.$ApiUrl = ApiUrl;
        Vue.prototype.$EventBus = new Vue();
        Vue.prototype.$mntdUInfo = function(fn) {
            try {
                if (this.$store.state.userStat == true)
                    fn(this.$store.state.userInfo);
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
        }
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
            let date = new Date(dates);
            let mom = moment(date);
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
    }
}