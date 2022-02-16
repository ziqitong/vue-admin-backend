<template>
  <div>
        <el-header style="display: flex;justify-content: space-between;">
            <span style="font-size: 40px ;padding-top:10px">Product</span> 
            <el-button type="primary" @click="onAddData">Add new Product</el-button>
        </el-header>
      
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
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <!-- <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
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
    <el-form ref="form" :model="form" label-width="120px">
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
            <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
            >
              <i class="el-icon-zoom-in"></i>
            </span>
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
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
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
            }
    },
    mounted() {
        var that = this;
        const dbRef = ref(database);
        get(child(dbRef, `product/`)).then((snapshot) => {
            if (snapshot.exists()) {
                this.productList = this.snapshotToArray(snapshot)
                console.log(this.productList)
            } else {
                console.log("No data available");
            }
            }).catch((error) => {
                console.error(error);
            });
        // database.ref('/').on('value',e => {
        //     console.log(e.val());
        // });
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
      
        handleEdit(index, row) {
            // console.log(index, row);
            this.dialogFormVisible=true;
            this.form = row
            this.fileList=row.imgaeList
            this.key = row.key;
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
        },
        handlePictureCardPreview(file) {
            console.log(file)
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        
        handleUploadSuccess (res, file, fileList) {
            var that =this;
            var imgStr = '';
            this.getBase64(res.raw).then(resp=>{
            imgStr = resp
            that.imgBase64 = resp
            
            that.fileList.push({
                name:res.name,
                imageBase:imgStr,
                url:res.url})
            })
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
    },
}
</script>

<style>
.productTable{
    padding: 20px;
}
</style>