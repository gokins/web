import {Post} from '@/assets/js/api';

export const Login = (name, pass) => Post('/lg/login', { name: name, pass: pass });

//Org
export const OrgNew = pars => {
    console.log('what',Post)
    return Post('/org/new', pars)};