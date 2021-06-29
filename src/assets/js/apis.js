import { Post } from '@/assets/js/api';

export const Login = (name, pass) => Post('/lg/login', { name: name, pass: pass });
export const UInfo = () => Post('/lg/info', {});

//catch
export const UtilCatch = (that, err, fn) => {
    const stat = err.response ? err.response.status : 0;
    if (stat == 403) {
        that.$store.commit('clearUserInfo');
        that.$router.push('/login')
        return true;
    }
    if (fn && typeof fn === 'function') {
        fn(err, that);
        return true;
    } else if (stat == 405) {
        that.$msgErr('无权限');
        return true;
    } else {
        that.$msgErr(
            err.response ? err.response.data || "服务器错误" : "网络错误"
        );
        return false;
    }
}


//User
export const UserPage = pars => Post('/user/page', pars);


//Org
export const OrgList = pars => Post('/org/list', pars);
export const OrgNew = pars => Post('/org/new', pars);
export const OrgInfo = id => Post('/org/info', { id: id });
export const OrgUsers = id => Post('/org/users', { id: id });
export const OrgSave = pars => Post('/org/save', pars);
export const OrgUserEdit = pars => Post('/org/user/edit', pars);
export const OrgUserRm = (id, uid) => Post('/org/user/rm', { id, uid });
export const OrgPipeAdd = (id, pipeId) => Post('/org/pipe/add', { id, pipeId });
export const OrgPipeRm = (id, pipeId) => Post('/org/pipe/rm', { id, pipeId });

//Pipeline
export const PipelineList = pars => Post('/pipeline/pipelines', pars);
export const OrgPipelineList = pars => Post('/pipeline/org/pipelines', pars);
export const NewPipeline = pars => Post('/pipeline/new', pars);
export const PipelineInfo = pars => Post('/pipeline/info', pars);
export const SavePipeline = pars => Post('/pipeline/save', pars);
export const RunPipeline = pars => Post('/pipeline/run', pars);
export const PipelineVersions = pars => Post('/pipeline/pipelineVersions', pars);
export const PipelineVersion = (id) => Post('/pipeline/pipelineVersion', { id });

//Runtime
export const RuntimeStages = (pvId) => Post('/runtime/stages', { pvId });
export const RuntimeCmds = (stepId) => Post('/runtime/cmds', { stepId });
export const RuntimeBuild = (buildId) => Post('/runtime/build', { buildId });
export const RuntimeLogs = (stepId, offset) => Post('/runtime/logs', { stepId, offset });