import { getDiningByTime, IDining } from '@/api/admin';
import { VNode } from 'vue';
import { Component, Vue, Watch } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import moment from 'moment';
import { IAdminDing } from '@/components/admin/AdminAddDishDialog';
import AdminTimeSelect from '@/components/admin/AdminTimeSelect';
import axios, { AxiosResponse } from 'axios';
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
  QTable,
  QTh,
  QTr,
  QTd,
} from 'quasar';
@Component({
  components: {
    QBtn,
    QSelect,
    QIcon,
    QDate,
    QPopupProxy,
    AdminTimeSelect,
    QInput,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QTable,
    QTh,
    QTr,
    QTd,
  },
})
export default class AdminOutput extends tsx.Component<any> {
  public selectedDining: any = {};
  private corps: any = [
    {
      label: '种类',
      name: 'dish',
      field: 'dish',
    },
    {
      label: '心动',
      name: 'xd',
      field: 'xd',
    },
    {
      label: 'TapTap',
      name: 'tap',
      field: 'tap',
    },
    {
      label: '龙成',
      name: 'xdg',
      field: 'xdg',
    },
    {
      label: '幻刃',
      name: 'fantablade',
      field: 'fantablade',
    },
  ];
  private get tableData() {
    return this.rawData.map((dining: any, index: number) => {
      const menuById = dining._id.menu.reduce((acc: any, cur: any) => {
        acc[cur._id] = {
          dish: cur.title,
          xd: 0,
          xdg: 0,
          tap: 0,
          fantablade: 0,
        };
        return acc;
      }, {});
      dining.stat.forEach((el: any) => {
        menuById[el.menu_id][el.corp] = el.count;
        // this.$set(menuById[el.menu_id], el.corp, el.count);
      });
      return {
        title: dining._id.title,
        stat: Object.values(menuById),
      };
    });
  }
  private rawData: any = [];
  private dinings: any[] = [];
  private startTime: string = moment().format('YYYY/MM/DD HH:mm');
  private endTime: string = moment().format('YYYY/MM/DD HH:mm');
  private render(): VNode {
    return (
      <div style={{ textAlign: 'left' }}>
        <div>
          <AdminTimeSelect vModel={this.startTime} />
          <span style='margin: 0 16px;display: inline-block;' />
          <AdminTimeSelect vModel={this.endTime} />
          <span style='margin: 0 16px;display: inline-block;' />
          <q-btn
            flat
            label='查询'
            color='primary'
            onClick={this.queryDiningsByDate}
          />
        </div>
        {this.rawData.map((item: any, index: number) => (
          <div style='margin: 15px;'>
            <q-table
              title={item._id.title}
              data={this.tableData[index].stat}
              columns={this.corps}
              row-key='dish'
            />
          </div>
        ))}
      </div>
    );
  }
  private async queryDiningsByDate() {
    this.rawData = (
      await axios.get(
        '/api/v1/report/order_count/' +
          moment(this.startTime).unix() * 1000 +
          '/' +
          moment(this.endTime).unix() * 1000,
      )
    ).data;
  }
}
