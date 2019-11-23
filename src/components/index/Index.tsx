import './index.scss';

import { VNode } from 'vue';
import * as tsx from 'vue-tsx-support';
import { Component } from 'vue-property-decorator';
import moment from 'moment';

import { ISingleMenuItem, MENU_TIME_TYPE } from '@/store/menu';
import { NOTIFICATION, NOTIFICATION_NAMESPACE } from '@/store/notification';

import { getDay } from '@/components/utils/time.ts';
import MenuItem from '@/components/index/MenuItem.tsx';

const DATE_MAP = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
];
@Component({
  components: { MenuItem },
})
export default class Index extends tsx.Component<any> {
  // data
  protected activeTab: string = MENU_TIME_TYPE.BREAKFAST;
  private tabList = [
    {
      name: '早餐',
      type: MENU_TIME_TYPE.BREAKFAST,
    },
    {
      name: '午餐',
      type: MENU_TIME_TYPE.LUNCH,
    },
    {
      name: '水果',
      type: MENU_TIME_TYPE.FRUIT,
    },
    {
      name: '晚餐',
      type: MENU_TIME_TYPE.DINNER,
    },
  ];

  private selectTime = '';

  protected render(): VNode {
    const { Time, Notification, tabList, menus } = this;
    const tabs = tabList.map((tab) => (
      <cube-tab-panel label={tab.name} key={tab.type} value={tab.type}>
        {menus
          .filter((menu: ISingleMenuItem) => menu.type === tab.type)
          .map((menu: ISingleMenuItem) => (
            <div class='single-menu'>
              <div class='time'>{getDay(menu.time)}</div>
              <div class='menu-content'>
                <div class='menu-content-wrap'>
                  <div class='menu-content-title'> {menu.title}</div>
                  <div class='menu-content-desc'> {menu.desc}</div>
                </div>
              </div>
            </div>
          ))}
      </cube-tab-panel>
    ));
    return (
      <div class='app-index'>
        <div class='header'>
          <div class='time-wrap'>
            <div class='time'>{Time}</div>
            <div class='weekday'>
              {DATE_MAP[moment(this.selectTime).weekday()]}
            </div>
            <div class='last-notification'>{Notification}</div>
          </div>
          <a class='notification' />
        </div>
        <div class='index-body'>
          <cube-tab-bar vModel={this.activeTab} show-slider>
            {this.tabList.map((tab) => (
              <cube-tab label={tab.name} key={tab.type} value={tab.type} />
            ))}
          </cube-tab-bar>
          <cube-tab-panels vModel={this.activeTab}>{tabs}</cube-tab-panels>
        </div>
      </div>
    );
  }
  // getter

  public get menus(): ISingleMenuItem[] {
    return this.$store.state.menu.list;
  }
  public get Notification(): string {
    return this.$store.getters[NOTIFICATION_NAMESPACE + NOTIFICATION.LAST];
  }

  private get SelectTimeTransfer() {
    return moment(this.selectTime);
  }

  private get Time(): string {
    return moment().format('YYYY MM DD');
  }

  private get Day(): string {
    return moment().format('YYYY-MM-DD');
  }

  private get timeOpt() {
    return Object.keys(
      this.menus.reduce(
        (pre: { [key: string]: boolean }, menu) => {
          pre[menu.time] = true;
          return pre;
        },
        { [this.Day]: true },
      ),
    )
      .sort()
      .map((key) => ({
        text: DATE_MAP[moment(key).weekday()],
        value: key,
      }));
  }

  private get CurrentMenu(): ISingleMenuItem[] {
    return this.menus.filter(
      (menu: ISingleMenuItem) =>
        menu.type === this.ActiveMenuTime && this.selectTime === menu.time,
    );
  }

  private get Weekday() {
    return DATE_MAP[this.SelectTimeTransfer.weekday()];
  }

  protected get ActiveMenuTime() {
    return this.activeTab;
  }

  // event
  private mounted() {
    if (this.timeOpt[0]) {
      this.selectTime = this.Day;
    }
  }
}
