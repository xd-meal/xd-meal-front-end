import { fetchWeekdayDishes, IHttpDining, IHttpDish } from '@/api/menu';
import moment from 'moment';
import { ActionTree, GetterTree, MutationTree } from 'vuex';

export interface IStoreDish extends IHttpDish {
  _id: string;
}
export interface IStoreDining extends IHttpDining {
  menu: IStoreDish[];
}
export interface IOrderGlobal {
  list: IStoreDining[];
  lastUpdate: moment.Moment;
}

const state: IOrderGlobal = {
  list: [],
  // XXX: 随便设置时间，只要是过去时间即可
  lastUpdate: moment('2018-06-06'),
};

export const ORDER_NAMESPACE: string = 'order/';
export enum ORDER {
  FETCH_ORDER_DISHES_ACTION = 'fetchOrderDishesAction',

  SET_UPDATE_TIME = 'setUpdateTime',
  SET_MENUS = 'setMenus',

  SHOULD_UPDATE = 'shouldUpdate',

  ORDER_NORMAL_LIST = 'orderNormalList',
  ORDER_LIMIT_LIST = 'orderLimitList',
}

function filterEmptyMenu(v: IStoreDining) {
  return v.menu.length > 0;
}

const getters: GetterTree<IOrderGlobal, any> = {
  [ORDER.ORDER_LIMIT_LIST](_) {
    return _.list
      .map((v) => {
        return {
          ...v,
          menu: v.menu.filter((m) => m.limit),
        };
      })
      .filter(filterEmptyMenu)
      .map((v) => {
        const menu = v.menu;
        menu.unshift({
          _id: '',
          title: '不喜欢这顿',
          desc: '这顿不选.jpg',
          limit: 0,
        });
        return {
          ...v,
          menu: v.menu,
        };
      });
  },
  [ORDER.ORDER_NORMAL_LIST](_) {
    return _.list
      .map((v) => {
        return {
          ...v,
          menu: v.menu.filter((menu) => !menu.limit),
        };
      })
      .filter(filterEmptyMenu);
  },
  [ORDER.SHOULD_UPDATE]() {
    return moment().unix() - state.lastUpdate.unix() > 15;
  },
};
const actions: ActionTree<IOrderGlobal, any> = {
  async [ORDER.FETCH_ORDER_DISHES_ACTION]({ commit }) {
    const weekdayDishesRes = await fetchWeekdayDishes();
    if (weekdayDishesRes.code === 200) {
      commit(ORDER.SET_MENUS, { weekdayDining: weekdayDishesRes.data.dinings });
    } else {
      // TODO: 网络或者其他错误请稍后再试
    }
  },
};
const mutations: MutationTree<IOrderGlobal> = {
  [ORDER.SET_UPDATE_TIME](_) {
    _.lastUpdate = moment();
  },
  [ORDER.SET_MENUS](_, { weekdayDining }) {
    _.list = weekdayDining;
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
