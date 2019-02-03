<template>
    <div>
        <el-row>
            <el-col :span="6">
                <div class="grid-content bg-purple h-logo">
                    <img src="../assets/images/logo.png" alt="">
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple-light h-title">
                    <h1>电商后台管理系统</h1>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple h-logout">
                    <a href="#" @click.prevent="logout()">退出</a>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    methods: {
        logout() {
            this.$confirm('您将退出登录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                this.$message({
                    type: 'success',
                    message: '退出成功!'
                });
                window.localStorage.removeItem('token')
                this.$router.push('/login')          
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消退出'
                });
            });
        }
    }
}
</script>

<style>
.h-title h1 {
    color: #fff;
    font-weight: 400;
    text-align: center;
}
.h-logout  {
    margin-right: 10px;
    text-align: right;
}
.h-logout a {
    color: #fff;
    text-decoration: none;
}
</style>
