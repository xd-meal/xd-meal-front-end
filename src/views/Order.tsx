import './Order.scss';
import { ROUTER_NAME } from '@/router';

import _ from 'lodash';
import moment from 'moment';
import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

import { getDay, timeParser, timeMMDD } from '@/components/utils/time.ts';

import { IOrderSingleItem, IStoreDining } from '@/store/order';

import { orderDishes } from '@/api/menu.ts';

import ChildPageConstruction from '@/components/utils/ChildPageConstruction';
import CommonHeader from '@/components/utils/CommonHeader';
import OrderDining from '@/components/app/order/OrderDining';

export interface IOrderSingleItemWithChecked extends IOrderSingleItem {
  checked?: boolean;
}
// TODO: 逻辑太复杂，结构和后台已不同，必须重写
@Component({
  components: {
    ChildPageConstruction,
    CommonHeader,
    OrderDining,
  },
})
export default class Order extends tsx.Component<any> {
  // protected orderList: IOrderSingleItemWithChecked[] = [];
  protected list: Array<{
    key: string;
    value: IStoreDining[];
  }> = [];
  protected current: any = null;
  protected errorText: string = '';
  protected selector: { [key: string]: string | null } = {};

  protected render(): VNode {
    return (
      <ChildPageConstruction class='order'>
        <div class='order-header' Slot='header'>
          <CommonHeader
            Slot='header'
            title='下周选饭'
            goBackPath={{
              name: 'index',
            }}
          />
        </div>
        <div class='order-body' Slot='context'>
          <cube-scroll-nav
            side={true}
            data={this.list}
            onChange={this.changeHandler}
            ref='cubeScrollNav'
          >
            <cube-scroll-nav-bar
              labels={this.scrollNavBarLabels}
              slot='bar'
              current={this.current}
              txts={this.scrollNavBarTxts}
              direction='vertical'
            />
            {this.list.map((diningList) => (
              <cube-scroll-nav-panel
                key={diningList.key}
                label={diningList.key}
                title={timeParser(diningList.key)}
              >
                {diningList.value.map((dining) => (
                  <OrderDining
                    vModel={this.selector[dining._id]}
                    data={dining}
                    onChange={this.refreshError.bind(this)}
                  />
                ))}
              </cube-scroll-nav-panel>
            ))}
          </cube-scroll-nav>
        </div>
        <div class='order-footer' Slot='footer'>
          <div
            class='order-footer-error'
            style={{
              transform: this.errorText ? 'translateY(0%)' : 'translateY(100%)',
              opacity: this.errorText ? 1 : 0,
            }}
          >
            {this.errorText}
          </div>
          <div class='bg' />
          <div class='order-footer-wrap'>
            <div
              class='order-footer-text-btn'
              onclick={() => this.selectAllBuffet()}
            >
              全自助
            </div>
            <div
              class='order-footer-text-btn'
              onclick={() => this.selectAllRandom()}
            >
              随机选
            </div>
            <button
              class={{ submit: true, submit_disable: this.submitDisable }}
              onclick={this.submit.bind(this)}
            >
              下单
            </button>
          </div>
        </div>
      </ChildPageConstruction>
    );
  }
  // getter

  protected get scrollNavBarLabels() {
    return _(this.list)
      .map((item) => item.key)
      .value();
  }
  protected get scrollNavBarTxts() {
    return _(this.list)
      .map((item) => getDay(item.key))
      .value();
  }
  protected get scrollNavBarCurrent() {
    return getDay(this.current);
  }
  protected get submitDisable() {
    return _.some(this.selector, (item) => !item);
  }
  // events
  protected mounted() {
    const list = this.$store.state.order.list;
    const selector: { [key: string]: string | null } = {};
    const timeGroup: { [key: string]: IStoreDining[] } = {};
    // 手工整理，不使用lodash
    // 先整理出 time: IStoreDining 的形势
    for (const item of list) {
      const pickTime = moment(item.pick_start);
      const pickTimeName = pickTime.format('YYYY-MM-DD');
      selector[item._id] = null;
      if (!timeGroup?.[pickTimeName]?.push(item)) {
        timeGroup[pickTimeName] = [item];
      }
    }
    // 然后使用这个形式整理成 {time, dining[]}[] 的形式
    this.list = Object.keys(timeGroup).map((key) => ({
      key,
      value: timeGroup[key],
    }));
    this.selector = selector;
    (this.$refs.cubeScrollNav as any).refresh();
    this.refreshError();
  }
  // method
  private selectAllBuffet() {
    const regex = /自助/g;
    this.list.forEach(({ value }) => {
      value.forEach((dining) => {
        const menuBuffet = dining.menu.filter((str) => regex.test(str.title));
        if (menuBuffet.length > 0) {
          this.selector[dining._id] = menuBuffet[0]._id;
        }
      });
    });
  }
  private selectAllRandom() {
    this.list.forEach(({ value }) => {
      value.forEach((dining) => {
        const index = Math.floor(dining.menu.length * Math.random());
        this.selector[dining._id] = dining.menu[index]._id;
      });
    });
  }
  private submit() {
    if (_.some(this.selector, (item) => !item)) {
      return false;
    }
    const ids: Array<{ diningId: string; menuId: string }> = _.map(
      this.selector,
      (item, key) => {
        return {
          diningId: String(item),
          menuId: key,
        };
      },
    );

    this.$createDialog({
      type: 'confirm',
      title: '下单',
      content: '请确认下单内容正确，下单后不可更改',
      icon: 'cubeic-alert',
      onConfirm: async () => {
        const res = await orderDishes(ids);
        if (res.code === 200) {
          await this.$router.replace({
            name: ROUTER_NAME.APP_INDEX,
          });
        } else {
          const toast = this.$createToast({
            txt: res.msg,
            mask: true,
            timeout: 3000,
          });
          toast.show();
        }
      },
    }).show();
  }

  private changeHandler(label: any) {
    this.current = label;
  }
  private refreshList() {
    // 由于 vue 的更新机制原因，这里主动使用 set 告诉 vue 需要更新 list
    this.$set(this, 'list', Array.from(this.list));
    (this.$refs.cubeScrollNav as any).refresh();
  }
  private refreshError() {
    for (const { value } of this.list) {
      for (const item of value) {
        if (!this.selector[item._id]) {
          this.errorText = `${timeMMDD(item.pick_start)}尚未选择`;
          return;
        }
      }
    }
    this.errorText = '';
  }
}
