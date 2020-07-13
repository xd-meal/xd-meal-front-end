import { orderDishes } from '@/api/menu';
import OrderTopDate from '@/components/app/v2/order/OrderTopDate';
import OrderV2 from '@/components/app/v2/order/OrderV2';
import { filterMenuList, IRule } from '@/components/utils/filter';
import { getMenuGroupBy } from '@/components/utils/group';
import { timeMMDD } from '@/components/utils/time';
import { ROUTER_NAME } from '@/router';
import { MENU, MENU_NAMESPACE } from '@/store/menu';
import {
  IStoreDining,
  IStoreDish,
  ORDER,
  ORDER_NAMESPACE,
} from '@/store/order';
import { chain, map, some } from 'lodash';
import { VNode } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
@Component({
  components: { OrderV2 },
})
export default class Limited extends tsx.Component<any> {
  protected get submitDisable() {
    return some(this.selector, (item) => !item);
  }
  // 数据相关
  protected list: Array<{
    key: string;
    value: IStoreDining[];
  }> = [];
  protected selector: { [key: string]: string | null } = {};

  private extra = false;
  // 按钮相关
  private randomBtn: boolean = false;
  private allBuffetBtn: boolean = false;
  private allRandom: boolean = false;
  private allBuffeted: boolean = false;

  // 随机选饭规则列表
  private randomRules: Array<string | IRule> = [];

  // 错误提示信息
  private errorText: string = '';

  // 随机选饭相关
  private randomForNoSpicy: boolean = false;
  private randomForEmpty: boolean = false;
  public resetList() {
    const orderSelect = this.$store.getters[
      MENU_NAMESPACE + MENU.ORDER_SELECT_MAP
    ];
    let list = this.$store.getters[ORDER_NAMESPACE + ORDER.ORDER_NORMAL_LIST];
    if (!this.extra) {
      list = list.filter((item: IStoreDining) => !/加班/.test(item.title));
    }
    this.list = getMenuGroupBy(list);
    const selector: { [key: string]: string | null } = {};
    // 生成选项列表
    for (const item of list) {
      selector[item._id] = orderSelect[item._id] || null;
    }
    this.selector = selector;
  }
  public async mounted() {
    await this.$store.dispatch(
      ORDER_NAMESPACE + ORDER.FETCH_ORDER_DISHES_ACTION,
    );
    this.resetList();
    this.resetButton();
    // 设置错误提示信息
    this.refreshError();
  }

  private render(): VNode {
    const listeners = {
      'update:list': (val: Array<{ key: string; value: IStoreDining[] }>) => {
        this.list = val;
      },
      'update:selector': (val: { [key: string]: string | null }) => {
        this.selector = val;
      },
    };
    return (
      <div class='normal-order'>
        <OrderV2
          onDiningChange={this.refreshError.bind(this)}
          list={this.list}
          selector={this.selector}
          {...{ on: listeners }}
          ref='Orderv2'
        >
          <div
            Slot='btns'
            class={{
              'v2-order_header_extra': true,
              'v2-order_header_extra_active': this.extra,
            }}
            onClick={this.toggleExtra.bind(this)}
          >
            加班
          </div>
          <div
            Slot='footer'
            class={{
              'v2-order_footer': true,
              'no-error': !this.errorText,
            }}
          >
            <div class='v2-order_footer_error-text'>{this.errorText}</div>
            <div class='v2-order_buttons'>
              <div class='v2-order_buttons-wrap'>
                <div class='v2-order_buttons-right'>
                  {this.allBuffetBtn && (
                    <div
                      class={{
                        'v2-order_buttons_button': true,
                        'v2-order_buttons_button_active': this.allBuffeted,
                      }}
                      onclick={this.selectAllBuffet.bind(this)}
                    >
                      <button class='v2-order_buttons-checkbox' role='button' />
                      <div class='v2-order_buttons-label' role='note'>
                        全自助
                      </div>
                    </div>
                  )}
                  {this.randomBtn && (
                    <div
                      class={{
                        'v2-order_buttons_button': true,
                        'v2-order_buttons_button_active': this.allRandom,
                      }}
                      onclick={this.selectAllRandom.bind(this)}
                    >
                      <button class='v2-order_buttons-checkbox' role='button' />
                      <div class='v2-order_buttons-label' role='note'>
                        随机选
                      </div>
                    </div>
                  )}
                </div>
                <div
                  class={{
                    'v2-order_buttons-left': true,
                    'v2-order_buttons-left_disable': this.submitDisable,
                  }}
                  role='button'
                >
                  <div
                    class='v2-order_buttons-left-text'
                    onclick={this.submit.bind(this)}
                    data-for-test='orderSubmit'
                  >
                    提交
                  </div>
                </div>
              </div>
            </div>
          </div>
        </OrderV2>
      </div>
    );
  }

