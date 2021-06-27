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
    }else if (stat == 405){
        that.$msgErr('无权限');
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
export const OrgSave = pars => Post('/org/save', pars);

//Pipeline
export const PipelineList = pars => Post('/pipeline/pipelines', pars);
export const OrgPipelineList = pars => Post('/pipeline/org/pipelines', pars);
export const NewPipeline = pars => Post('/pipeline/new', pars);
export const PipelineInfo = pars => Post('/pipeline/info', pars);
export const SavePipeline = pars => Post('/pipeline/save', pars);