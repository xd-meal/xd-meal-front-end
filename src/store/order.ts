import {
  fetchWeekdayDishes,
  IDishes,
  IHttpDining,
  IHttpDish,
} from '@/api/menu';
import moment from 'moment';
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { MENU_TIME_TYPE } from './menu';

export interface IIterableDesc {
  title: string;
  desc: string;
}

export enum MENU_TYPE {
  BUFFE = 'buffet',
  NORMAL = 'normal',
}
export interface IOrderSingleItem {
  type: MENU_TIME_TYPE;
  iterableDesc?: IIterableDesc[];
  // 2019-10-20
  time: string;
  title: string;
  desc: string;
  id: string;
  menuType: MENU_TYPE;
}
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
}

const getters: GetterTree<IOrderGlobal, any> = {
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
    _.list = [];
    weekdayDining.forEach((data: IStoreDining) => {
      const menu = data.menu;
      // menu.forEach((menu: IDishes))
      // return {
      //   title: data.name,
      //   time: data.mealDay,
      //   id: data._id,
      //   menuType: data.typeB === 1 ? MENU_TYPE.BUFFE : MENU_TYPE.NORMAL,
      //   desc: '',
      //   type: data.typeA === 1 ? MENU_TIME_TYPE.LUNCH : MENU_TIME_TYPE.DINNER,
      // };
    });
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
