import '@/components/app/v2/order/OrderBodyDining.scss';
import { getTimeNameV2 } from '@/components/utils/diningTime';
import { timeParser } from '@/components/utils/time';
import { IStoreDining, IStoreDish } from '@/store/order';
import { VNode } from 'vue';
import { Component, Model, Prop } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
@Component
export default class OrderBodyDining extends tsx.Component<any> {
  @Model('change')
  protected value!: string | null;
  @Prop({
    required: true,
  })
  protected data!: IStoreDining;
  @Prop({
    required: true,
  })
  protected time!: string;
  @Prop({
    required: true,
  })
  protected index!: number;
  @Prop({
    required: true,
  })
  protected optional!: boolean;
  private checkboxChange(menu: IStoreDish) {
    if (this.optional && this.value === menu._id) {
      this.$emit('change', null);
      return;
    }
    this.$emit('change', menu._id);
  }
  private render(): VNode {
    const dataMenu: IStoreDish[] = this.data?.menu ?? [];
    const names = getTimeNameV2(this.data);
    return (
      <div
        class='order-body-dining'
        data-for-test={`dining`}
        data-for-test-diningId={this.data._id}
      >
        {this.index === 0 && (
          <div class='order-body-dining_date-time'>
            <i class='date_time' />
            <span>{timeParser(this.time)}</span>
          </div>
        )}

        <div class='order-body-dining_title'>
          {this.data.title}
          {/*{this.data && names && names.length >= 2 && (*/}
          {/*  <div>*/}
          {/*    {names[0] && <span class='name'>{names[0]}</span>}*/}
          {/*    <span>{names[1]}</span>*/}
          {/*  </div>*/}
          {/*)}*/}
        </div>
        {dataMenu.map((menu) => {
          const didLimit = menu.limit && menu.limit > 0;
          return (
            <div
              class='order-body-dining_checkbox'
              data-for-test={`diningCheckbox`}
              data-for-test-menuId={menu._id}
              onClick={() => this.checkboxChange(menu)}
            >
              <div
                class={{
                  'order-body-dining_checkbox-wrap': true,
                  'order-body-dining_checkbox-wrap_limited': didLimit,
                }}
              >
                <div class='order-body-dining_checkbox-title'>
                  {didLimit ? menu.title : menu.title}
                </div>
                <div
                  class={{
                    'order-body-dining_check': true,
                    'order-body-dining_check_active': menu._id === this.value,
                  }}
                >
                  <span class='circle' />
                  <span class='active-icon' />
                </div>
              </div>
              <div class='order-body-dining_wrap'>
                <div class='order-body-dining_desc'>
                  {didLimit ? menu.desc : menu.desc}
                </div>
              </div>
              {!didLimit && menu.supplier && (
                <div class='order-body-dining_supplier'>
                  供应商：{menu.supplier}
                </div>
              )}
            </div>
          );
        })}
        <div class='line-split' />
      </div>
    );
  }
}
