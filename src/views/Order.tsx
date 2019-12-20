import './Order.scss';
import { ROUTER_NAME } from '@/router';

import _ from 'lodash';
import { VNode } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

import { getDay, timeParser, timeMMDD } from '@/components/utils/time.ts';

import { MENU_TIME_TYPE } from '@/store/menu';
import {
  IOrderSingleItem,
  MENU_TYPE,
  ORDER,
  ORDER_NAMESPACE,
} from '@/store/order';

import { orderDishes } from '@/api/menu.ts';

import ChildPageConstruction from '@/components/utils/ChildPageConstruction';
import CommonHeader from '@/components/utils/CommonHeader';

export interface IOrderSingleItemWithChecked extends IOrderSingleItem {
  checked?: boolean;
}

@Component({
  components: {
    ChildPageConstruction,
    CommonHeader,
  },
})
export default class Order extends tsx.Component<any> {
  // protected orderList: IOrderSingleItemWithChecked[] = [];
  protected list: Array<{
    key: string;
    value: IOrderSingleItemWithChecked[];
  }> = [];
  protected current: any = null;
  protected errorText: string = '';

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
            // current={this.current}
            onChange={this.changeHandler}
            ref='cubeScrollNav'
            // onSticky-change={this.stickyChangeHandler}
          >
            <cube-scroll-nav-bar
              labels={this.scrollNavBarLabels}
              slot='bar'
              current={this.current}
              txts={this.scrollNavBarTxts}
              direction='vertical'
            />

            {this.list.map((item) => (
              <cube-scroll-nav-panel
                key={item.key}
                label={item.key}
                title={timeParser(item.key)}
              >
                {_(item.value)
                  .groupBy('type')
                  .map(
                    (
                      dayMenus: IOrderSingleItemWithChecked[],
                      key: MENU_TIME_TYPE,
                    ) => {
                      return (
                        <div>
                          {key === MENU_TIME_TYPE.LUNCH && (
                            <div class='menu-title'>午餐</div>
                          )}
                          {key === MENU_TIME_TYPE.DINNER && (
                            <div class='menu-title'>晚餐</div>
                          )}
                          {/*先这样写以后有空在拆分*/}
                          {dayMenus.map(
                            (dayMenu: IOrderSingleItemWithChecked) => {
                              return (
                                <div
                                  class='menu-checkbox'
                                  onclick={this.toggleDayMenu.bind(
                                    this,
                                    dayMenu,
                                    dayMenus,
                                  )}
                                >
                                  <div class='menu-checkbox-wrap'>
                                    <div class='menu-checkbox-title'>
                                      {dayMenu.title}
                                    </div>
                                    <div
                                      class={
                                        'menu-checkbox-check' +
                                        (dayMenu.checked
                                          ? ' menu-checkbox-check_active'
                                          : '')
                                      }
                                    >
                                      {dayMenu.checked}
                                    </div>
                                  </div>
                                  <div class='menu-checkbox-wrap'>
                                    {dayMenu.desc.split(/[,，]/).map((str) => (
                                      <div class='menu-checkbox-desc'>
                                        {str}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            },
                          )}
                        </div>
                      );
                    },
                  )
                  .value()}
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
    if (this.list.length <= 0) {
      return true;
    }
    // tslint:disable-next-line:forin
    for (const key in this.list) {
      const item = this.list[key];
      const group = _.groupBy(item.value, 'type');
      // tslint:disable-next-line:forin
      for (const type in group) {
        const flag = group[type].some(
          (value: IOrderSingleItemWithChecked) => value.checked,
        );
        if (!flag) {
          this.errorText = `${timeMMDD(item.key)}尚未选餐`;
          return true;
        }
      }
    }
    this.errorText = '';
    return false;
  }
  // events
  protected mounted() {
    this.$store.dispatch(ORDER_NAMESPACE + ORDER.FETCH_ORDER_DISHES_ACTION);
  }
  // method
  private selectAllBuffet() {
    _.forEach(this.list, (day) => {
      _(day.value)
        .groupBy('type')
        .forEach((list: IOrderSingleItemWithChecked[], type: string) => {
          _.forEach(list, (item: IOrderSingleItemWithChecked) => {
            if (item.menuType === MENU_TYPE.BUFFE) {
              item.checked = true;
            } else {
              item.checked = false;
            }
          });
        });
    });
    this.refreshList();
  }
  private selectAllRandom() {
    _.forEach(this.list, (day) => {
      _(day.value)
        .groupBy('type')
        .forEach((list: IOrderSingleItemWithChecked[]) => {
          const index = Math.floor(list.length * Math.random());
          list.forEach((item) => (item.checked = false));
          list[index].checked = true;
        });
    });
    this.refreshList();
  }
  private submit() {
    const ids = _(this.list)
      .map(({ value }) => value)
      .flatten()
      .filter((item: IOrderSingleItemWithChecked) => item.checked || false)
      .map((item: IOrderSingleItemWithChecked) => item.id)
      .value();

    this.$createDialog({
      type: 'confirm',
      title: '下单',
      content: '请确认下单内容正确，下单后不可更改',
      icon: 'cubeic-alert',
      onConfirm: async () => {
        const res = await orderDishes(ids);
        if (res.code === 200) {
          this.$router.replace({
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
  private toggleDayMenu(
    dayMenu: IOrderSingleItemWithChecked,
    dayMenus: IOrderSingleItemWithChecked[],
  ) {
    dayMenus.forEach((item) => {
      item.checked = false;
    });
    dayMenu.checked = true;
    this.refreshList();
  }
  private refreshList() {
    // 由于 vue 的更新机制原因，这里主动使用 set 告诉 vue 需要更新 list
    this.$set(this, 'list', Array.from(this.list));
    (this.$refs.cubeScrollNav as any).refresh();
  }
  // watch
  @Watch('$store.state.order.list')
  private onStoreOrderChanged(newVal: IOrderSingleItem[]) {
    const transferList = _(newVal)
      // 先添加需要用来选内容的
      .map(
        (item) => ({ ...item, selected: false } as IOrderSingleItemWithChecked),
      )
      // 然后分组
      .groupBy('time')
      .value();
    this.list = _(transferList)
      .map((value, key) => ({ value, key }))
      .value();
    (this.$refs.cubeScrollNav as any).refresh();
  }
}
