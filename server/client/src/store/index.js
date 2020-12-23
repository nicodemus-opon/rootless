import Vue from "vue";
import Vuex from "vuex";
import router from "@/router/index.js";
import createPersistedState from "vuex-persistedstate";
import createMultiTabState from "vuex-multi-tab-state";
Vue.use(Vuex)

export const store =  new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage
    }),
    createMultiTabState()
  ],
  state: {
    todos: [],
    user: [],
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    logoutUser(state) {
      state.user = [];

    }
  },
  actions: {
    setUpUserAction({ commit }, payload) {
      commit("setUser", payload);
      router.push("/app/");
    },
    signOut({ commit }) {
      commit("logoutUser");
      router.replace({
        name: "appAuth"
      });

    },
  },
  getters: {
    getUser: state => {
      return state.user;
    },

    isLoggedIn: state => {
      let res;
      if (state.user._id) {
        res = true;
      } else {
        res = false;
      }
      return res;
    }
  }
})
