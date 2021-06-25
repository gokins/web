import axios from 'axios';
import comm from '@/assets/comm'

const serv = axios.create({
    baseURL: comm.ApiUrl, // api base_url
    // baseURL: 'http://localhost:8082', // api base_url
    // timeout: 5000, // 请求超时时间
    withCredentials: true
});

export default serv.post