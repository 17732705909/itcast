<template>
    <el-card>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索条 -->
        <el-row class="search">
            <el-col :span="8">
                <div class="grid-content bg-purple">
                    <!-- 搜索框 -->
                    <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="serachList"></el-button>
                    </el-input>
                </div>
            </el-col>
            <el-col :span="16">
                <div class="grid-content bg-purple-light">
                    &nbsp;&nbsp;&nbsp;
                    <!-- 添加按钮 -->
                    <el-button type="success" plain @click="addVisible = true">添加用户</el-button>
                </div>
            </el-col>
        </el-row>
        <!-- 表格部分 -->
        <el-table v-loading="loading" :data="userList" border style="width: 100%">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="username" label="姓名"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="mobile" label="电话"></el-table-column>
            <el-table-column label="用户状态">
                <template slot-scope="scope">
                    <el-switch 
                        @change="changeStatu(scope.row.id, scope.row.mg_state)" v-model="scope.row.mg_state" active-color="#409eff" inactive-color="#c0ccda">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    &nbsp;
                    <el-button
                        @click="openEdit(scope.row.id)" 
                        type="primary" 
                        icon="el-icon-edit" 
                        plain size="mini">
                    </el-button>
                    <el-button 
                        @click="del(scope.row.id)" 
                        type="danger" 
                        icon="el-icon-delete" 
                        plain size="mini">
                    </el-button>
                    <el-button 
                        @click="getUser(scope.row.id)"
                        type="success" 
                        icon="el-icon-check" 
                        plain size="mini">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页部分 -->
        <div class="block">
            <el-pagination
                @size-change="sizeChange"
                @current-change="currentChange"
                :current-page="pagenum"
                :page-sizes="[5, 10]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <!-- 添加用户的对话面板 -->
        <el-dialog title="用户新增" :visible.sync="addVisible">
            <el-form :model="addObj">
                <el-form-item label="用户名" label-width="100px">
                    <el-input v-model="addObj.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" label-width="100px">
                    <el-input v-model="addObj.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" label-width="100px">
                    <el-input v-model="addObj.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" label-width="100px">
                    <el-input v-model="addObj.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancleAdd">取 消</el-button>
                <el-button type="primary" @click="add">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改用户的对话面板 -->
        <el-dialog title="编辑用户" :visible.sync="editVisible">
            <el-form :model="editObj">
                <el-form-item label="用户名" label-width="100px">
                    <el-input disabled v-model="editObj.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" label-width="100px">
                    <el-input v-model="editObj.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" label-width="100px">
                    <el-input v-model="editObj.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancleEdit">取 消</el-button>
                <el-button type="primary" @click="edit(editObj.id)">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 角色设定对话面板 -->
        <el-dialog title="角色设定" :visible.sync="roleVisible">
            <el-form :model="roleObj">
                <el-form-item label="用户名" label-width="100px">
                    <el-input disabled v-model="roleObj.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色设置" label-width="100px">
                    <!-- {{ roleObj.rid }} -->
                    <el-select v-model="roleObj.rid" placeholder="请选择">
                        <el-option :disabled="true" label="请选择角色" :value="-1"></el-option>
                        <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancleRole">取 消</el-button>
                <el-button type="primary" @click="setRole()">确 定</el-button>
            </div>
        </el-dialog>
    </el-card> 
</template>

