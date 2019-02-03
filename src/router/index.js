import Vue from 'vue'
import Router from 'vue-router'
// 导入登录组件
import Login from '@/components/login/login.vue'
// 导入home组件
import Home from '@/components/pages/home.vue'
// 导入user组件
import User from '@/components/pages/user/users.vue'
// 导入rights组件
import Rights from '@/components/pages/rights/rights.vue'
// 导入roles组件
import Roles from '@/components/pages/roles/roles.vue'
// 添加全局方法 $message
import { Message } from 'element-ui';
// 导入goods组件
import Goods from '@/components/pages/goods/goods.vue'
// 导入Add组件
import Add from '@/components/pages/add/add.vue'
// 导入Params组件
import Params from '@/components/pages/params/params.vue'
// 导入categories组件
import Categories from '@/components/pages/categories/categories.vue'


Vue.use(Router)


const router = new Router({
  routes: [
    // 设置home页为访问的首页
    { path: '/', redirect: '/home'},
    { name: 'login', path: '/login', component: Login },
    { name: 'home', path: '/home', component: Home, children: [
      { path: '/users', component: User },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: Add },
      { path: '/params', component: Params },
      { path: '/categories', component: Categories }
    ]},
  ],
})
console.log()
router.beforeEach((to, from, next) => {
  if(to.path !== '/login') {
    var token = window.localStorage.getItem('token')
        if(!token) {
            Message.error('请您先登录 ')
            router.push('/login')
            return
        }
  }
  // console.log(to)
  // console.log(from)
  next()
})

export default router
