<template>
    <div>
        <el-menu
            class="el-menu-vertical-demo"
            text-color="#fff"
            active-text-color="#ffd04b"
            background-color="#545c64"
            :default-active="path"
            :unique-opened="true"
            :router="true">
            <el-submenu v-for="item in userInfo" :key="item.id" :index="item.path">
                
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>{{item.authName}}</span>
                </template>
                <el-menu-item v-for="item1 in item.children" :key="item1.id" :index="'/' + item1.path" class="el-icon-star-off">{{item1.authName}}</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
export default {
    data() {
        return {
            userInfo: []
        }
    },
    computed: {
        path: function() {
            // console.log(this.$route)
            // console.log(this.$router)
            return this.$route.path
        }
    },
    methods: {
        // 获取登录的用户的信息
        async getUserInfo() {
            var res = await this.$http.request({
                url: '/menus',
                method: 'get',
                headers: {
                    'Authorization': window.localStorage.getItem('token')
                }
            })
            var {meta, data} = res.data
            // console.log(data) // 数组
            if(meta.status === 200) {
                this.userInfo = data
            }
        }
    },
    mounted() {
        this.getUserInfo()
    }
}
</script>

<style>
.el-menu-item-group__title {
    padding: 0;
}
.el-submenu {
    overflow: hidden;
}
</style>
