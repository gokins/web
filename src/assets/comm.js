import Vue from 'vue';
import { Post, ApiUrl } from '@/assets/js/api'

export default {
    install(Vue) {
        Vue.prototype.$post = Post;
        Vue.prototype.$ApiUrl = ApiUrl;
    }
}