  private toggleExtra() {
    this.extra = !this.extra;
    // 单独实现，防止点击加班餐后刷新掉列表
    let list = this.$store.getters[ORDER_NAMESPACE + ORDER.ORDER_NORMAL_LIST];
    if (!this.extra) {
      list = list.filter((item: IStoreDining) => !/加班/.test(item.title));
    }
    this.list = getMenuGroupBy(list);
    const selector: { [key: string]: string | null } = {};
    // 生成选项列表
    for (const item of list) {
      selector[item._id] = this.selector[item._id] || null;
    }
    this.selector = selector;
    (this.$refs.Orderv2 as OrderV2).resetTime();
  }

  private selectAllRandom() {
    this.allRandom = true;
    this.list.forEach(({ value }) => {
      value.forEach((dining) => {
        const menu = filterMenuList(dining.menu, this.randomRules);
        const index = Math.floor(menu.length * Math.random());
        this.selector[dining._id] = menu[index]._id;
      });
    });
    this.refreshError();
    this.refreshBuffeted();
  }
  private selectAllBuffet() {
    const regex = /自助/;
    let count = 0;
    this.list.forEach(({ value }) => {
      value.forEach((dining) => {
        const menuBuffet = dining.menu.filter((str) => regex.test(str.title));
        if (menuBuffet.length > 0) {
          count++;
          // 如果之前是选过的，把所有的自助餐全部反选
          if (this.allBuffeted) {
            this.selector[dining._id] = null;
          } else {
            this.selector[dining._id] = menuBuffet[0]._id;
          }
        }
      });
    });
    // 如果没有任何一项被选中，说明就没有自助餐，什么都不操作
    if (count !== 0) {
      this.allBuffeted = !this.allBuffeted;
    }
    this.refreshError();
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

  private refreshBuffeted() {
    const regex = /自助/;
    const allMenus: { [key: string]: IStoreDish } = chain(this.list)
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
    // tslint:disable-next-line:forin
    for (const key in this.selector) {
      const item = this.selector[key];
      if (!item) {
        for (const ll of this.list) {
          for (const singleMenu of ll.value) {
            if (singleMenu._id === key) {
              // 跳转到指定位置
              (this.$refs.Orderv2 as OrderV2).activeTimeChange(ll.key);
              this.$nextTick(() => {
                (this.$refs.OrderTopDate as OrderTopDate).reset();
              });
            }
          }
        }
        return false;
      }
    }
    const ids: Array<{ diningId: string; menuId: string }> = map(
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
          (this.$refs.Orderv2 as OrderV2).setFadeOutAnimate(true);
          this.$nextTick(() => {
            this.$store.dispatch(
              ORDER_NAMESPACE + ORDER.FETCH_ORDER_DISHES_ACTION,
            );
            // @ts-ignore
            this.$router.replace({
              name: ROUTER_NAME.TAB_WRAP,
              params: {
                menu: 0,
              },
            });
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
  private resetButton() {
    // 设置按钮显示
    const config = this.$store.state.user.config;
    this.randomBtn = config.randomBtn;
    this.allBuffetBtn = config.buffetBtn;
    this.randomForNoSpicy = config.randomForNoSpicy;
    this.randomForEmpty = config.randomForEmpty;
    // 设置随机规则
    if (this.randomForEmpty) {
      this.randomRules = [];
    } else {
      this.randomRules = ['NO_EMPTY'];
    }

    if (this.randomForNoSpicy) {
      this.randomRules.push('NO_SPICY');
    }
  }
}
