<template>
    <el-card>
        <!-- 面包屑导航 -->
        <mybread firstnav="权限管理" lastnav="权限列表"/>
        <!-- 表格 -->
         <el-table class="tables" v-loading="loading" :data="rightsList" border style="width: 100%">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="authName" label="权限"></el-table-column>
            <el-table-column prop="path" label="路径"></el-table-column>
            <el-table-column prop="level" label="层级">
                <template slot-scope="scope">
                    <!-- {{scope.row.level}} -->
                    <span v-if="scope.row.level === '0'">一级</span>
                    <span v-else-if="scope.row.level === '1'">二级</span>
                    <span v-else>三级</span>
                </template>                
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            loading: true,
            rightsList:[]
        }
    },
    methods: {
        // 获取权限列表
        async getRightsList() {
            var res = await this.$http.request({
                url: '/rights/list',
                method: 'get'
            })
            var {meta, data} = res.data
            if (meta.status === 200) {
                this.rightsList = data
                this.loading = false
            } else {
                this.$message('权限列表获取失败 ！')
            }
        }
    },
    mounted() {
        this.getRightsList()
    }
}
</script>

<style>
.tables{
    margin-top: 15px;
}
</style>
