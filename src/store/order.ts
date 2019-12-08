import { fetchWeekdayDishes, IDishes } from '@/api/menu';
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
export interface IOrderGlobal {
  list: IOrderSingleItem[];
}

const state: IOrderGlobal = {
  list: [],
};

export const ORDER_NAMESPACE: string = 'order/';
export enum ORDER {
  FETCH_ORDER_DISHES_ACTION = 'fetchOrderDishesAction',

  SET_MENUS = 'setMenus',
}

const getters: GetterTree<IOrderGlobal, any> = {};
const actions: ActionTree<IOrderGlobal, any> = {
  async [ORDER.FETCH_ORDER_DISHES_ACTION]({ commit }) {
    const weekdayDishesRes = await fetchWeekdayDishes();
    if (weekdayDishesRes.code === 200) {
      commit(ORDER.SET_MENUS, { weekdayDishes: weekdayDishesRes.data });
    } else {
      // TODO: 网络或者其他错误请稍后再试
    }
  },
};
const mutations: MutationTree<IOrderGlobal> = {
  [ORDER.SET_MENUS](_, { weekdayDishes }) {
    _.list = weekdayDishes.map(
      (data: IDishes): IOrderSingleItem => {
        return {
          title: data.name,
          time: data.mealDay,
          id: data._id,
          menuType: data.typeB === 1 ? MENU_TYPE.BUFFE : MENU_TYPE.NORMAL,
          desc: '',
          type: data.typeA === 1 ? MENU_TIME_TYPE.LUNCH : MENU_TIME_TYPE.DINNER,
        };
      },
    );
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
