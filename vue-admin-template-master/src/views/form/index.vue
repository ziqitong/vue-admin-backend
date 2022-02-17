<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item 
        label="Product name"
        prop="name">
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item label="Instant delivery">
        <el-switch v-model="form.delivery" />
      </el-form-item>

      <el-form-item 
        label="Vendor"  prop="vendor">
        <el-input v-model="form.vendor" />
      </el-form-item>

      <el-form-item label="Status" prop="status">
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
          :file-list="fileList"
          > 
          <!-- :on-change="handleUploadSuccess" -->
          <!-- :before-upload="beforeAvatarUpload" -->
          <!-- :on-success="handleUploadSuccess" -->
          <!-- :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove" -->

          <!-- :auto-upload="false" -->


          <!-- :before-upload="beforeAvatarUpload"
          :on-success="handleUploadSuccess"
          :file-list="fileList" -->
          
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
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">{{isCreate}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import {database} from "../../db.js"
import { ref, set,push } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';

export default {
  data() {
    return {
      form: {
        name: '',
        vendor: '',
        delivery: false,
        status: '',
        desc: '',
        // imgBase64:''
      },
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      fileList:[],
      imgBase64:'',
      isCreate:"Create",

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
        }
    }
  },

  methods: {
    onSubmit() {
      var that = this;
      this.$message('submiting...')
      let id = uuidv4()
      push(ref(database, 'product/'), {
          name: that.form.name,
          vendor: that.form.vendor,
          delivery: that.form.delivery,
          status: that.form.status,
          desc: that.form.desc,
          id:id,
          imgaeList:that.fileList,
          imgBse:that.imgBase64

      }).then(()=>{
        that.$message("submit success!!")
        this.$router.push({path: '/product/product', replace: true})
      }).catch((err)=>{
        that.$message("submit failed...")
      });
    },

    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.onSubmit()
        } else {
          return false;
        }
      });
    },

    // beforeAvatarUpload(file) {
    //     const isJPG = file.type === 'image/jpeg';
    //     const isLt2M = file.size / 1024 / 1024 < 2;

    //     if (!isJPG) {
    //       this.$message.error('上传头像图片只能是 JPG 格式!');
    //     }
    //     if (!isLt2M) {
    //       this.$message.error('上传头像图片大小不能超过 2MB!');
    //     }
    //     return isJPG && isLt2M;
    // },

    handleRemove(file,fileList) {
      const IMG = file.name
      const index = fileList.indexOf(IMG)
      this.fileList.splice(index, 1)
      // console.log(this.fileList)
      // console.log(file)

    },

    handlePictureCardPreview(file) {
      console.log(file)
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    // handleAvatarSuccess(res, file) {
    //   var that =this;
    //       var imgStr = '';
    //       this.getBase64(res.raw).then(resp=>{
    //         imgStr = resp
    //         that.imgBase64 = resp
    //         // console.log(imgStr)
    //         that.fileList.push({
    //           name:res.name,
    //           imageBase:imgStr,
    //           url:res.url})
    //   })
      
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

  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

