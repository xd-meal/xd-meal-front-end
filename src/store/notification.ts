import { ActionTree, GetterTree, MutationTree } from 'vuex';

export interface INotification {
  desc: string;
  title: string;
  time: string;
}
export interface INotificationGlobal {
  list: INotification[];
}
const state: INotificationGlobal = {
  list: [
    {
      time: '2019-12-12',
      title: '通知',
      desc:
        '下周开始有砂锅，下周开始有砂锅下周开始有砂锅下周开始有砂锅下周开始有砂锅下周开始有砂锅下周开始有砂锅下周开始有砂锅',
    },
  ],
};

export const NOTIFICATION_NAMESPACE: string = 'notification/';
export enum NOTIFICATION {
  LAST = 'Last',
}
const getters: GetterTree<INotificationGlobal, any> = {
  Last(payload): INotification {
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
