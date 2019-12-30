import { createDining, getDishList, IDining } from '@/api/admin';
import AdminAddDishDialog, {
  IAdminDing,
} from '@/components/admin/AdminAddDishDialog';
import {
  QBtn,
  QSelect,
  QIcon,
  QDate,
  QPopupProxy,
  QInput,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
} from 'quasar';
import moment from 'moment';
import { VNode } from 'vue';
import lodash from 'lodash';

import { Component, Vue } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

import CsvInput from '@/components/admin/CsvInput.tsx';
import AdminDishDialog from '@/components/admin/AdminDishDialog';
import AdminTimeSelect from '@/components/admin/AdminTimeSelect';
export interface IAdminDish {
  _id: string;
  title: string;
  desc: string;
}
export interface IAdminDishSelectOption {
  label: string;
  value: IAdminDish;
}

@Component({
  components: {
    CsvInput,
    AdminDishDialog,
    QBtn,
    QSelect,
    AdminTimeSelect,
    QIcon,
    QDate,
    QPopupProxy,
    QInput,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
  },
})
export default class AdminImport extends tsx.Component<any> {
  protected title: string = '';
  protected dishes: IAdminDishSelectOption[] = [];

  protected orderStartTime: string = moment().format('YYYY/MM/DD HH:mm');
  protected orderEndTime: string = moment().format('YYYY/MM/DD HH:mm');

  protected pickTime: { label: string; value: any[] } | null = null;
  protected pickDate: string | null = null;
  protected menu: IAdminDish[] = [];
  protected timeOption = [
    { label: '早餐', value: ['08:00', '10:00', 0] },
    { label: '午餐', value: ['10:00', '13:30', 1] },
    { label: '晚餐', value: ['17:00', '18:30', 1] },
  ];

  private render(): VNode {
    return (
      <div style={{ textAlign: 'left' }}>
        <h3
          class='title text-h3'
          style={{ borderBottom: '1px solid #ccc', marginBottom: '20px' }}
        >
          创建餐次
        </h3>
        <div>
          <div class='q-mb-md'>
            <q-input filled vModel={this.title} label='标题' />
          </div>
          <div class='text-h5 q-mb-xs'>订餐开始时间</div>

          <div>
            <AdminTimeSelect vModel={this.orderStartTime} />
            <span style='margin: 0 16px;display: inline-block;' />
            <AdminTimeSelect vModel={this.orderEndTime} />
          </div>
          <div class='text-h5 q-mb-sm'>取餐时间</div>
          <div class='q-mb-sm' style='display: flex;'>
            <q-input
              style='width: 300px;'
              filled
              vModel={this.pickDate}
              label='选择时间'
            >
              <template slot='prepend'>
                <q-icon name='event' className='cursor-pointer'>
                  <q-popup-proxy
                    transition-show='scale'
                    transition-hide='scale'
                  >
                    <q-date vModel={this.pickDate} mask='YYYY-MM-DD' />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-select
              style='width: 300px;'
              filled
              vModel={this.pickTime}
              use-input
              input-debounce='10'
              label='选择时间'
              options={this.timeOption}
            />
          </div>
          <div class='q-mb-sm'>
            <div class='text-h5 q-mb-sm'>菜品列表</div>
            {this.menu.length > 0 && (
              <q-list bordered separator>
                {this.menu.map((item, index) => (
                  <q-item clickable>
                    <q-item-section>
                      <div style='display: flex; align-item: center;'>
                        <div> 菜品名称：</div>
                        <div>
                          {item.title}({item._id})
                        </div>
                        <div>
                          <q-icon
                            name='cancel'
                            onClick={this.deleteFromMenu.bind(this, index)}
                          />
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>
                ))}
              </q-list>
            )}
          </div>
          <div>
            <q-btn
              flat
              label='新建菜品'
              color='primary'
              onClick={this.showCreateDish.bind(this)}
            />
            <q-btn
              flat
              label='选择菜品'
              color='primary'
              onClick={() =>
                (this.$refs.adminAddDialog as AdminAddDishDialog).show({
                  menu: this.menu,
                })
              }
            />
          </div>
          <div>
            <q-btn
              flat
              label='确认新建'
              color='primary'
              onClick={this.createDining.bind(this)}
            />
          </div>
        </div>

        <AdminDishDialog
          ref='createDishDialog'
          onCreateSuccess={this.addToList.bind(this)}
        />
        <AdminAddDishDialog
          ref='adminAddDialog'
          list={this.dishesValue}
          onAdd={this.diningAddDish.bind(this)}
        />
      </div>
    );
  }
  private diningAddDish(dish: IAdminDish, now: IDining) {
    this.menu.push(dish);
  }
  private get dishesValue() {
    return this.dishes.map((_) => _.value);
  }
  private async loadDishes() {
    const res = await getDishList();
    if (res.code === 200) {
      this.dishes = res.data.map((dish: IAdminDish) => ({
        label: dish.title,
        value: dish,
      }));
    }
  }
  private addToList(value: IAdminDish) {
    this.dishes.push({
      value,
      label: value.title,
    });
  }
  private deleteFromMenu(index: number) {
    this.menu.splice(index, 1);
  }
  private async mounted() {
    this.$q.loading.show({
      message: '正在请求重要数据请勿关闭浏览器',
    });
    await this.loadDishes();
    this.$q.loading.hide();
  }
  private get dining(): IDining {
    let pickTimeValue = [0, 0];
    if (this.pickTime?.value) {
      pickTimeValue = this.pickTime.value;
    }
    return {
      title: this.title,
      order_start: moment(this.orderStartTime).unix() * 1000,
      order_end: moment(this.orderEndTime).unix() * 1000,
      pick_start: moment(`${this.pickDate} ${pickTimeValue[0]} `).unix() * 1000,
      pick_end: moment(`${this.pickDate} ${pickTimeValue[1]} `).unix() * 1000,
      stat_type: 0,
      menu: this.menu.map((item) => item._id),
    };
  }
  private async createDining() {
    if (!this.pickTime) {
      return;
    }
    const res = await createDining(this.dining);
    if (res.code === 200) {
      this.$q.notify({
        color: 'white',
        textColor: 'primary',
        position: 'top',
        message: '创建成功',
      });
    } else {
      this.$q.notify({
        color: 'white',
        textColor: 'negative',
        position: 'top',
        message: res.msg || '未知错误',
      });
    }
  }
  private showCreateDish() {
    (this.$refs.createDishDialog as AdminDishDialog).show();
  }
}
