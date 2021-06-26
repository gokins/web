import Vue from 'vue';
import { Post, ApiUrl } from '@/assets/js/api'

const utilCatch = (that,err,fn) => {
    debugger
    const stat = err.response ? err.response.status : 0;
    if (stat == 403) {
        that.$router.push('/pages/login')
        return true;
    }
    if(fn&&typeof fn==='function'){
        fn(err);
        return true;
    }else{
        that.$msgErr(
          err.response ? err.response.data || "服务器错误" : "网络错误"
        );
        return false;
    }
}
export default {
    install(Vue) {
        Vue.prototype.$post = Post;
        Vue.prototype.$ApiUrl = ApiUrl;
        Vue.prototype.$utilCatch = utilCatch;
    }
}