import post from '@/assets/js/api.js';

export const Login = (name, pass) => post('/lg/login', { name: name, pass: pass });