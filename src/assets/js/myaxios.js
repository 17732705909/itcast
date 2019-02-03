import axios from 'axios'
// 封装为插件
var myaxios = {}
// 挂载到vue上
myaxios.install = function(Vue) {
    // 设置统一路径
    axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'
    // 设置请求拦截器
    axios.interceptors.request.use(function(config){
        // console.log(config)
        if(config.url !== '/login') {
            config.headers['Authorization'] = window.localStorage.getItem('token')
        }
        return config
    })

    // 将其挂载到vue原型中
    Vue.prototype.$http = axios
}
// 导出
export default myaxios