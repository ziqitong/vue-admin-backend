<template>
  <div>
    <!-- <el-container> -->
      <!-- <el-header style="font-size: 44px; left:16px; padding-top:10px">
      
        <span>Product</span>
        <el-button type="primary" style="right:0px;" @click="onGetData">View all</el-button>
        </el-header> -->

        <el-header style="display: flex;justify-content: space-between;">
            <span style="font-size: 40px ;padding-top:10px">Product</span> 
            <el-button type="primary" @click="onAddData">Add new Product</el-button>
        </el-header>
      
      <!-- <el-button type="primary" @click="onGetData">View all</el-button> -->
       <!-- <el-button type="primary" @click="onAddProduct">View all</el-button> -->
      
      <div class = "productTable">
        <el-table
            :data="productList"
            height="100vh"
            border
            style="width: 100%">
             <el-table-column
            prop="name"
            label="Product Name"
            width="250">
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
            prop="resource"
            label="Vendor"
            width="250">
            </el-table-column>
           
            <el-table-column
            prop="region"
            label="Status">
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
     <!-- </el-container> -->

  </div>
</template>

<script>
import Link from '../../layout/components/Sidebar/Link.vue'
import {database} from "../../db.js"
import { ref, get,child } from "firebase/database";

export default {
  components: { Link },
     name:"Product",
    data(){
        return {
            productList:[]
        }
    },
    mounted() {
        var that = this;
        const dbRef = ref(database);
        get(child(dbRef, `product/`)).then((snapshot) => {
            if (snapshot.exists()) {
                // this.productList = snapshot.val()
                this.productList = this.snapshotToArray(snapshot)
                // console.log(this.productList)
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
                returnArr.push(item);
            });

            return returnArr;
        },
        // onGetData(){
        //     var that = this;
        //     const dbRef = ref(database);
        //     get(child(dbRef, `product/`)).then((snapshot) => {
        //         if (snapshot.exists()) {
        //             // this.productList = snapshot.val()
        //            this.productList = this.snapshotToArray(snapshot)
        //             console.log(this.productList)
        //         } else {
        //             console.log("No data available");
        //         }
        //         }).catch((error) => {
        //             console.error(error);
        //         });
        // },
        onAddData(){
            // console.log(this)
            this.$router.push({path: '/form/index'})
        },
        handleEdit(index, row) {
            console.log(index, row);
        },
        handleDelete(index, row) {
            console.log(index, row);
        }
    },
}
</script>

<style>
.productTable{
    padding: 20px;
}
</style>