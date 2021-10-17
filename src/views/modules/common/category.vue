<!--
 * @Author: feizzer
 * @Date: 2021-10-10 17:05:41
 * @LastEditors: feizzer
 * @LastEditTime: 2021-10-17 15:24:13
 * @Description: 
-->
<template>
  <div>
    <el-tree
      :data="data"
      :props="treeListProps"
      node-key="id"
      :expand-on-click-node="true"
      @node-click="nodeClicked"
    ></el-tree>
  </div>
</template>

<script>
export default {
  name: "CommonVueCategory",

  data() {
    return {
      data: [],
      treeListProps: {
        label: "name",
        children: "childrens"
      }
    };
  },
  methods: {
    nodeClicked(data, node, component) {
      this.$emit("nodeClicked", data);
    },
    getMenus() {
      if (sessionStorage.getItem("categoryList")) {
        this.data = JSON.parse(sessionStorage.getItem("categoryList")) 
      } else {
        this.$http({
          url: this.$http.adornUrl("/mfmallproduct/category/list"),
          method: "get"
        }).then(data => {
            this.data = data.data.data;
            sessionStorage.setItem('categoryList', JSON.stringify(this.data))
          }).catch(error => {
            console.log(error);
          });
      }
    }
  },
  mounted() {
    this.getMenus();
  }
};
</script>

<style lang="css" scoped>
</style>
