import Vue from 'vue'
import Confirm from './confirm.vue'

const confirm = function (content, conf, yes, no) {
    let options = {}
    if (typeof content === 'string') {
        options.content = content
    } else if (typeof content === 'object') {
        options.content = toString(content)
    }

    if (typeof conf === 'object') {
        options.conf = conf
    }
    if (typeof yes === 'function') {
        options.yes = yes
    }
    if (typeof no === 'function') {
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