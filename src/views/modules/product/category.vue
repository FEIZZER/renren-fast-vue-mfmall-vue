<!--
 * @Author: xiao-jie
 * @Date: 2021-09-14 15:22:25
 * @LastEditors: feizzer
 * @LastEditTime: 2021-10-10 17:10:05
 * @Description: 
-->
<template>
  <div>
    <div class="custom-tree-container">
      <div class="block">
        <p>使用 render-content</p>
        <el-tree
          :data="data"
          :props="treeListProps"
          :default-expanded-keys="expendkeys"
          show-checkbox
          node-key="id"
          :expand-on-click-node="true">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button type="text" size="mini" @click="() => append(data)">Append</el-button>
              <el-button type="text" size="mini" @click="() => remove(node, data)">Delete</el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <el-dialog title="新建分类" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules">
        <el-form-item label="父类型" :label-width="formLabelWidth">
            <el-input v-model="newCategory.parent" readonly="readonly"> </el-input>
        </el-form-item>
        <el-form-item label="类别名称" :label-width="formLabelWidth" prop="newCategoryName">
          <el-input v-model="newCategory.name" autocomplete="off" ></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="() => doNewCategory()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "RenrenFastVueCategory",

  data() {
    return {
      expendkeys:[],
      data: [],
      treeListProps: {
        label: "name",
        children: "childrens"
      },
      dialogFormVisible: false,
      newCategory:{
          name:"",
          parent: "",
          parentId: NaN,
          childrens: [],
          goodsNum: 0,
          id: NaN,
          seq: 1,
          template: 42,
          isShow: 1,
          isMenu: 0,
      },
      rules: {
          newCategoryName: [
              {required: true, message: "新建类别不能为空", trigger: 'blur'},
          ]
      }
    };
  },

  mounted() {},
  created() {
    this.getMenus();
  },
  methods: {
    doNewCategory (){
        console.log('start')
        this.$http({
            url: this.$http.adornUrl("/mfmallproduct/category/save"),
            method: "post",
            data: this.$http.adornData(this.newCategory, false)
        }).then(() => {
            this.$message({
                message: "添加成功",
                type: "success"
            })
            this.getMenus()
            this.expendkeys[0] = this.newCategory.parentId
            this.dialogFormVisible = false
        }).catch(err => {
            console.error(err)
        })
    },
    append(data){
        console.log(data)
        this.dialogFormVisible = true
        this.newCategory.parent = data.name
        this.newCategory.parentId = data.id
    },
    remove(node, data) {
      this.$confirm(`此操作将永久删除 [${data.name}] 菜单, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ids = [data.id];
        console.log(data.id);
        this.$http({
          url: this.$http.adornUrl("/mfmallproduct/category/delete"),
          method: "post",
          data: this.$http.adornData(ids, false)
        })
          .then(() => {
            this.getMenus()
            this.expendkeys[0] = this.newCategory.parentId
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          })
          .catch(error => {
            console.error(error);
          });
      });
    },
    getMenus() {
      this.$http({
        url: this.$http.adornUrl("/mfmallproduct/category/list"),
        method: "get"
      })
        .then(data => {
          console.log(data);
          this.data = data.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="css" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
