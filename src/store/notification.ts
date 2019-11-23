import { ActionTree, GetterTree, MutationTree } from 'vuex';

export interface INotificationGlobal {
  list: string[];
}
const state: INotificationGlobal = {
  list: ['公告：今天的牛肉换成了鸡肉猪肉羊肉'],
};

export const NOTIFICATION_NAMESPACE: string = 'notification/';
export enum NOTIFICATION {
  LAST = 'Last',
}
const getters: GetterTree<INotificationGlobal, any> = {
  Last(payload): string {
    return payload.list[payload.list.length - 1];
  },
};
const actions: ActionTree<INotificationGlobal, any> = {};
const mutations: MutationTree<INotificationGlobal> = {};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
