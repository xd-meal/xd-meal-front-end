import { orderDishes, updateDiningRoll } from '@/api/menu';
import OrderTopDate from '@/components/app/v2/order/OrderTopDate';
import OrderV2 from '@/components/app/v2/order/OrderV2';
import { getMenuGroupBy } from '@/components/utils/group';
import { ROUTER_NAME } from '@/router';
import '@/components/app/v2/order/Limited.scss';
import { MENU, MENU_NAMESPACE } from '@/store/menu';
import { IStoreDining, ORDER, ORDER_NAMESPACE } from '@/store/order';
import { map, some } from 'lodash';
import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
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
            <div class='limit-submit-btn btn' onclick={this.submit.bind(this)}>
              参与活动
            </div>
          </div>
        </OrderV2>
      </div>
    );
  }

  private submit() {
    // 注意允许不参与任何一餐，所以这里将不会给予跳转但是会预留提示位置

    let didAllSelected = true;
    // tslint:disable-next-line:forin
    for (const key in this.selector) {
      const item = this.selector[key];
      if (!item) {
        didAllSelected = false;
      }
    }
    if (didAllSelected) {
      // todo: tip
    }
    const ids = map(this.selector, (item, key) => {
      return {
        dining: key,
        meal: String(item),
        join: true,
      };
    });

    this.$createDialog({
      type: 'confirm',
      content:
        '<span class="dialog-pc-order">确定选好了所有的想要恰的饭饭了嘛<br>( • ̀ω•́ )✧</span>',
      icon: 'cubeic-alert',
      onConfirm: async () => {
        const res = await updateDiningRoll(ids);
        if (res.code === 200) {
          (this.$refs.Orderv2 as OrderV2).setFadeOutAnimate(true);
          this.$nextTick(() => {
            this.$router.replace({ name: ROUTER_NAME.TAB_WRAP });
          });
        } else {
          this.$createToast({
            txt: res.msg,
            mask: true,
            timeout: 3000,
          }).show();
        }
      },
    }).show();
  }
}
