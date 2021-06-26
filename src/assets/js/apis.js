import {Post} from '@/assets/js/api';

export const Login = (name, pass) => Post('/lg/login', { name: name, pass: pass });

//catch
export const UtilCatch=(that,err,fn) => {
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


//Org
export const OrgNew = pars => {
    console.log('what',Post)
    return Post('/org/new', pars)};