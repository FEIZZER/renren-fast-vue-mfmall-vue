/*
 * @Author: xiao-jie
 * @Date: 2021-09-28 20:10:47
 * @LastEditors: xiao-jie
 * @LastEditTime: 2021-09-30 15:27:46
 * @Description: 
 */

import http from "../httpRequest"
function getPolicy() {
    return  new Promise((resolve,reject)=>{
        http({
            url: http.adornUrl("/third-part/oss/policy"),
            method: "get",
            params: http.adornParams({})
        }).then(({ data }) => {
            resolve(data);
        })
    });
}

export {
    getPolicy
}