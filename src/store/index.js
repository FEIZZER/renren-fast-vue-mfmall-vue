import Vue from 'vue'
import Vuex from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import common from './modules/common'
import user from './modules/user'
import http from '../utils/httpRequest'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    user
  },
  state: {  
    categoryData:[],
    attrData: [],
  },
  getters: {
    returnAttr: state => {
      if (state.attrData.length === 0) {
        getAllAttr()
      }
      return state.attrData;
    }
  },
  mutations: {  
    // 重置vuex本地储存状态
    resetStore (state) {
      Object.keys(state).forEach((key) => {
        state[key] = cloneDeep(window.SITE_CONFIG['storeState'][key])
      })
    },
    getAllAttr() {
      http({
        url: http.adornUrl('/mfmallproduct/attrgroup/list'),
        method: 'get',
      }).then( data => {
        if (data && data.data.code === 0) {
          this.state.attrData = data.data.page.list
        }
      }).catch(e => {
        console.error(e)
      })
    },
  },
  actions: {
    getAllAttr(context) {
      
    }
  },
  strict: process.env.NODE_ENV !== 'production'
}) 