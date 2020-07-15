import { fetchDiningRoll, updateDiningRoll } from '@/api/menu';
import OrderV2 from '@/components/app/v2/order/OrderV2';
import { getMenuGroupBy } from '@/components/utils/group';
import { ROUTER_NAME } from '@/router';
import '@/components/app/v2/order/Limited.scss';
import { IStoreDining, ORDER, ORDER_NAMESPACE } from '@/store/order';
import { some, mapValues, isNull } from 'lodash';
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
  protected selector: { [key: string]: string } = {};

  public async resetList() {
    const rolls = (await fetchDiningRoll()).data;
    const list = this.$store.getters[ORDER_NAMESPACE + ORDER.ORDER_LIMIT_LIST];
    this.list = getMenuGroupBy(list);
    const selector: { [key: string]: string } = {};
    // 生成选项列表
    for (const item of list) {
      selector[item._id] = rolls[item._id] || '';
    }
    this.selector = selector;
  }
  public async mounted() {
    await this.$store.dispatch(
      ORDER_NAMESPACE + ORDER.FETCH_ORDER_DISHES_ACTION,
    );
    await this.resetList();
  }

  private render(): VNode {
    const listeners = {
      'update:selector': (val: { [key: string]: string | null }) => {
        this.selector = mapValues(val, (v) => (isNull(v) ? '' : v));
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
          optional={false}
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

    this.$createDialog({
      type: 'confirm',
      content:
        '<span class="dialog-pc-order">确定选好了所有的想要恰的饭饭了嘛<br>( • ̀ω•́ )✧</span>',
      icon: 'cubeic-alert',
      onConfirm: async () => {
        const res = await updateDiningRoll(
          mapValues(this.selector, (v) => (v === '' ? false : v)),
        );
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
                menu: 2,
              },
            });
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
