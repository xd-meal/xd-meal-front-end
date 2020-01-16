import './Order.scss';
import { __ } from '@/components/app/ppx/textTransform';
import { getMenuGroupBy } from '@/components/utils/group';
import { ROUTER_NAME } from '@/router';

import _ from 'lodash';
import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

import { getDay, timeParser, timeMMDD } from '@/components/utils/time.ts';

import { IStoreDining, IStoreDish } from '@/store/order';

import { orderDishes } from '@/api/menu.ts';

import ChildPageConstruction from '@/components/utils/ChildPageConstruction';
import CommonHeader from '@/components/utils/CommonHeader';
import OrderDining from '@/components/app/order/OrderDining';

@Component({
  components: {
    ChildPageConstruction,
    CommonHeader,
    OrderDining,
  },
})
export default class Order extends tsx.Component<any> {
  protected list: Array<{
    key: string;
    value: IStoreDining[];
  }> = [];
  protected current: any = null;
  protected errorText: string = '';
  protected selector: { [key: string]: string | null } = {};
  protected randomBtn: boolean = false;
  protected allBuffetBtn: boolean = false;
  protected allRandomed: boolean = false;
  protected allBuffeted: boolean = false;
  protected render(): VNode {
    return (
      <ChildPageConstruction class='order'>
        <div class='order-header' Slot='header'>
          <CommonHeader
            Slot='header'
            title={this.isSpecial ? '加班餐' : '下周选饭'}
            goBackPath={{
              name: 'index',
            }}
          />
        </div>
        <div
          class={{
            'order-body': true,
            'order-body_empty': this.list.length === 0,
          }}
          Slot='context'
        >
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
                    onChange={this.diningChange.bind(this, dining)}
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
            <div class='order-footer-left'>
              {this.allBuffetBtn && (
                <div
                  class='order-footer-text-btn'
                  onclick={() => this.selectAllBuffet()}
                >
                  <span
                    class={{
                      'btn-checkbox': true,
                      'btn-checkbox_active': this.allBuffeted,
                    }}
                  />
                  <span>{__('全自助')}</span>
                </div>
              )}
              {this.randomBtn && (
                <div
                  class='order-footer-text-btn'
                  onclick={() => this.selectAllRandom()}
                >
                  <span
                    class={{
                      'btn-checkbox': true,
                      'btn-checkbox_active': this.allRandomed,
                    }}
                  />
                  <span>{__('随机选')}</span>
                </div>
              )}
            </div>
            <button
              class={{ submit: true, submit_disable: this.submitDisable }}
              onclick={this.submit.bind(this)}
            >
              {__('下单')}
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
    const config = this.$store.state.user.config;
    this.randomBtn = config.randomBtn;
    this.allBuffetBtn = config.buffetBtn;
    let list = this.$store.state.order.list;
    if (this.isSpecial) {
      list = list.filter((item: IStoreDining) => /加班/.test(item.title));
    } else {
      list = list.filter((item: IStoreDining) => !/加班/.test(item.title));
    }

    const selector: { [key: string]: string | null } = {};
    for (const item of list) {
      selector[item._id] = null;
    }
    this.list = getMenuGroupBy(list);
    this.selector = selector;
    (this.$refs.cubeScrollNav as any).refresh();
    this.refreshError();
  }
  private diningChange(dining: IStoreDining, value: string) {
    this.allRandomed = false;
    this.refreshBuffeted();
    this.refreshError();
  }
  // method
  private selectAllBuffet() {
    const regex = /自助/;
    this.list.forEach(({ value }) => {
      value.forEach((dining) => {
        const menuBuffet = dining.menu.filter((str) => regex.test(str.title));
        if (menuBuffet.length > 0) {
          // 如果之前是选过的，把所有的自助餐全部反选
          if (this.allBuffeted) {
            this.selector[dining._id] = null;
          } else {
            this.selector[dining._id] = menuBuffet[0]._id;
          }
        }
      });
    });
    this.allBuffeted = !this.allBuffeted;
    this.refreshError();
  }
  private selectAllRandom() {
    this.allRandomed = true;
    this.list.forEach(({ value }) => {
      value.forEach((dining) => {
        const index = Math.floor(dining.menu.length * Math.random());
        this.selector[dining._id] = dining.menu[index]._id;
      });
    });
    this.refreshError();
    this.refreshBuffeted();
  }
  private refreshBuffeted() {
    const regex = /自助/;
    const allMenus: { [key: string]: IStoreDish } = _(this.list)
      .map((v) => v.value.map((vv) => vv.menu))
      .flatten()
      .flatten()
      .mapKeys((v) => v._id)
      .value();
    // tslint:disable-next-line:forin
    for (const key in this.selector) {
      const s = this.selector[key];
      let title = '';
      if (s && allMenus[String(s)]?.title) {
        title = allMenus[String(s)]?.title;
      }
      if (!regex.test(title.toString())) {
        this.allBuffeted = false;
        return;
      }
    }
    this.allBuffeted = true;
  }

  private submit() {
    if (_.some(this.selector, (item) => !item)) {
      // 只要有没有选的就不让他提交
      return false;
    }
    const ids: Array<{ diningId: string; menuId: string }> = _.map(
      this.selector,
      (item, key) => {
        return {
          diningId: key,
          menuId: String(item),
        };
      },
    );

    this.$createDialog({
      type: 'confirm',
      content:
        '<span class="dialog-pc-order">确认要这样恰饭嘛？<br>( • ̀ω•́ )✧</span>',
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
  private get isSpecial() {
    return Boolean(this.$router.currentRoute.meta.isSpecial);
  }
}
