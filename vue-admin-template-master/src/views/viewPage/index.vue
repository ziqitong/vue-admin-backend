<template>
   <div>
        <el-row :gutter="20">
            <el-col :span="12" style="height:60vh">
                <div class="grid-content bg-purple">

                    <div class="block">
                        <el-carousel trigger="click" height="60vh" indicator-position="outside">
                        <el-carousel-item v-for="(item, index) in pageData.imgaeList" :key="index">
                             <img :src="item.imageBase">
                        </el-carousel-item>
                        </el-carousel>
                    </div>
                </div>
            </el-col>

           
            <el-col :span="12" style="height:60vh; ">
                <div class="grid-content bg-purple">
                    <div class="content">
                        商品名称: {{pageData.name}} <br/>
                        供应商: {{pageData.vendor}} <br/>
                        是否配送: {{pageData.delivery? "是": "否"}}
                        <el-button type="success">加入购物车</el-button>
                    </div>
                    
                </div>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="24">
                <div class="grid-content bg-purple-dark">
                    <p>
                        商品描述：<br/>
                        {{pageData.desc}}
                    </p>
                </div>
            </el-col>
        </el-row>
    </div>


   
</template>

<script>
export default {
    name:"viewPage",

    created() {
        this.getParams()
    },
    data(){
        return{
            pageData:null,
        }
    },
    methods: {
        getParams(){
            //解决刷新后页面参数消失：需用query把路径拼接到url，再用json parse成对象接受
            const routerParams = JSON.parse(this.$route.query.obj)
            this.pageData=routerParams
        }
    },

}
</script>

<style>

  .grid-content {
    /* border-radius: 4px; */
    height: 70vh;
     padding: 20px;
  }
  .el-row {
    margin: 20px;
    padding-left: 20vh;
    padding-right: 20vh;
  }
  .el-col {
    border-radius: 4px;
  }
  .content{
      display:flex;
      flex-direction: column;
      font-size: 36px;
      padding: 10px;
      line-height: 15vh;
      
  }

 .el-carousel__item img {
    margin: 0;
   height: 100%;
   width: 100%;
   object-fit: contain;
  }
  

   .bg-purple-dark {
    background: #eff0f1;
  }
</style>