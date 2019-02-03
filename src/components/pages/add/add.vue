<template>
    <el-card>
        <!-- 面包屑导航 -->
        <mybread class="mybread" firstnav="商品管理" lastnav="商品列表"/>
        <!-- 警告框 -->
        <el-alert title="消息提示的文案" type="info" center show-icon> </el-alert>
        <!-- 步骤条 -->
        <el-steps class="steps" :active="active" finish-status="success" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
        </el-steps>
        <!-- tab切换 -->
        <el-tabs @tab-click="tabClick" class="left" tab-position="left">
            <el-tab-pane label="基本信息">
                <el-form label-position="top" label-width="80px" :model="goodsObj">
                    <el-form-item label="商品名称">
                        <el-input v-model="goodsObj.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格">
                        <el-input v-model="goodsObj.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量">
                        <el-input v-model="goodsObj.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量">
                        <el-input v-model="goodsObj.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类">
                        <el-cascader expand-trigger="hover" :props="props"  :options="cateList" v-model="selectCate">
                        </el-cascader>
                        {{ selectCate }}
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="商品参数">
                <div v-for="item in manyParamsList" :key ="item.attr_id">
                    <p>{{ item.attr_name }}</p>
                    <el-checkbox v-for="(item1, index) in item.attr_vals.split(',')" :key="index" v-model="checked" :label="item1" border></el-checkbox>
                </div>
            </el-tab-pane>
            <el-tab-pane label="商品属性">
                <div v-for="item in onlyParamsList" :key ="item.attr_id">
                    <p>{{ item.attr_name }}</p>
                    <input class="ips" type="text" :value="item.attr_vals">
                </div>
            </el-tab-pane>
            <el-tab-pane label="商品图片">
                <!-- 
                    on-success	文件上传成功时的钩子	function(response, file, fileList)
                    on-preview	点击文件列表中已上传的文件时的钩子
                    on-remove	文件列表移除文件时的钩子
                    file-list	上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}
                    list-type	文件列表的类型  text/picture/picture-card 
                -->
                <el-upload
                    class="upload-demo"
                    action="http://localhost:8888/api/private/v1/upload"
                    :headers="headers"
                    :on-success="uploadSuccess"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容">商品内容</el-tab-pane>
        </el-tabs>
        <!-- 预览图片 -->
        <el-dialog title="图片预览" :visible.sync="previewDialog">
            <img class="myimg" ref="myImg" src="#" />
        </el-dialog>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            // 步骤条完成激活
            active: 0,
            // 商品基本信息
            goodsObj: {
                goods_name: '',
                goods_cat: '',
                goods_price: '',
                goods_number: '',
                goods_weight: '',
                goods_introduce: '',
                pics: [],
            },
            // 属性设置
            props: {
                // 绑定的value
                value: 'cat_id',
                // 显示的文本
                label: 'cat_name',
                // 指定子元素
                children: 'children'
            },
            // 商品分类列表
            cateList: [],
            // 已选的商品分类列表
            selectCate: [],
            // 商品动态参数列表
            manyParamsList: [],
            // 商品静态参数列表
            onlyParamsList: [],
            // 被选中显示
            checked: true,
            // 设置的请求头
            headers: {
                'Authorization': window.localStorage.getItem('token')
            },
            // 图片预览对话框
            previewDialog: false,
        }
    },
    methods: {
        // 获取商品分类列表
        async getCategoriesList() {
            var res = await this.$http.request({
                url: '/categories',
                method: 'get',
                data: {
                    type: 3
                }
            })
            var {meta, data} = res.data
            if (meta.status === 200) {
                this.cateList = data
            } else {
                this.$message.error(meta.msg)
            }
        },
        // tab 被选中时触发
        tabClick(ev) {
            this.active = Number(ev.index)
            if (ev.index === '1') {
                this.getParams('many')
            } 
            if (ev.index === '2') {
                this.getParams('only')
            }
        },
        // 获取动态参数
        async getParams(sel) {
            if (this.selectCate.length != 0) {
                var id = this.selectCate[this.selectCate.length - 1]
                var res = await this.$http.get(`/categories/${id}/attributes?sel=${sel}`)
                var {meta, data} = res.data
                if(meta.status === 200) {
                    if (sel === 'many') {
                        this.manyParamsList = data
                    } else {
                        this.onlyParamsList = data
                    }
                } else {
                    this.$message.error(meta.msg)
                }
            } else {
                this.$message.error('参数不能为空')
            }
        },
        // 文件上传成功时的钩子函数
            // response:服务器响应回来的数据
            //  data
            //      tmp_path：临时目录
            //      url：网络地址
            // file: 图片相关信息
            // fileList: 图片上传集合
        uploadSuccess(response, file, fileList) {
            // console.log(file)
            // console.log(fileList)
            // console.log(response)
            var {meta, data} = response
            console.log(data)
                // tmp_path: "tmp_uploads\29413f6859aa88f9ccbbb1898dff1b8e.JPG"
                // url: "http://127.0.0.1:8888/tmp_uploads\29413f6859aa88f9ccbbb1898dff1b8e.JPG"
            if(meta.status === 200) {
                this.$message({
                    message: meta.msg,
                    type: 'success'
                })
                this.goodsObj.pics.push = data.tmp_path
                console.log(this.goodsObj.pics)
            } else {
                this.$message.error(meta.msg)
            }
        },
        // 点击文件列表中已上传的文件时的钩子
        handlePreview() {
            this.previewDialog = true
            this.$refs.myImg.src = this.goodsObj.pics.tmp_path
        },
        // 文件列表移除文件时的钩子
        handleRemove() {

        },
        // 添加商品
        async addGoods() {
            var res = await this.$http.request({
                url: '/goods',
                method: 'post',
                data: {
                    ...this.goodsObj
                }
            })
            var {meta, data} = res.data
            if (meta.status === 201) {
                this.$router.push('/goods')
            } else {
                this.$message.error(meta.msg)
            }
        },

        
    },
    mounted() {
        this.getCategoriesList()
    }
}
</script>

<style>
.mybread {
    margin-bottom: 15px;
}
.steps {
    margin: 15px 0;
}
.el-step__title {
    font-size: 12px;
}
.left {
    padding-right: 20px;
}
p {
    margin: 15px 0;
}
.el-checkbox {
    margin-bottom: 10px;
}
.ips {
    padding-left: 10px;
    width: 98%; 
    height: 34px;
}
.myimg {
    width: 100%;
}
</style>
