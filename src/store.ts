import Vue from 'vue';
import Vuex from 'vuex';

import user from './store/user';
import notification from './store/notification';
import menu from './store/menu';
import order from './store/order';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    notification,
    menu,
    order,
  },
  state: {},
  mutations: {},
  actions: {},
});
