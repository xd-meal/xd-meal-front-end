import './FoodCheckbox.scss';

import { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

import { IOrderSingleItemWithChecked } from '@/views/Order';

export interface FoodCheckboxProps {
  value: IOrderSingleItemWithChecked;
}
interface FoodCheckboxEvents {
  toggle: (value: boolean) => void;
}

/**
 * @class FoodCheckbox
 * @event toggle(value: bool)
 * @prop {IOrderSingleItemWithChecked} value
 */
@Component({})
export default class FoodCheckbox extends tsx.Component<
  FoodCheckboxProps,
  FoodCheckboxEvents
> {
  @Prop({ required: true }) public value!: IOrderSingleItemWithChecked;

  // method
  public onChecked() {
    this.$emit('toggle', !this.value.checked);
  }

  protected render(): VNode {
    return (
      <div class='food-checkbox' onClick={this.onChecked.bind(this)}>
        <div class='food-checkbox-content'>
          <div class='food-checkbox-title'>{this.value.title}</div>
          <div class='food-checkbox-subtitle'>{this.value.desc}</div>
        </div>
        <div class='food-checkbox-control'>
          <div class={this.foodCheckboxActiveClass}>
            <i class='cubeic-ok' />
          </div>
        </div>
      </div>
    );
  }
  // getter
  protected get checked() {
    return this.value.checked;
  }
  protected get foodCheckboxActiveClass() {
    return this.checked
      ? 'food-checkbox-check food-checkbox-check_active'
      : 'food-checkbox-check';
  }
}
