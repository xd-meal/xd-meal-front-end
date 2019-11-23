import './FoodSelect.scss';
import { IOrderSingleItemWithChecked } from '@/views/Order';
import { VNode } from 'vue';
import { MENU_TYPE } from '@/store/order';
import { Component, Prop } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import FoodCheckbox from './FoodCheckbox';
export interface FoodSelectProps {
  value: IOrderSingleItemWithChecked[];
}

@Component({
  components: {
    FoodCheckbox,
  },
})
export default class FoodSelect extends tsx.Component<FoodSelectProps> {
  @Prop() public value!: IOrderSingleItemWithChecked[];

  protected render(): VNode {
    return (
      <div class='food-select'>
        {this.normal.length > 0 && (
          <div class='food-select-normal'>
            <div class='food-select-title'>简餐</div>
            <div class='single'>
              {this.normal.map((item: IOrderSingleItemWithChecked) => (
                <FoodCheckbox
                  value={item}
                  onToggle={(value: boolean) => this.setItemCheck(item, value)}
                />
              ))}
            </div>
            {this.buffet.length > 0 && <div class='food-select-spliter' />}
          </div>
        )}
        {this.buffet.length > 0 && (
          <div class='food-select-buffet'>
            <div class='food-select-title'>自助餐</div>
            <div class='single'>
              {this.buffet.map((item: IOrderSingleItemWithChecked) => (
                <FoodCheckbox
                  value={item}
                  onToggle={(value: boolean) => this.setItemCheck(item, value)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  private setItemCheck(item: IOrderSingleItemWithChecked, value: boolean) {
    this.$emit('toggle', { item, value });
  }

  protected get normal() {
    if (!this.value) {
      return [];
    }
    return this.value.filter(
      (item: IOrderSingleItemWithChecked) => item.menuType === MENU_TYPE.NORMAL,
    );
  }
  protected get buffet() {
    if (!this.value) {
      return [];
    }
    return this.value.filter(
      (item: IOrderSingleItemWithChecked) => item.menuType === MENU_TYPE.BUFFE,
    );
  }
}
