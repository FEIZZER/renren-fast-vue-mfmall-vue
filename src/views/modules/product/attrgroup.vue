<!--
 * @Author: feizzer
 * @Date: 2021-10-10 17:12:04
 * @LastEditors: feizzer
 * @LastEditTime: 2021-10-17 15:36:35
 * @Description: 
-->
<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <category @nodeClicked="changeAttrGroup"></category>
      </el-col>
      <el-col :span="16">
        <div class="mod-config">
          <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
              <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="getDataList()">查询</el-button>
              <el-button type="success" @click="getAllDataList()">查询全部</el-button>
              <el-button
                v-if="isAuth('product:attrgroup:save')"
                type="primary"
                @click="addOrUpdateHandle()"
              >新增</el-button>
              <el-button
                v-if="isAuth('product:attrgroup:delete')"
                type="danger"
                @click="deleteHandle()"
                :disabled="dataListSelections.length <= 0"
              >批量删除</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="dataList"
            v-loading="dataListLoading"
            @selection-change="selectionChangeHandle"
            border
            style="width: 100%;"
          >
            <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
            <el-table-column prop="id" header-align="center" align="center" label="自增ID"></el-table-column>
            <el-table-column prop="name" header-align="center" align="center" label="名称"></el-table-column>
            <el-table-column prop="sort" header-align="center" align="center" label="排序"></el-table-column>
            <el-table-column prop="descript" header-align="center" align="center" label="描述"></el-table-column>
            <el-table-column prop="icon" header-align="center" align="center" label="图表"></el-table-column>
            <el-table-column prop="categoryId" header-align="center" align="center" label="分类ID"></el-table-column>
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="150"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper"
          ></el-pagination>
          <!-- 弹窗, 新增 / 修改 -->
          <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Category from "../common/category.vue";
import AddOrUpdate from "./attrgroup-add-or-update";
export default {
  name: "RenrenFastVueAttrgroup",
  components: {
    AddOrUpdate,
    Category
  },

  data() {
    return {
      dataForm: {
        key: ""
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      categoryId: 0
    };
  },

  mounted() {},

  methods: {
    changeAttrGroup(data) {
      let allAttr = JSON.parse(sessionStorage.getItem("datalist"))
      let newAttr = allAttr.filter(attr => attr.categoryId == data.id)
      this.dataList = newAttr
      console.log(this.dataList)
    },
    //查询全部属性分组
    getAllDataList() {
      this.categoryId = 0;
      this.dataForm.key = "";
      // 获取数据列表
      this.getDataList();
    },
    // 获取数据列表
    getDataList() {
      if (false) {
        this.dataList = JSON.parse(sessionStorage.getItem("datalist2"));
      } else {
        this.dataListLoading = true;
        this.$http({
          url: this.$http.adornUrl(`/mfmallproduct/attrgroup/list`),
          method: "get",
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list;
            this.totalPage = data.page.totalCount;
            sessionStorage.setItem('datalist2', JSON.stringify(this.dataList))
            console.log('hahahah',data)
          } else {
            this.dataList = [];
            this.totalPage = 0;
          }
          this.dataListLoading = false;
        }).catch(e => {
          console.error(e)
          this.dataListLoading = false;
        });
      }
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.id;
          });
      this.$confirm(
        `确定对[id=${ids.join(",")}]进行[${id ? "删除" : "批量删除"}]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl("/mfmallproduct/attrgroup/delete"),
          method: "post",
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getDataList();
              }
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    }
  },
  //生命周期 - 创建完成（可以访问当前 this 实例）
  created() {},
  //生命周期 - 挂载完成（可以访问 DOM 元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {
    this.getDataList();
  } //如果页面有 keep-alive 缓存功能，这个函数会触发
};
</script>

<style lang="css" scoped>
</style>
