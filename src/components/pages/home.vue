<template>
    <el-container>
        <el-header>
            <!-- 头部 -->
            <Top />
        </el-header>
        <el-container>
            <el-aside width="200px">
                <!-- 侧边栏 -->
                <SideBar />
            </el-aside>
            <el-main>
                <!-- 视图容器 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
// 导入头部组件
import Top from '@/layout/top.vue'
// 导入侧边栏组件
import SideBar from '@/layout/aside.vue'

export default {
    components: {
        Top,
        SideBar
    },
    // 判断是否登录，携带token令牌
    // beforeCreate() {
    //     // console.log()
    //     var token = window.localStorage.getItem('token')
    //     if(!token) {
    //         this.$message.error('请您先登录 ')
    //         this.$router.push('/login')
    //         return
    //     }
    // }
}
</script>

<style>
.el-container {
    width: 100%;
    height: 100%;
}
.el-header {
    height: 100%;
    padding: 0;
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
} 
.el-aside {
    height: 100%;
    background-color: #D3DCE6;
    color: #333;
}
.el-main {
    background-color: #E9EEF3;
    color: #333;
}
</style>
