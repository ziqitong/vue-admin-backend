<template>
  <div>
        <el-header style="display: flex;justify-content: space-between;">
            <span style="font-size: 40px ;padding-top:10px">Product</span> 
            <el-button type="primary" @click="onAddData">Add new Product</el-button>
        </el-header>

        <div class = "searchTable">
            <el-card class="box-card" style="width: 100%">
                <!-- <div class ="el-card__body"> -->
                <div slot="header" class="clearfix">
                <span>筛选搜索</span>
                <!-- <el-button style="float: right; padding: 3px 0"  type="primary" @click="searchProduct">查找</el-button> -->
                    <div class="buttonContainer">
                        
                    <el-button
                        size="mini"
                        @click="clearSearch">重置
                    </el-button>

                    <el-button
                        size="mini"
                        type ="primary"
                        @click="searchProduct">查找
                    </el-button>
                    </div>

                </div>
                <p>商品名称</p>
                <el-input lable ="商品名称" v-model="keyword" placeholder="请输入内容"></el-input>
            </el-card>
        </div>
        
      
      <div class = "productTable">
        <el-table
            :data="productList"
            height="100vh"
            border
            style="width: 100%"
           >
             <el-table-column
            prop="name"
            label="Product Name"
            width="250"
            align="center">
            </el-table-column>
            <el-table-column
            prop="imgBse"
            label="Product Pic"
            width="300"
            align="center">
                <template slot-scope="scope">
                    <img :src="scope.row.imgBse" style="height: 100px; width:100px; object-fit:cover;"/>
                </template>
            </el-table-column>
            <el-table-column
            prop="vendor"
            label="Vendor"
            width="250"
            align="center">
            </el-table-column>
           
            <el-table-column
            prop="status"
            label="Status"
            align="center">
            </el-table-column>

            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                     <el-button
                    size="mini"
                    @click="handleView(scope.$index, scope.row)">查看</el-button>

                    <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-popconfirm
                        title="确定删除吗？"
                        @onConfirm="handleDelete(scope.$index, scope.row)">
                        <el-button 
                            slot="reference" 
                            size="mini"
                            type="danger"
                            style="margin-left:10px">删除
                        </el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        </div>
     <!-- </el-container> -->

    <el-dialog title="Edit Product" :visible.sync="dialogFormVisible">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item 
        label="Product name"
        :rules="[
          { required: true, message: 'Please fill product name!'},
        ]">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Instant delivery">
        <el-switch v-model="form.delivery" />
      </el-form-item>

      <el-form-item 
        label="Product vendor">
        <el-input v-model="form.vendor" />
      </el-form-item>
      <el-form-item label="Status">
        <el-radio-group v-model="form.status">
          <el-radio label="Draft" />
          <el-radio label="Active" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Descroption">
        <el-input v-model="form.desc" 
        type="textarea" 
        maxlength="500"
        show-word-limit />
      </el-form-item>

      <el-form-item label="Product Image">
          <el-upload
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          :on-change="handleUploadSuccess"
          :file-list="fileList">
          
        <i slot="default" class="el-icon-plus"></i>
        <div slot="file" slot-scope="{file}">
          <img
            class="el-upload-list__item-thumbnail"
            :src="file.imageBase" alt=""
          >
           <span class="el-upload-list__item-actions">
            <!-- <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
            >
              <i class="el-icon-zoom-in"></i>
            </span> -->

            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file,fileList)"
            >
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
        </el-upload>

        <!-- 查看大图 -->
         <!-- <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog> -->

      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="writeUserData">确 定</el-button> 
    </div>
    </el-dialog>


  </div>
</template>

<script>
import Link from '../../layout/components/Sidebar/Link.vue'
import {database} from "../../db.js"
import { ref, get,child,update,remove } from "firebase/database";

