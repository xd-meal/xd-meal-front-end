import { orderDishes } from '@/api/menu';
import OrderTopDate from '@/components/app/v2/order/OrderTopDate';
import OrderV2 from '@/components/app/v2/order/OrderV2';
import { filterMenuList, IRule } from '@/components/utils/filter';
import { getMenuGroupBy } from '@/components/utils/group';
import { timeMMDD } from '@/components/utils/time';
import { ROUTER_NAME } from '@/router';
import './Limit.scss';
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

  public resetList() {
    const orderSelect = this.$store.getters[
      MENU_NAMESPACE + MENU.ORDER_SELECT_MAP
    ];
    const list = this.$store.getters[ORDER_NAMESPACE + ORDER.ORDER_LIMIT_LIST];
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
  }

  private render(): VNode {
    const listeners = {
      'update:selector': (val: { [key: string]: string | null }) => {
        this.selector = val;
      },
    };
    return (
      <div class='limit-order'>
        <OrderV2
          list={this.list}
          selector={this.selector}
          {...{ on: listeners }}
          title='限量菜品'
          ref='Orderv2'
        >
          <div Slot='footer'>
            <div
              class='limit-submit-btn btn'
              onclick={this.submit.bind(this)}
            />
          </div>
        </OrderV2>
      </div>
    );
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
            this.$router.replace({ name: ROUTER_NAME.TAB_WRAP });
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
}
