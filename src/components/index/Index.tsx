import './index.scss';

import Vue, { VNode } from 'vue';
import * as tsx from 'vue-tsx-support';
import { Component, Ref } from 'vue-property-decorator';
import moment from 'moment';
import _ from 'lodash';

import {
  ISingleMenuItem,
  MENU_NAMESPACE,
  MENU_TIME_TYPE,
  MENU,
} from '@/store/menu';
import { NOTIFICATION, NOTIFICATION_NAMESPACE } from '@/store/notification';

import { timeParser } from '@/components/utils/time';

const DATE_MAP = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
];
@Component
export default class Index extends tsx.Component<any> {
  // data
  protected labelMap: {
    [key: string]: string;
  } = {
    ['早餐']: MENU_TIME_TYPE.BREAKFAST,
    ['午餐']: MENU_TIME_TYPE.LUNCH,
    ['水果']: MENU_TIME_TYPE.FRUIT,
    ['晚餐']: MENU_TIME_TYPE.DINNER,
  };
  protected selectedLabel = '早餐';
  protected tabLabels = [
    {
      label: '早餐',
      startTime: 0,
      endTime: 10,
    },
    {
      label: '午餐',
      startTime: 10,
      endTime: 13,
    },
    {
      label: '水果',
      startTime: 13,
      endTime: 17,
    },
    {
      label: '晚餐',
      startTime: 17,
      endTime: 23,
    },
  ];

  protected render(): VNode {
    return (
      <div class='app-index index'>
        <div class='index-header'>
          <div class='index-header-tab'>
            <cube-tab-bar
              vModel={this.selectedLabel}
              show-slider={false}
              use-transition={false}
              ref='tabNav'
              data={this.tabLabels}
            />
          </div>
          <router-link
            class='nav-link notification'
            to={{ name: 'notification' }}
          />
        </div>
        <div class='index-body'>
          <cube-slide
            ref='slide'
            loop={false}
            initial-index={this.initialIndex}
            auto-play={false}
            show-dots={false}
            threshold={0.2}
            options={{
              listenScroll: true,
              probeType: 3,
              /* lock y-direction when scrolling horizontally and  vertically at the same time */
              directionLockThreshold: 0,
            }}
            onScroll={this.scroll}
            onChange={this.changePage}
          >
            {this.tabLabels.map((tabLabel) => {
              const menus = this.menuMap[this.labelMap[tabLabel.label]];
              return (
                <cube-slide-item>
                  <cube-scroll
                    data={menus}
                    options={{
                      directionLockThreshold: 0,
                    }}
                  >
                    {_(menus)
                      .sortBy('time')
                      .map((item: ISingleMenuItem) => (
                        <div class='app-day-menu'>
                          <div class='app-day-menu-time'>
                            <span class='icon' />
                            <span class='time'>{timeParser(item.time)}</span>
                          </div>
                          <div class='app-day-menu-body'>
                            <div class='app-day-menu-body-wrap'>
                              <div class='title'>{item.title}</div>
                              <div class='down-vote'></div>
                            </div>
                            <div class='app-day-menu-body-wrap'>
                              {item.desc.split(/[,，]/).map((desc) => (
                                <div class='desc'>{desc}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                      .value()}
                  </cube-scroll>
                </cube-slide-item>
              );
            })}
          </cube-slide>
        </div>
      </div>
    );
  }
  // getter
  protected get menus(): ISingleMenuItem[] {
    return this.$store.state.menu.list;
  }
  protected get initialIndex() {
    return _.findIndex(this.tabLabels, ['label', this.selectedLabel]);
  }
  protected get menuMap(): {
    [key: string]: ISingleMenuItem[];
  } {
    return _(this.menus)
      .groupBy('type')
      .value();
  }
  // event
  private mounted() {
    this.$store.dispatch(MENU_NAMESPACE + MENU.FETCH_MY_MENUS_ACTION);
    const now = moment();
    // tslint:disable-next-line:forin
    for (const label of this.tabLabels) {
      const start = moment()
        .hour(label.startTime)
        .minute(0)
        .second(0);
      const end = moment()
        .hour(label.endTime)
        .minute(59)
        .second(59);
      const flag = now.isBetween(start, end);
      if (flag) {
        this.selectedLabel = label.label;
        // XXX: 无法正确的设置 current page index 这里强行设定了
        (this.$refs.slide as any).currentPageIndex = _.findIndex(
          this.tabLabels,
          ['label', this.selectedLabel],
        );
      }
    }
  }

  private scroll(pos: any) {
    const x = Math.abs(pos.x);
    const tabItemWidth = (this.$refs.tabNav as Vue).$el.clientWidth;
    const slideScrollerWidth = (this.$refs.slide as any).slide.scrollerWidth;
    const deltaX = (x / slideScrollerWidth) * tabItemWidth;
    (this.$refs.tabNav as any).setSliderTransform(deltaX);
  }
  private changePage(current: number) {
    this.selectedLabel = this.tabLabels[current].label;
  }
}
