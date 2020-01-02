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
    return (
      <div class='menu-checkbox dining'>
        <div class='menu-title'>{this.data && getTimeName(this.data)}</div>
        {this.data?.menu.map((menu: IStoreDish) => (
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
            <div class='menu-checkbox-wrap'>
              {menu.desc.split(/[,，]/).map((str) => (
                <div class='menu-checkbox-desc'>{str}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
}