<script>
export default {
    data() {
        return {
            loading: true,
            // 搜索框的value
            search: '',
            // 当前页
            pagenum: 1,
            // 页容量
            pagesize: 5,
            // 总条数
            total: 0,
            // 用户列表
            userList: [],
            // 添加用户对话框弹出
            addVisible: false,
            // 新增用户的数据
            addObj: {},
            // 添加用户对话框弹出
            editVisible: false,
            // 编辑用户数据
            editObj: {},
            // 角色设定对话框弹出
            roleVisible: false,
            // 角色列表
            roleList: [],
            // 角色设定数据表
            roleObj: {},
        }
    },
    methods: {
        // 获取信息列表
        async getAllList() {
            var res = await this.$http.request({
                url: '/users',
                method: 'get',
                params: {
                    pagenum: this.pagenum,
                    pagesize: this.pagesize,
                    query: this.search
                }
            })
            var {meta, data} = res.data
            if(meta.status === 200) {
                this.userList = data.users
                this.total = data.total
                this.loading = false
            }
        },
        // 每页的条数 pageSize 改变时会触发
        sizeChange(size) {
            this.pagesize = size
            this.getAllList() 
        },
        // 当前页 currentPage 改变时会触发
        currentChange(num) {
            this.pagenum = num
            this.getAllList() 
        },
        // 点击搜索，发送请求，重新渲染数据
        serachList() {
            this.getAllList()
        },
        // 确认添加
        async add() {
            var res = await this.$http.request({
                url: '/users',
                method: 'post',
                data: {
                    ...this.addObj
                }
            })
            var {meta} = res.data
            if(meta.status === 201) {
                this.$message({
                    message: meta.msg,
                    type: 'success'
                })
                this.addVisible = false
                this.getAllList() 
                this.adObj = {}
            } else {
                this.$message.error(meta.msg)
                this.addVisible = false
                this.adObj = {}
            }
        },
        // 取消添加
        cancleAdd() {
            this.$message('您已取消新增操作 ！');
            this.addVisible = false
            this.adObj = {}
        },
        // 用户状态修改
        async changeStatu(uid, utype) {
            var res = await this.$http.request({
                url: `/users/${uid}/state/${utype}`,
                method: 'put'
            })
            var {meta, data} = res.data
            if(meta.status === 200) {
                this.$message({
                    message: '变更状态成功 ！',
                    type: 'success'
                })
            } else {
                this.$message.error('变更失败 ！')
            }
        },
        // 打开面板数据显示
        async openEdit(id) {
            this.editVisible = true;
            var res = await this.$http.request({
                url: `/users/${id}`,
                method: 'get'
            })
            var {meta, data} = res.data
            if(meta.status === 200) {
                this.editObj = data
            }
        },
        // 编辑用户
        async edit(id) {
            var res = await this.$http.request({
                url: `/users/${id}`,
                method: 'put',
                data: {
                    ...this.editObj
                }
            })
            var {meta} = res.data
            if(meta.status === 200) {
                this.$message({
                    message: meta.msg,
                    type: 'success'
                })
                this.editVisible = false;
                this.getAllList()
                this.editObj = {}
            } else {
                this.$message.error(meta.msg)
                this.editVisible = false;
                this.editObj = {}
            }
        },
        // 取消编辑
        cancleEdit() {
            this.$message('您已取消编辑操作 ！');
            this.editVisible = false
            this.editObj = {}
        },
        // 删除用户
        del(id) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(async () => {
                var res = await this.$http.request({
                    url: `/users/${id}`,
                    method: 'delete'
                })
                var {meta} = res.data
                if(meta.status === 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getAllList()
                }
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        // 根据id查找用户信息
        async getUser(id) {
            this.getRole()
            this.roleVisible = true
            var res = await this.$http.request({
                url: `/users/${id}`,
                method: 'get'
            })
            var {meta, data} = res.data
            if(meta.status === 200) {
                this.roleObj = data
            } else {
                this.roleVisible = false
                this.$message.error('获取用户信息失败 ！')
            }
        },
        // 渲染角色列表
        async getRole() {
            var res = await this.$http.request({
                url: '/roles',
                method: 'get'
            })
            var {meta, data} = res.data
            console.log(data)
            if(meta.status === 200) {
                this.roleList = data
            } else {
                this.roleVisible = false
                this.$message.error('获取角色信息失败 ！')
            }
        },
        // 设定角色
        async setRole() {
            var res = await this.$http.request({
                url: `users/${this.roleObj.id}/role`,
                method: 'put',
                data: {
                    rid: this.roleObj.rid
                }
            })
            var {meta} = res.data
            if (meta.status === 200) {
                this.$message({
                    message: meta.msg,
                    type: 'success'
                })
                this.roleVisible = false
                this.getAllList()
            } else {
                this.$message.error(meta.msg)
            }
        },
        // 取消设置角色
        cancleRole() {
            this.roleVisible = false
            this.$message('您已取消操作 ！')
        }
    },
    mounted() {
        this.getAllList() 
    }
}
</script>

<style>
.search {
    margin: 20px 0;
}
.block {
    margin-top: 20px;
}
</style>
