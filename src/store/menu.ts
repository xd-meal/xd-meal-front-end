import { ActionTree, MutationTree } from 'vuex';

export enum MENU_TIME_TYPE {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  FRUIT = 'fruit',
}
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
  list: [
    {
      time: '2019-11-21',
      title: '鱼香肉丝炒宫爆鸡丁1',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.LUNCH,
    },
    {
      time: '2019-11-21',
      title: '鱼香肉丝炒宫爆鸡丁2',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.DINNER,
    },
    {
      time: '2019-11-22',
      title: '鱼香肉丝炒宫爆鸡丁3',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.LUNCH,
    },
    {
      time: '2019-11-23',
      title: '鱼香肉丝炒宫爆鸡丁4',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.DINNER,
    },
    {
      time: '2019-11-23',
      title: '鱼香肉丝炒宫爆鸡丁5',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.LUNCH,
    },
    {
      time: '2019-11-19',
      title: '鱼香肉丝炒宫爆鸡丁6',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.DINNER,
    },

    {
      time: '2019-11-20',
      title: '鱼香肉丝炒宫爆鸡丁7',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.LUNCH,
    },
    {
      time: '2019-11-20',
      title: '鱼香肉丝炒宫爆鸡丁8',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.DINNER,
    },
  ],
};
export const MENU_NAMESPACE = 'menu/';
export enum MENU {}

const getters = {};
const actions: ActionTree<IMenuGlobal, any> = {};
const mutations: MutationTree<IMenuGlobal> = {};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
