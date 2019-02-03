<template>
  <div class="box">
      <div class="midBox">
            <h2>用户登录</h2>
            <!-- element-ui表单组件的引入 -->
            <el-form label-position="top" :rules="rules" :model="loginObj" status-icon ref="loginObj" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input type="text" v-model="loginObj.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="loginObj.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="myBtn" type="primary" @click="login()">登录</el-button>
                </el-form-item>
            </el-form>
      </div>
  </div>
</template>

<script>
export default {
    data(){
        return  {
            loginObj: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '用户名长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        login() {
            this.$refs.loginObj.validate(async (valid) => {
                if (valid) {
                    var res = await this.$http.post('/login', this.loginObj)
                    var { meta, data } = res.data;
                        if (meta.status === 200) {
                            // 登陆成功的提示信息
                            this.$message({
                                message: meta.msg,
                                type: 'success'
                            });
                            // 客户端接受token，并保存到localStorage中
                            window.localStorage.setItem('token', data.token)
                            // 完成登录后跳转到首页
                            this.$router.push('/home')
                        } else {
                            // 登录失败的提示信息
                            this.$message.error('登录失败');
                        }
                } else {
                    // 参数不合法，请求发送失败
                    this.$message.error('参数不合法 ！');
                    return false;
                }
            });
       }
    }
};
</script>

<style>
.box {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #212c37;
}
.midBox {
    position: absolute;
    width: 500px;
    /* height: 400px; */
    padding: 40px;
    background-color: #fff;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
}
.myBtn {
    width: 100%;
}
</style>
