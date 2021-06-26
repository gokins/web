import {Post} from '@/assets/js/api';

export const Login = (name, pass) => Post('/lg/login', { name: name, pass: pass });
export const UInfo = () => Post('/lg/info', {  });

//catch
export const UtilCatch=(that,err,fn) => {
    const stat = err.response ? err.response.status : 0;
    if (stat == 403) {
        that.$router.push('/login')
        return true;
    }
    if(fn&&typeof fn==='function'){
        fn(err,that);
        return true;
    }else{
        that.$msgErr(
          err.response ? err.response.data || "服务器错误" : "网络错误"
        );
        return false;
    }
}


//Org
export const OrgList = pars => Post('/org/list', pars);
export const OrgNew = pars => Post('/org/new', pars);
export const OrgInfo = id => Post('/org/info', {id:id});