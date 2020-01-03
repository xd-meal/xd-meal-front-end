import { ActionTree, GetterTree, MutationTree } from 'vuex';
import store from 'store';
export interface INotification {
  desc: string;
  title: string;
  time: string;
}
export interface INotificationGlobal {
  list: INotification[];
  isShow: boolean;
}
const state: INotificationGlobal = {
  isShow: store.get('showNotification') === '1',
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

  SET_BUTTON = 'SetButtonShow',
}
const getters: GetterTree<INotificationGlobal, any> = {
  Last(payload): INotification {
    return payload.list[payload.list.length - 1];
  },
};
const actions: ActionTree<INotificationGlobal, any> = {};
const mutations: MutationTree<INotificationGlobal> = {
  [NOTIFICATION.SET_BUTTON](_, { status }) {
    _.isShow = Boolean(status);
    store.set('showNotification', (status ? 1 : 0).toString());
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
