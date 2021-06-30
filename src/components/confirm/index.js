import Vue from 'vue'
import Confirm from './confirm.vue'

const confirm = function (content, conf, yes, no) {
    let options = {}
    if (typeof content === 'string') {
        options.content = content
    } else if (typeof content === 'object') {
        options.content = toString(content)
    }

    if (typeof conf === 'object' && conf != null) {
        options.conf = conf
    }
    if (typeof yes === 'function' && yes != null) {
        options.yes = yes
    }
    if (typeof no === 'function' && no != null) {
        options.no = no
    }

    var confirm = Vue.extend(Confirm)
    var component = new confirm({
        data: options
    }).$mount()
    document.body.appendChild(component.$el)
};

export default {
    install(Vue) {
        Vue.component(Confirm.name, Confirm);
        Vue.prototype.$confirm = confirm;
    }
}