<template>
    <el-card>
        <!-- 面包屑导航 -->
        <mybread firstnav="权限管理" lastnav="角色列表"/>
        <!-- 添加按钮 -->
        <el-button class="addBtn" plain>添加角色</el-button>
        <!-- 表格信息 -->
        <el-table v-loading="loading" :data="rolesList" border style="width: 100%">
            <el-table-column type="expand">
                <!-- 动态渲染的权限标签结构 -->
                 <template slot-scope="scope">
                    <el-row v-for="item in scope.row.children" :key="item.id">
                        <el-col :span="5">
                            <el-tag @close="deleteTag(scope.row.id, item.id, scope.row)" closable>{{item.authName}}-{{item.id}}</el-tag><i class="el-icon-arrow-right"></i>   
                        </el-col> 
                        <el-col :span="19">
                            <el-row v-for="item1 in item.children" :key="item1.id">
                                <el-col :span="6">
                                    <el-tag @close="deleteTag(scope.row.id, item1.id, scope.row)" closable type="success">{{item1.authName}}-{{item1.id}}</el-tag><i class="el-icon-arrow-right"></i>  
                                </el-col> 
                                <el-col :span="18">
                                    <el-tag @close="deleteTag(scope.row.id, item2.id, scope.row)" v-for="item2 in item1.children" :key="item2.id" closable type="warning">{{item2.authName}}-{{item2.id}}</el-tag>     
                                </el-col> 
                            </el-row>
                        </el-col> 
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
            <el-table-column label="操作">
                 <template slot-scope="scope">
                    &nbsp;{{scope.row.id}}
                    <el-button
                        type="primary" 
                        icon="el-icon-edit" 
                        plain size="mini">
                    </el-button>
                    <el-button 
                        type="danger" 
                        icon="el-icon-delete" 
                        plain size="mini">
                    </el-button>
                    <el-button
                        @click="setTree(scope.row.children, scope.row.id)" 
                        type="success" 
                        icon="el-icon-check" 
                        plain size="mini">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
         <!-- 添加用户的对话面板 -->
        <el-dialog title="分配权限" :visible.sync="treeVisible">
            <el-tree
                ref="mytree"
                :data="rightsList" 
                node-key="id"
                :props="props" 
                :default-expand-all="true"
                :default-checked-keys="defaultCheck"
                show-checkbox>
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="treeVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateRights">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            loading: true,
            // 角色列表
            rolesList: [],
            // 权限列表
            rightsList: [],
            // 权限树状图对话面板
            treeVisible: false,
            //配置项
            props: {
                // 指定节点标签为节点对象的某个属性值
                label: 'authName',
                // 指定子树为节点对象的某个属性值
                children: 'children'
            },
            defaultCheck: [],
            // 角色id
            roleId: ''
        }
    },
    methods: {
        // 动态渲染角色信息
        async getRolesList() {
            var res = await this.$http.request({
                url: '/roles',
                method: 'get'
            })
            var {meta, data} = res.data
            if (meta.status === 200) {
                this.rolesList = data
                this.loading = false
            } else {
                this.$message.error(meta.msg)
            }
        },
        // 删除角色的某些权限
        async deleteTag(roleId, rightId, dataList) {
            var res = await this.$http.request({
                url: `/roles/${roleId}/rights/${rightId}`,
                method: 'delete'
            })
            var {meta, data} = res.data
            if (meta.status === 200) {
                this.$message({
                    message: meta.msg,
                    type: 'success'
                })
                // 更新数据源
                dataList.children = data
            } else {
                this.$message.error(meta.msg)
            }
            
        },
        // 获取权限数据
        async getRightsList() {
            var res = await this.$http.request({
                url: '/rights/tree',
                method: 'get'
            })
            var {meta, data} = res.data
            if(meta.status === 200) {
                this.rightsList = data
            } else {
                this.$message.error('信息获取失败 ！')
            }
        },
        // 显示权限设置面板
        setTree(rights, id) {
            // 设置角色id
            this.roleId = id
            // 设置默认勾选的数组(三级)
            this.defaultCheck = []
            // 显示树状面板
            this.treeVisible = true
            // 得到所有数据
            this.getRightsList()
            // 得到所有的id
            rights.forEach(item => {
                item.children.forEach(item1 => {
                    item1.children.forEach(item2 => {
                        this.defaultCheck.push(item2.id)
                    })
                })
            })
        },
        // 修改权限设置
        async updateRights() {
            // 返回目前被选中的节点的 key 所组成的数组
            // 接收一个 boolean 类型的参数，若为 true 则仅返回被选中的叶子节点的 keys，默认值为 false
            var allList = this.$refs.mytree.getCheckedKeys()
            // console.log(allList)
            // 返回目前半选中的节点的 key 所组成的数组
            var halfList = this.$refs.mytree.getHalfCheckedKeys()
            // console.log(halfList)
            var rids = halfList.concat(allList).join(',')
            var res = await this.$http.request({
                url: `roles/${this.roleId}./rights`,
                method: 'post',
                data: {
                    rids: rids
                }
            })
            var {meta} = res.data
            if(meta.status === 200) {
                this.$message({
                    message: '设置权限成功 ！',
                    type: 'success'
                })
                this.treeVisible = false
                this.getRolesList()
            } else {
                this.$message.error('设置失败 ！')
            }
        },       
    },
    mounted() {
        this.getRolesList()
    }
}
</script>

<style>
.addBtn {
    margin: 15px 0;
}
.el-tag {
    margin-right: 10px; 
    margin-bottom: 10px; 
}
</style>
