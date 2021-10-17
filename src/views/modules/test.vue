<!--
 * @Author: feizzer
 * @Date: 2021-10-05 11:02:00
 * @LastEditors: feizzer
 * @LastEditTime: 2021-10-05 16:09:24
 * @Description: 
-->
<template>
    <div>
        <el-form action="" :rules="rules">
            <el-form-item prop="test">
               <el-input v-model="value1" type="text"></el-input>
            </el-form-item>
            <el-form-item >
                <el-input v-model="value2"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'RenrenFastVueTest',

    data() {
        return {
            value1: "",
            value2: "",
            rules:{
                test:[
                    {required: true, message: 'not null', trigger: 'blur'},
                    {min: 3,max: 5, message: 'hahahahah', trigger: 'blur'},
                ],
            },
        };
    },
    mounted() {
    },
    methods: {
    },
};
</script>

<style lang="css" scoped>

</style>
