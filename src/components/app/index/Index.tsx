import './index.scss';
import { IMyDining, VoteDown } from '@/api/menu';
import { getTimeName } from '@/components/utils/diningTime';
import { getMenuGroupBy } from '@/components/utils/group';

import { VNode } from 'vue';
import * as tsx from 'vue-tsx-support';
import { Component } from 'vue-property-decorator';

import { ISingleMenuItem, MENU_NAMESPACE, MENU } from '@/store/menu';

import { timeParser } from '@/components/utils/time';

interface IIndexMyDining extends IMyDining {
  timeTile: string;
}
@Component
export default class Index extends tsx.Component<any> {
  // data
  protected innerPromise = false;
  protected list: Array<{
    key: string;
    value: IIndexMyDining[];
  }> = [];

  protected render(): VNode {
    const center = this.list.map((diningList) => (
      <div class='app-day-menu'>
        <div class='app-day-menu-time'>
          <span class='icon' />
          <span class='time'>{diningList.key}</span>
        </div>
        {diningList.value.map((item) => (
          <div class='app-day-menu-body'>
            <div
              class='time-title'
              style='line-height: 28px;font-size: 20px;margin: 14px 0;font-weight: 500;'
            >
              {item.timeTile}
            </div>
            <div class='app-day-menu-body-wrap'>
              <div class='title'>{item.menu.title}</div>
              <div
                class={{
                  'down-vote': true,
                  'down-vote_active': item.isVoteDown,
                }}
                onClick={this.voteDownDishes.bind(this, item)}
              />
            </div>
            <div class='app-day-menu-body-wrap'>
              <div class='desc'>{item.menu.desc}</div>
            </div>
            <div class='line-next-split' />
          </div>
        ))}
      </div>
    ));

    return (
      <div class='app-index index'>
        {/*<div class='index-header'>*/}
        {/*  <div class='index-header-tab'></div>*/}
        {/*</div>*/}
        <div
          class={{
            'index-body': true,
            'index-body_empty': this.list.length === 0,
          }}
        >
          {this.list.length === 0 && <div class='tip' />}
          <cube-scroll
            data={this.menus}
            options={{
              directionLockThreshold: 0,
              useTransition: false,
            }}
          >
            <div>{center}</div>
          </cube-scroll>
        </div>
      </div>
    );
  }
  // getter
  protected get menus(): IMyDining[] {
    return this.$store.state.menu.list;
  }

  // event
  private async mounted() {
    await this.$store.dispatch(MENU_NAMESPACE + MENU.FETCH_MY_MENUS_ACTION);
    const list = getMenuGroupBy<IMyDining>(this.menus);

    this.list = list.map(({ value, key }) => ({
      key: timeParser(key),
      value: value.map((menu) => ({
        ...menu,
        timeTile: getTimeName(menu),
      })),
    }));
  }

  private async voteDownDishes(dish: IIndexMyDining) {
    if (this.innerPromise) {
      return;
    }
    this.innerPromise = true;
    const res = await VoteDown(dish.id, !dish.isVoteDown);
    if (res.code !== 200) {
      this.$createToast({
        txt: res.msg,
        type: 'text',
      }).show();
    } else {
      this.$store.commit(MENU_NAMESPACE + MENU.SET_MENU, {
        isVoteDown: !dish.isVoteDown,
        dish,
      });
      dish.isVoteDown = !dish.isVoteDown;
    }
    this.innerPromise = false;
  }
}
