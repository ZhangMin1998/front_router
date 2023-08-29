import Vue from 'vue'
import Vuex from 'vuex'
import User from './modules/user'
import permission from './modules/permission'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    User,
    permission,
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      reducer(val) {
        return {
          User: val.User,
        }
      },
    }),
  ],
})
