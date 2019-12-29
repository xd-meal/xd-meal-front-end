import { IAdminDish } from '@/components/admin/AdminImport';
import { getTimeName } from '@/components/utils/diningTime';
import { VNode } from 'vue';
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import {
  QSeparator,
  QCardActions,
  QCard,
  QCardSection,
  QIcon,
  QBtn,
} from 'quasar';
@Component({
  components: { QSeparator, QCardActions, QCard, QCardSection, QIcon, QBtn },
})
export default class AdminDiningCard extends tsx.Component<any> {
  @Prop({ required: true }) protected data!: {
    _id: string;
    title: string;
    order_start: string;
    order_end: string;
    pick_start: string;
    pick_end: string;
    stat_type: 1;
    menu: IAdminDish[];
    createTime: string;
    updateTime: string;
  };
  private render(): VNode {
    return (
      <q-card className='bg-primary text-white' flat bordered>
        <q-card-section>
          <div class='text-h6'>
            {this.data.title}({getTimeName(this.data)})
          </div>
        </q-card-section>

        <q-card-section>
          {this.data.menu.map((dish, index) => (
            <div style='display: flex;align-item: center;margin: 8px 0;'>
              <div>{index}.</div>
              <div style='margin: 0 20px; width: 110px;'>{dish.title}</div>
              <q-icon name='cancel' />
            </div>
          ))}
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn
            color='negative'
            bordered
            flat
            onClick={() => this.$emit('delete', this.data)}
          >
            删除餐次
          </q-btn>
          <q-btn
            color='primary'
            bordered
            flat
            onClick={() => this.$emit('add')}
          >
            添加菜品
          </q-btn>
        </q-card-actions>
      </q-card>
    );
  }
}
