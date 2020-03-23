import Checkbox from '@/components/utils/Checkbox';
import { getTimeName } from '@/components/utils/diningTime';
import { timeParser } from '@/components/utils/time';
import { IStoreDining } from '@/store/order';
import { VNode } from 'vue';
import { Component, Prop, Model } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import './PcDining.scss';
@Component({
  components: {
    Checkbox,
  },
})
export default class PcDining extends tsx.Component<any> {
  @Prop()
  protected readonly data?: IStoreDining;
  @Model('change')
  protected value!: string;
  private render(): VNode {
    return (
      <section class='pc-day-menu'>
        <h3 class='pc-day-menu-title'>{this.name}</h3>
        {this?.data?.menu.map((dish) => {
          return (
            <div class='pc-single-check'>
              <div
                style={{
                  marginRight: '30px',
                  display: 'inline-block',
                  paddingTop: '3px',
                }}
              >
                <Checkbox
                  value={dish._id === this.value}
                  onChange={() => this.$emit('change', dish._id)}
                />
              </div>
              <div class='pc-single-check-wrap' style={{ lineHeight: '24px' }}>
                <div class='pc-single-check-text'>
                  <div class='pc-single-check-text-title'>{dish.title}</div>
                  <div class='pc-single-check-text-desc'>
                    {dish.desc}
                    {dish.supplier ? `(${dish.supplier})` : ''}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    );
  }
  private get name() {
    if (!this.data) {
      return '';
    }
    if (this.data.title) {
      return this.data.title;
    } else {
      return getTimeName(this.data) + timeParser(this.data.pick_start);
    }
  }
}
