<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item 
        label="Product name"
        :rules="[
          { required: true, message: 'Please fill product name!'},
        ]">
        <el-input v-model="form.name" />
      </el-form-item>
      <!-- <el-form-item label="Activity zone">
        <el-select v-model="form.region" placeholder="please select your zone">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="Activity time">
        <el-col :span="11">
          <el-date-picker v-model="form.date1" type="date" placeholder="Pick a date" style="width: 100%;" />
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-time-picker v-model="form.date2" type="fixed-time" placeholder="Pick a time" style="width: 100%;" />
        </el-col>
      </el-form-item> -->
      <el-form-item label="Instant delivery">
        <el-switch v-model="form.delivery" />
      </el-form-item>

      <el-form-item 
        label="Product vendor">
        <el-input v-model="form.vendor" />
      </el-form-item>

      <!-- <el-form-item label="Activity type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="Online activities" name="type" />
          <el-checkbox label="Promotion activities" name="type" />
          <el-checkbox label="Offline activities" name="type" />
          <el-checkbox label="Simple brand exposure" name="type" />
        </el-checkbox-group>
      </el-form-item> -->
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
            <!-- <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
            >
              <i class="el-icon-download"></i>
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
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>


        <!-- <el-upload
          action="#"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog> -->
         

      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{isCreate}}</el-button>
        <!-- <el-button @click="onCancel">Cancel</el-button> -->
      </el-form-item>
    </el-form>

    <!-- <img :src="imgBase64"/> -->
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
      isCreate:"Create"
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
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
     handleRemove(file,fileList) {
        const IMG = file.name
        const index = fileList.indexOf(IMG)
        this.fileList.splice(index, 1)
        // console.log(this.fileList)
        // console.log(file)

      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
    
      handleUploadSuccess (res, file, fileList) {
        // console.log(res.url)
        // console.log(res)
        var that =this;
        var imgStr = '';
        this.getBase64(res.raw).then(resp=>{
          imgStr = resp
          that.imgBase64 = resp
          // console.log(imgStr)
          that.fileList.push({
            name:res.name,
            imageBase:imgStr,
            url:res.url})
        })
        
        //  that.fileList.push({
        //     name:res.name,
        //     // imageBase:imgStr,
        //     url:res.url})
        
          // console.log(this.fileList)
        // console.log(this.fileList)
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

