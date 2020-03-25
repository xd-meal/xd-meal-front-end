import { IMyDining } from '@/api/menu';
import { getTimeName } from '@/components/utils/diningTime';
import { getMenuGroupBy } from '@/components/utils/group';
import { timeParser } from '@/components/utils/time';
import { ROUTER_NAME } from '@/router';
import { MENU, MENU_NAMESPACE } from '@/store/menu';
import { VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import '@/components/app/v2/index/IndexWrap.scss';
import IndexPanel from '@/components/app/v2/index/IndexPanel';
export interface IIndexMyDining extends IMyDining {
  timeTile: string;
}
@Component({
  components: {
    IndexPanel,
  },
})
export default class IndexWrap extends tsx.Component<any> {
  protected list: Array<{
    key: string;
    value: IIndexMyDining[];
  }> = [];

  private render(): VNode {
    return (
      <div class='v2-main_index'>
        {this.list.map((_) =>
          _.value.map((v) => <IndexPanel dining={v} time={_.key} />),
        )}
        {this.orderBtnShow && (
          <div class='v2-main_order-link' data-for-test='orderBtn'>
            <router-link
              class='order-btn'
              to={{ name: ROUTER_NAME.APP_ORDER_V2 }}
            >
              <span class='order-icon' />
            </router-link>
          </div>
        )}
      </div>
    );
  }
  protected get menus(): IMyDining[] {
    return this.$store.state.menu.list;
  }
  protected get orderBtnShow() {
    return this.$store.state.order.list.length > 0;
  }
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
}
