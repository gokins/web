import Vue from 'vue'
import Message from './message.vue'

const msgFun=function (content, type, time) {
    let options = {}
    if (typeof content === 'string') {
        options.content = content
    } else if (typeof content === 'object') {
        options.content = toString(content)
    }

    if (typeof type == 'string') {
        options.type = type
    }
    if (typeof time == 'number') {
        options.dismissCountDown = time
    }
    var message = Vue.extend(Message)
    var component = new message({
        data: options
    }).$mount()
    document.body.appendChild(component.$el)
};

export default {
    install(Vue) {
        Vue.component(Message.name, Message);

        Vue.prototype.$message = msgFun;
        Vue.prototype.$msgOk = (cont)=>msgFun(cont,'success');
        Vue.prototype.$msgErr = (cont)=>msgFun(cont,'danger');
    }
}