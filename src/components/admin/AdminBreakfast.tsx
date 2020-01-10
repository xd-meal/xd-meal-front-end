import { getDiningByTime, IDining } from '@/api/admin';
import { VNode } from 'vue';
import { Component, Vue, Watch } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import moment from 'moment';
import { IAdminDing } from '@/components/admin/AdminAddDishDialog';
import AdminTimeSelect from '@/components/admin/AdminTimeSelect';
import axios, { AxiosResponse } from 'axios';
import XLSX from 'xlsx';
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
export default class AdminBreakfast extends tsx.Component<any> {
  public selectedDining: any = {};
  private corps: any = {
    xd: '心动',
    tap: 'TapTap',
    xdg: '龙成',
    fantablade: '幻刃',
  };
  private rawData: any = [];
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
          <span style='margin: 0 16px;display: inline-block;' />
          {/* <q-btn flat label='导出 Excel' onClick={this.exportXSLX} /> */}
        </div>
        {this.rawData.map((item: any, index: number) => (
          <div
            class='stat-table'
            style='margin: 15px;min-width: 500px;font-size: 20px;'
          >
            {this.corps[item.corp]}: {item.count}
          </div>
        ))}
      </div>
    );
  }
  private async queryDiningsByDate() {
    this.rawData = (
      await axios.get(
        '/api/v1/report/user_count/' +
          moment(this.startTime).unix() * 1000 +
          '/' +
          moment(this.endTime).unix() * 1000,
      )
    ).data;
  }
  // private exportXSLX() {
  //   if (!this.rawData.length) {
  //     return;
  //   }
  //   const book = XLSX.utils.book_new();
  //   const tables = Array.from(document.querySelectorAll('.stat-table'));
  //   tables.forEach((el: any) => {
  //     const sheet = XLSX.utils.table_to_sheet(el.querySelector('table'));
  //     XLSX.utils.book_append_sheet(
  //       book,
  //       sheet,
  //       el.querySelector('.q-table__title').innerText,
  //     );
  //   });
  //   XLSX.writeFile(
  //     book,
  //     moment(this.startTime).format('YYYY-MM-DD') +
  //       ' - ' +
  //       moment(this.endTime).format('YYYY-MM-DD') +
  //       ' 点餐统计.xlsx',
  //   );
  // }
}
