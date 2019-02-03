import Vue from 'vue'
import App from './App'

import router from './router'
// import '@/router/index.js'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/common.css'

// 导入自己封装的axios组件
import myaxios from '@/assets/js/myaxios.js'
// 导入自己封装的bread组件
import Bread from '@/layout/bread.vue'

// Vue使用导入的组件
Vue.use(ElementUI)
Vue.use(myaxios)

// 挂载全局组件mybread
Vue.component('mybread', Bread)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
