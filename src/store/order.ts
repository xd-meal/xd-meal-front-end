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
  time: string;
  title: string;
  desc: string;
  id: number;
  menuType: MENU_TYPE;
}
export interface IOrderGlobal {
  list: IOrderSingleItem[];
}

const state: IOrderGlobal = {
  list: [
    {
      id: 1,
      time: '2019-11-17',
      title: '鱼香肉丝炒宫爆鸡丁1',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.LUNCH,
      menuType: MENU_TYPE.BUFFE,
    },
    {
      id: 2,
      time: '2019-11-17',
      title: '鱼香肉丝炒宫爆鸡丁2',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.DINNER,
      menuType: MENU_TYPE.BUFFE,
    },
    {
      id: 3,
      time: '2019-11-17',
      title: '鱼香肉丝炒宫爆鸡丁3',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.LUNCH,
      menuType: MENU_TYPE.NORMAL,
    },
    {
      id: 3,
      time: '2019-11-17',
      title: '鱼香肉丝炒宫爆鸡丁4',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.DINNER,
      menuType: MENU_TYPE.NORMAL,
    },
    {
      id: 4,
      time: '2019-11-17',
      title: '鱼香肉丝炒宫爆鸡丁5',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.LUNCH,
      menuType: MENU_TYPE.BUFFE,
    },
    {
      id: 7,
      time: '2019-11-17',
      title: '鱼香肉丝炒宫爆鸡丁6',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.DINNER,
      menuType: MENU_TYPE.NORMAL,
    },
    {
      id: 1,
      time: '2019-11-18',
      title: '鱼香肉丝炒宫爆鸡丁7',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.DINNER,
      menuType: MENU_TYPE.NORMAL,
    },
    {
      id: 2,
      time: '2019-11-18',
      title: '鱼香肉丝炒宫爆鸡丁8',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.LUNCH,
      menuType: MENU_TYPE.NORMAL,
    },
    {
      id: 3,
      time: '2019-11-18',
      title: '鱼香肉丝炒宫爆鸡丁0=9',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.LUNCH,
      menuType: MENU_TYPE.BUFFE,
    },
    {
      id: 3,
      time: '2019-11-18',
      title: '鱼香肉丝炒宫爆鸡丁10',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.DINNER,
      menuType: MENU_TYPE.NORMAL,
    },
    {
      id: 4,
      time: '2019-11-18',
      title: '鱼香肉丝炒宫爆鸡丁11',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.LUNCH,
      menuType: MENU_TYPE.BUFFE,
    },
    {
      id: 7,
      time: '2019-11-18',
      title: '鱼香肉丝炒宫爆鸡丁12',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.DINNER,
      menuType: MENU_TYPE.NORMAL,
    },
    {
      id: 1,
      time: '2019-11-18',
      title: '鱼香肉丝炒宫爆鸡丁13',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.LUNCH,
      menuType: MENU_TYPE.NORMAL,
    },
    {
      id: 2,
      time: '2019-11-18',
      title: '鱼香肉丝炒宫爆鸡丁14',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.LUNCH,
      menuType: MENU_TYPE.BUFFE,
    },
    {
      id: 3,
      time: '2019-11-18',
      title: '鱼香肉丝炒宫爆鸡丁15',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.DINNER,
      menuType: MENU_TYPE.NORMAL,
    },
    {
      id: 3,
      time: '2019-11-18',
      title: '鱼香肉丝炒宫爆鸡丁16',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.LUNCH,
      menuType: MENU_TYPE.BUFFE,
    },
    {
      id: 4,
      time: '2019-11-18',
      title: '鱼香肉丝炒宫爆鸡丁17',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.DINNER,
      menuType: MENU_TYPE.NORMAL,
    },
    {
      id: 7,
      time: '2019-11-18',
      title: '鱼香肉丝炒宫爆鸡丁18',
      desc: '含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜，含香菜大葱洋葱海鲜',
      type: MENU_TIME_TYPE.LUNCH,
      menuType: MENU_TYPE.BUFFE,
    },
  ],
};

export const ORDER_NAMESPACE: string = 'order/';
export enum ORDER {}

const getters: GetterTree<IOrderGlobal, any> = {};
const actions: ActionTree<IOrderGlobal, any> = {};
const mutations: MutationTree<IOrderGlobal> = {};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
