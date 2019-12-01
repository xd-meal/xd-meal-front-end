import './index.scss';

import Vue, { VNode } from 'vue';
import * as tsx from 'vue-tsx-support';
import { Component, Ref } from 'vue-property-decorator';
import moment from 'moment';
import _ from 'lodash';

import { ISingleMenuItem, MENU_TIME_TYPE } from '@/store/menu';
import { NOTIFICATION, NOTIFICATION_NAMESPACE } from '@/store/notification';

import { timeParser } from '@/components/utils/time';
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
    },
    {
      label: '午餐',
    },
    {
      label: '水果',
    },
    {
      label: '晚餐',
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
        </div>
        <div class='index-body'>
          <cube-slide
            ref='slide'
            loop={false}
            initial-index={this.initialIndex}
            auto-play={false}
            show-dots={false}
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
                      /* lock x-direction when scrolling horizontally and  vertically at the same time */
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
  private mounted() {}

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
