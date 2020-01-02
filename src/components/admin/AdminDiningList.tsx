import {
  deleteDining,
  getDiningByTime,
  getDishList,
  IDining,
  updateDining,
} from '@/api/admin';
import { IAdminDish } from '@/components/admin/AdminImport';
import { lawngreen } from 'color-name';
import {
  QDate,
  QSplitter,
  QTabPanel,
  QTabPanels,
  QPageScroller,
  QPageContainer,
  QScrollArea,
  QPage,
} from 'quasar';
import moment from 'moment';
import { VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import lodash from 'lodash';
import AdminAddDishDialog, {
  IAdminDing,
} from '@/components/admin/AdminAddDishDialog';
import AdminDiningCard from '@/components/admin/AdminDiningCard';
@Component({
  components: {
    QPageScroller,
    QPageContainer,
    QPage,
    QScrollArea,
    QDate,
    QSplitter,
    QTabPanels,
    QTabPanel,
    AdminDiningCard,
    AdminAddDishDialog,
  },
})
export default class AdminDiningList extends tsx.Component<any> {
  private date: string = '';
  private events: string[] = [];
  private monthList: { [key: string]: IAdminDing[] } = {};
  private dishes: IAdminDish[] = [];
  private month: number = 0;
  private year: number = 0;
  private render(): VNode {
    return (
      <div
        style={{
          height: '100%',
          position: 'absolute',
          padding: '0',
          width: '100%',
        }}
      >
        <div style='display: flex;height: 100%;'>
          <div style='text-align: left;margin: 35px 0 0 15px;'>
            <q-date
              vModel={this.date}
              events={this.events}
              event-color='orange'
              onInput={this.input.bind(this)}
              emit-immediately
              // landscape
            />
          </div>
          <div style='word-break: break-all;height: 100%;position: relative;flex: 1; text-align: left;'>
            <q-scroll-area style='height: 100%; width: 100%;'>
              <div>
                {this.monthList[this.date] &&
                  this.monthList[this.date].map(
                    (item: IAdminDing, index: number) => (
                      <div
                        style='padding: 35px 15px; max-width: 350px;'
                        key={index}
                      >
                        <AdminDiningCard
                          data={item}
                          onAdd={() =>
                            (this.$refs
                              .adminAddDialog as AdminAddDishDialog).show(
                              item,
                              index,
                            )
                          }
                          onDeleteDish={(dish: IAdminDish) =>
                            this.deleteDishOnDining(dish, item, index)
                          }
                          onDelete={this.deleteDining.bind(this, index)}
                        />
                      </div>
                    ),
                  )}
              </div>
            </q-scroll-area>
          </div>
        </div>
        <AdminAddDishDialog
          ref='adminAddDialog'
          list={this.dishes}
          onAdd={this.diningAddDish.bind(this)}
        />
      </div>
    );
  }
  private input(value: string, reason: string, details: any) {
    this.year = details.year;
    this.month = details.month;
    if (reason === 'month' || reason === 'year') {
      this.getEvent();
    }
  }

  private get lastDay() {
    return (
      moment(`${this.year}-${this.month}`)
        .endOf('month')
        .format('YYYY-MM-DD') + ' 23:59:59'
    );
  }

  private get firstDay() {
    return (
      moment(`${this.year}-${this.month}`)
        .startOf('month')
        .format('YYYY-MM-DD') + ' 00:00:00'
    );
  }

  private async getEvent() {
    const res = await getDiningByTime({
      startTime: moment(this.firstDay).unix() * 1000,
      endTime: moment(this.lastDay).unix() * 1000,
    });
    if (res.code === 200) {
      this.monthList = {};
      this.events = res.data.map((item: any) => {
        const day = moment(item.pick_start).format('YYYY/MM/DD');
        if (!this.monthList[day]) {
          this.monthList[day] = [item];
        } else {
          this.monthList[day].push(item);
        }
        return day;
      });
      this.events = lodash.uniq(this.events);
    }
  }
  private async deleteDining(index: number, dining: IAdminDing) {
    if (dining._id) {
      const res = await deleteDining(dining._id);
      if (res.code === 200) {
        this.monthList[this.date].splice(index, 1);
        if (this.monthList[this.date].length === 0) {
          this.events = this.events.filter((_) => _ !== this.date);
        }
        delete this.monthList[this.date];
        this.monthList = lodash.cloneDeep(this.monthList);
      } else {
        // TODO: error
      }
    }
  }
  private async deleteDishOnDining(
    dish: IAdminDish,
    dining: IAdminDing,
    index: number,
  ) {
    if (dining._id) {
      const menu = dining.menu.map((_) => _._id).filter((_) => _ !== dish._id);
      const res = await updateDining({
        id: dining._id,
        dining: {
          ...dining,
          menu,
        },
      });
      if (res.code === 200) {
        this.$nextTick(() => {
          const menu2 = this.monthList[this.date][index].menu;
          menu2.splice(menu2.indexOf(dish), 1);
          this.$set(this.monthList[this.date][index], 'menu', [...menu2]);
          this.monthList = lodash.cloneDeep(this.monthList);
        });
      } else {
        // TODO: error
      }
    }
  }
  private async diningAddDish(
    dish: IAdminDish,
    now: IAdminDing,
    index: number,
  ) {
    if (now._id) {
      const menu = now.menu.map((_) => _._id);
      menu.push(dish._id);
      const res = await updateDining({
        id: now._id,
        dining: {
          ...now,
          menu,
        },
      });
      if (res.code === 200) {
        this.monthList[this.date][index].menu.push(dish);
        this.monthList = lodash.cloneDeep(this.monthList);
      } else {
        // TODO: error
      }
    }
  }
  private get todayEvent() {
    return this.monthList[this.date];
  }
  private async loadDishes() {
    const res = await getDishList();
    if (res.code === 200) {
      this.dishes = res.data;
    }
  }
  private async mounted() {
    this.date = moment().format('YYYY/MM/DD');
    this.month = moment().get('month') + 1;
    this.year = moment().get('year');
    this.$q.loading.show({
      message: '正在请求重要数据请勿关闭浏览器',
    });
    await this.getEvent();
    await this.loadDishes();
    this.$q.loading.hide();
  }
}
