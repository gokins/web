export const getToken=()=>{
    return sessionStorage.getItem('gokinstk');
}
export const setToken=(tks)=>{
    sessionStorage.setItem('gokinstk',tks);
}
export const removeToken=()=>{
    sessionStorage.removeItem('gokinstk');
}