import { getTimeName } from '@/components/utils/diningTime';
import { IStoreDining, IStoreDish } from '@/store/order';
import { VNode } from 'vue';
import { Component, Prop, Model } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
@Component
export default class OrderDining extends tsx.Component<any> {
  @Model('change')
  protected value: string | null = null;
  @Prop({
    required: true,
  })
  protected data!: IStoreDining;
  private render(): VNode {
    const dataMenu: IStoreDish[] = this.data?.menu ?? [];
    return (
      <div class='menu-checkbox dining'>
        <div class='menu-title'>{this.data && getTimeName(this.data)}</div>
        {dataMenu.map((menu: IStoreDish) => (
          <div class='menu-checkbox'>
            <div class='menu-checkbox-wrap'>
              <div class='menu-checkbox-title'>{menu.title}</div>
              <div
                class={{
                  'menu-checkbox-check': true,
                  'menu-checkbox-check_active': menu._id === this.value,
                }}
                onClick={() => this.$emit('change', menu._id)}
              />
            </div>
            {/自助/g.test(menu.title) && (
              <div class='menu-checkbox-wrap buffet'>
                {menu.desc.split(/[,，]/).map((str) => (
                  <div class='menu-checkbox-desc'>{str}</div>
                ))}
              </div>
            )}
            {menu.supplier && (
              <div class='menu-supplier'>供应商：{menu.supplier}</div>
            )}
          </div>
        ))}
      </div>
    );
  }
}
