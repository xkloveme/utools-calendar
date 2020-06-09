import Vue from "vue";
import Vuex from "vuex";
import { getApi } from "./../utils/db.js";
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    config: {
      bg: false,
      layout: 1,
      width: 600,
      height: 450,
      background: 1,
      dataColor: "FFFFFF",
      borderRadius: 5,
      language: "zh", // zh en
      key: "75f7ef04ec64481cb131ff6621b8c8c1",
    },
  },
  mutations: {
    SET_CONFIG: (state, config) => {
      for (const key in config) {
        if (config[key]) {
          state.config[key] = config[key];
        }
      }
    },
  },
  actions: {
    // 获取当前状态
    getConfig({ commit }, id = "weather") {
      return new Promise((resolve, reject) => {
        getApi(id)
          .then((res) => {
            if (res.layout) {
              commit("SET_CONFIG", res);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
  modules: {},
});
export default store;
