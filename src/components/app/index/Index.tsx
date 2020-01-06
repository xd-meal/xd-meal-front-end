import './index.scss';
import { IMyDining, VoteDown } from '@/api/menu';
import { getTimeName, getTimeType } from '@/components/utils/diningTime';
import { getMenuGroupBy } from '@/components/utils/group';
import { IStoreDining } from '@/store/order';

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
// import { NOTIFICATION, NOTIFICATION_NAMESPACE } from '@/store/notification';

import { timeParser } from '@/components/utils/time';

@Component
export default class Index extends tsx.Component<any> {
  // data
  protected innerPromise = false;
  protected list: Array<{
    key: string;
    value: IMyDining[];
  }> = [];

  protected render(): VNode {
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
          {this.list.length === 0 && <div class='tip'>还未选餐哟！</div>}
          <cube-scroll
            data={this.menus}
            options={{
              directionLockThreshold: 0,
            }}
          >
            {this.list.map((diningList) => (
              <div class='app-day-menu'>
                <div class='app-day-menu-time'>
                  <span class='icon' />
                  <span class='time'>{timeParser(diningList.key)}</span>
                </div>
                {diningList.value.map((item) => (
                  <div class='app-day-menu-body'>
                    <div
                      class='time-title'
                      style='line-height: 28px;font-size: 20px;margin: 14px 0;font-weight: 500;'
                    >
                      {item && getTimeName(item)}
                    </div>
                    <div class='app-day-menu-body-wrap'>
                      <div class='title'>{item.menu.title}</div>
                      <div
                        class={{
                          'down-vote': true,
                          // 'down-vote_active': item.isVoteDown,
                        }}
                        // onClick={this.voteDownDishes.bind(this, item)}
                      />
                    </div>
                    {/自助/g.test(item.menu.title) && (
                      <div class='app-day-menu-body-wrap'>
                        {item.menu.desc.split(/[,，]/).map((desc) => (
                          <div class='desc'>{desc}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
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
    this.list = getMenuGroupBy<IMyDining>(this.menus);
  }

  private async voteDownDishes(dish: ISingleMenuItem) {
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
    }
    this.innerPromise = false;
  }
}
