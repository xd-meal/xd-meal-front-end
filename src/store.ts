import Vue from 'vue';
import Vuex from 'vuex';

import user from './store/user';
import menu from './store/menu';
import order from './store/order';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    menu,
    order,
  },
  state: {},
  mutations: {},
  actions: {},
});
