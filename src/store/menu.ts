import { fetchMyDishes, fetchWeekdayDishes, IMyDish } from '@/api/menu';
import { ActionTree, MutationTree } from 'vuex';

export enum MENU_TIME_TYPE {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  FRUIT = 'fruit',
}

/**
 * @example
 * {
 *   time: '2019-11-20',
 *   title: '鱼香肉丝炒宫爆鸡丁8',
 *   desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
 *   type: MENU_TIME_TYPE.DINNER,
 * },
 */
export interface ISingleMenuItem {
  time: string;
  title: string;
  desc: string;
  type: MENU_TIME_TYPE;
}

export interface IMenuGlobal {
  list: ISingleMenuItem[];
}

const state: IMenuGlobal = {
  list: [],
};

export const MENU_NAMESPACE = 'menu/';
export enum MENU {
  FETCH_MY_MENUS_ACTION = 'fetchMyMenusAction',

  SET_MENUS = 'setMenus',
}

const getters = {};
const actions: ActionTree<IMenuGlobal, any> = {
  async [MENU.FETCH_MY_MENUS_ACTION]({ commit }) {
    const myDishesRes = await fetchMyDishes();
    if (myDishesRes.code === 200) {
      const myDishes = myDishesRes.data;
      commit(MENU.SET_MENUS, { myDishes });
    } else {
      // TODO: 异常处理情况
    }
  },
};
const mutations: MutationTree<IMenuGlobal> = {
  [MENU.SET_MENUS](_, { myDishes }) {
    _.list = myDishes.map((dish: IMyDish) => {
      return {
        time: dish.mealDay,
        title: dish.name,
        desc: '',
        type: dish.typeA === 1 ? MENU_TIME_TYPE.LUNCH : MENU_TIME_TYPE.DINNER,
      };
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