export default {
  components: { Link },
     name:"Product",
    data(){
        return {
            productList:[],
            listCopy:[],
            dialogFormVisible: false,
            form: {
                name: '',
                vendor: '',
                delivery: false,
                status: '',
                desc: '',
            },
            fileList:[],
            dialogImageUrl: '',
            dialogVisible:false,
            key:'',
            disabled: false,
            imgBase64:'',
            rules: {
                name: [
                    { required: true, message: '请输入产品名称', trigger: 'blur' }
                ],
                vendor: [
                    { required: true, message: '请选择产品供应商', trigger: 'blur' }
                ],
                status: [
                    { required: true, message: '请选择产品状态', trigger: 'change' }
                ],
            },
            keyword:'',
            productCopy:'',
        }
            
    },
    mounted() {
        var that = this;
        const dbRef = ref(database);
        get(child(dbRef, `product/`)).then((snapshot) => {
            if (snapshot.exists()) {
                this.productList = this.snapshotToArray(snapshot)
                console.log(this.productList)
                this.productCopy = JSON.parse(JSON.stringify(this.productList));
            } else {
                console.log("No data available");
            }
            }).catch((error) => {
                console.error(error);
            });
    },
   
    methods: {
        snapshotToArray(snapshot) {
            var returnArr = [];
            snapshot.forEach(function(childSnapshot) {
                var item = childSnapshot.val();
                item.key = childSnapshot.key;
                // console.log(item.key) //某一项的key
                returnArr.push(item);
            });

            return returnArr;
        },

        writeUserData() {
            var that = this;
            const dbRef = ref(database);
            update(child(dbRef, `product/`+that.key),{ 
                name: that.form.name,
                vendor: that.form.vendor,
                delivery: that.form.delivery,
                status: that.form.status,
                desc: that.form.desc,
                imgaeList:that.fileList,
                imgBse:that.fileList[0].imageBase
            }).then(()=>{
               that.dialogFormVisible=false
               that.$message("Updated!!")
            //    this.reload;
                location.reload();
            })
        },
        submitForm(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                this.writeUserData()
                } else {
                return false;
                }
            });
        },
        handleEdit(index, row) {
            console.log(index, row);
            this.dialogFormVisible=true;
            this.form = row
            if(row.imgaeList){
                this.fileList=row.imgaeList
            }
            this.key = row.key;
        },
        handleView(index,row){
            console.log(index)
            console.log(row)

            // let parObj = JSON.stringify(row) 
            // this.$router.push({
            //     name:'viewPage',
            //     //携带参数时用query，跳转后，url上会拼接参数，刷新页面后参数不会丢失，依然是那个带参数的ur
            //     query:{
            //         'obj':parObj
            //     }
            // })

            //改进：只携带key，去数据库里fetch
            this.$router.push({
                name:'viewPage',
                //携带参数时用query，跳转后，url上会拼接参数，刷新页面后参数不会丢失，依然是那个带参数的ur
                query:{
                    key:row.key
                }
            })
        },

        handleDelete(index, row) {
            // console.log(index, row);
            const dbRef = ref(database);
            remove(child(dbRef, `product/`+row.key)).then(()=>{
                location.reload();
            })
            
        },
        
        handleRemove(file,fileList) {
            const IMG = file.name
            const index = fileList.indexOf(IMG)
            this.fileList.splice(index, 1)
            // console.log(this.fileList)
            // console.log(file)

        },

        // handlePictureCardPreview(file) {
        //     this.dialogImageUrl = file.url;
        //     this.dialogVisible = true;
        // },
        
        handleUploadSuccess (file, fileList) {
           if(file.raw.type!=='image/jpeg' && file.raw.type!=='image/png'){
                this.$message.error('上传头像图片只能是 JPG 格式!');
                // console.log(fileList)
                fileList.splice(-1,1);
                return false;         
            }
            if(!(file.size / 1024 / 1024 < 2)){
                this.$message.error('上传头像图片大小不能超过 2MB!');
                fileList.splice(-1,1);
                return false;
            }
            else{
                var that =this;
                var imgStr = '';
                this.getBase64(file.raw).then(resp=>{
                    imgStr = resp
                    that.imgBase64 = resp
                    // console.log(imgStr)
                    that.fileList.push({
                    name:file.name,
                    imageBase:imgStr,
                    url:file.url})
                })
                console.log(that.fileList)
                }
            },
        getBase64(file){  //把图片转成base64编码
            return new Promise(function(resolve,reject){
                let reader=new FileReader();
                let imgResult="";
                reader.readAsDataURL(file);
                reader.onload=function(){
                    imgResult=reader.result;
                };
                reader.onerror=function(error){
                    reject(error);
                };
                reader.onloadend=function(){
                    resolve(imgResult);
                }
            })
        },
        onAddData(){
            // console.log(this)
            this.$router.push({path: '/form/index'})
        },

        searchProduct(){
            if(this.keyword){
                this.productList = this.productCopy;
                var copy = this.productList.filter(el => el.name.indexOf(this.keyword)!==-1);
                this.productList =copy;
                console.log(this.productList)
        
            }
        },
        clearSearch(){
            this.productList = this.productCopy;
            this.keyword = '';
        }
    },
}
</script>

<style>
.productTable{
    padding: 20px;
}
.searchTable{
    padding: 20px;
}
.buttonContainer{
    float: right;
    right:10;
}
</style>