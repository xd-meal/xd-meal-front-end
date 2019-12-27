import { getDiningByTime } from '@/api/admin';
import { lawngreen } from 'color-name';
import { QDate, QSplitter, QTabPanel, QTabPanels } from 'quasar';
import moment from 'moment';
import { VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import lodash from 'lodash';
@Component({
  components: {
    QDate,
    QSplitter,
    QTabPanels,
    QTabPanel,
  },
})
export default class AdminDiningList extends tsx.Component<any> {
  private date: string = '';
  private events: string[] = [];
  private monthList: { [key: string]: any[] } = {};

  private month: number = 0;
  private year: number = 0;

  private render(): VNode {
    return (
      <div>
        <div style='text-align: left;'>
          <q-date
            vModel={this.date}
            events={this.events}
            event-color='orange'
            onInput={this.input.bind(this)}
            emit-immediately
            landscape
          />
        </div>
        <div>
          {this.todayEvent &&
            this.todayEvent.map((item) => <div>{JSON.stringify(item)}</div>)}
        </div>
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

  private get todayEvent() {
    return this.monthList[this.date];
  }

  private async mounted() {
    this.date = moment().format('YYYY/MM/DD');
    this.month = moment().get('month') + 1;
    this.year = moment().get('year');
    this.$q.loading.show({
      message: '正在请求重要数据请勿关闭浏览器',
    });
    await this.getEvent();
    this.$q.loading.hide();
  }
}
