import Vue from 'vue';
import { Post, ApiUrl } from '@/assets/js/api'

export default {
    install(Vue) {
        Vue.prototype.$post = Post;
        Vue.prototype.$ApiUrl = ApiUrl;
        Vue.prototype.$EventBus = new Vue();
        Vue.prototype.$mntdUInfo = function(fn) {
            try {
                if (this.$store.state.userStat==true)
                    fn(this.$store.state.userInfo);
                else {
                    this.$EventBus.$on('onGetUserInfo', fn);
                }
            } catch (e) {}
        };
        Vue.prototype.$offUInfo = function(fn) {
            this.$EventBus.$off('onGetUserInfo',fn);
        }
        Vue.prototype.$refreshUInfo = function() {
            this.$EventBus.$emit('refreshUserInfo');
        }
    }
}