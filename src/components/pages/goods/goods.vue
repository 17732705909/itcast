<template>
    <el-card>
        <!-- 面包屑导航 -->
        <mybread class="mybread" firstnav="商品管理" lastnav="商品列表"/>
        <!-- 搜索框 -->
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
                    <el-button type="success" plain @click="addGoods">添加商品</el-button>
                </div>
            </el-col>
        </el-row>
        <!-- 表格部分 -->
        <el-table v-loading="loading" :data="goodsList" border style="width: 100%">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="goods_name" label="商品名称"></el-table-column>
            <el-table-column prop="goods_price" label="商品价格"></el-table-column>
            <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
            <el-table-column prop="upd_time" label="创建时间"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    &nbsp; {{scope.row.id}}
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
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页部分 -->
        <div class="block">
            <el-pagination
                @size-change="sizeChange"
                @current-change="currentChange"
                :current-page="pagenum"
                :page-sizes="[10, 20]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>    
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
            pagesize: 10,
            // 总条数
            total: 0,
            // 商品列表
            goodsList:[],
        }
    },
    methods: {
        // 获取商品信息，渲染页面
        async getGoodsInfo() {
            var res = await this.$http.request({
                url: '/goods',
                method: 'get',
                params: {
                    query: this.search,
                    pagenum: this.pagenum,
                    pagesize: this.pagesize
                }
            })
            var {meta, data} = res.data
            if(meta.status === 200) {
                this.total = data.total
                this.goodsList = data.goods
                this.loading = false
            } else {
                this.$message.error(meta.msg)
            }
        },
        // 每页的条数 pageSize 改变时会触发
        sizeChange(size) {
            this.pagesize = size
            this.getGoodsInfo() 
        },
        // 当前页 currentPage 改变时会触发
        currentChange(num) {
            this.pagenum = num
            this.getGoodsInfo() 
        },
        // 点击搜索，发送请求，重新渲染数据
        serachList() {
            this.getGoodsInfo()
        },
        // 添加商品
        addGoods(){
            this.$router.push('/goods/add')
        },
    },
    mounted() {
        this.getGoodsInfo()
    }
}
</script>

<style>
.mybread, .search {
    margin-bottom: 15px;
}
.block {
    margin-top: 20px;
}
</style>
