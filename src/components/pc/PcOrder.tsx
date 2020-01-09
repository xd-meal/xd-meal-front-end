import {
  fetchMyDishes,
  fetchWeekdayDishes,
  IMyDining,
  orderDishes,
} from '@/api/menu';
import PcDining from '@/components/pc/PcDining';
import Checkbox from '@/components/utils/Checkbox.tsx';
import { getTimeType } from '@/components/utils/diningTime';
import { createIcal } from '@/components/utils/ical';
import { MENU_TIME_TYPE } from '@/store/menu';
import { IStoreDining } from '@/store/order';
import { loginOut } from '@/utils/common';
import lodash from 'lodash';
import moment from 'moment';
import { VNode } from 'vue';

import { Component } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import './PcOrder.scss';

const TIME_STRING_TEMPLATE = 'MM月DD日';
declare interface IChooseItem {
  type: string;
  desc: string;
  checked: boolean;
  isBuffet: boolean;
  id: string;
}
declare interface IOrder {
  title: string;
  chooseList: IChooseItem[];
}
@Component({
  components: {
    Checkbox,
    PcDining,
  },
})
export default class PcOrder extends tsx.Component<any> {
  protected list: IStoreDining[] = [];
  protected selector: { [key: string]: string | null } = {};
  protected title: string = '';
  protected showFinish: boolean = false;
  protected show: boolean = false;

  private timer: any = null;
  protected render(): VNode {
    return (
      <div class='pcorder' style={{ opacity: this.show ? 1 : 0 }}>
        <header class='pc-header'>
          <div class='pc-header-wrap'>
            <div class='pc-header-logo'></div>
            <div class='pc-header-right'>
              <button onClick={this.loginOut.bind(this)}>退出登陆</button>
              {/*<button>下载app</button>*/}
            </div>
          </div>
        </header>
        {!this.showFinish && (
          <div class='pc-order-wrap'>
            <h3 class='pc-order-wrap-title'>
              <span class='strong' style={{ marginRight: '25px' }}>
                {this.title}
              </span>
              <span class='light'>
                友情提示选饭包括 #午饭 和 晚饭#！感谢配合～
              </span>
            </h3>
            <div class='pc-order-content'>
              {this.list.map((dining) => {
                return (
                  <PcDining vModel={this.selector[dining._id]} data={dining} />
                );
              })}
            </div>
          </div>
        )}
        {this.showFinish && (
          <div class='pc-order-wrap pc-order-wrap_finish'>
            <div class='pc-order-wrap_finish-wrap'>
              <div class='pc-order-wrap_finish-wrap-center'>
                <h3>
                  您已完成订餐！（
                  <span
                    style='cursor: pointer;'
                    onClick={() => (this.showFinish = false)}
                  >
                    重选请点击这里
                  </span>
                  ）
                </h3>
                <h4>请前往 企业微信 -> 今天吃啥 查看订餐详情</h4>
                <h4>
                  或点击
                  <a onClick={this.download}>这里</a>
                  下载日历
                </h4>
                {/*<div style={{ marginTop: '24px' }}>*/}
                {/*  <qriously*/}
                {/*    className='pay-qr-code'*/}
                {/*    value={'http://meal.xd.com/#/'}*/}
                {/*    size={140}*/}
                {/*  />*/}
                {/*</div>*/}
              </div>
            </div>
          </div>
        )}
        {!this.showFinish && (
          <div class='pc-order-progress-bar progress'>
            <div class='progress-wrap'>
              <div class='progress-left'>
                <div class='progress-left-wrap'>
                  <div
                    class='progress-left-inner'
                    style={{ width: this.progressLength }}
                  />
                </div>
              </div>
              <div class='progress-right'>
                <button
                  class='progress-right-btn btn-default random'
                  onclick={this.random.bind(this)}
                >
                  随机选饭
                </button>
                <button
                  class='progress-right-btn btn-default all'
                  onclick={this.allBuffet.bind(this)}
                >
                  全部自助
                </button>
                <button
                  class='progress-right-btn btn-primary'
                  onclick={this.submit.bind(this)}
                >
                  提交
                </button>
                {/*<button class='progress-right-btn btn-primary calendar'>*/}
                {/*  下载日历*/}
                {/*</button>*/}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  private submit() {
    if (this.timer) {
      // 重复点击不提交
      return;
    }

    const idList: Array<{ diningId: string; menuId: string }> = [];
    // tslint:disable-next-line:forin
    for (const item in this.selector) {
      if (!this.selector[item]) {
        // TODO: 跳转到没选择的条目位置
        this.$createToast({
          txt: '存在尚未选择的条目',
          mask: true,
          type: 'text',
          timeout: 3000,
        }).show();
        return;
      }
      idList.push({
        diningId: item,
        menuId: String(this.selector[item]),
      });
    }

    this.$createDialog({
      type: 'confirm',
      title: '下单',
      content: '请确认下单内容正确，下单后不可更改',
      icon: 'cubeic-alert',
      onConfirm: async () => {
        const toastLoading = this.$createToast({
          txt: 'loading',
          time: 0,
          mask: true,
        });
        // 超过300毫秒的可取下才显示 toast
        this.timer = setTimeout(() => {
          toastLoading.show();
        }, 300);
        const res = await orderDishes(idList);
        toastLoading.hide();
        clearTimeout(this.timer);
        this.timer = null;
        if (res.code === 200) {
          this.showFinish = true;
        } else {
          const toast = this.$createToast({
            txt: res.msg,
            mask: true,
            timeout: 3000,
          });
          toast.show();
        }
      },
    }).show();
  }
  private allBuffet() {
    const textRegex = /自助/;
    this.list.forEach((_) => {
      const buffetList = _.menu.filter((menu) => textRegex.test(menu.title));
      if (buffetList.length > 0) {
        this.selector[_._id] = buffetList[0]._id;
      }
    });
  }
  private random() {
    this.list.forEach((_) => {
      const index = Math.floor(Math.random() * _.menu.length);
      this.selector[_._id] = _.menu[index]._id;
    });
  }
  private refreshTitle() {
    const times = lodash(this.list)
      .groupBy('pick_start')
      .keys()
      .map((_) => moment(_).unix() * 1000)
      .value();

    const timeMax = lodash.max(times);
    const timeMin = lodash.min(times);
    this.title =
      moment(timeMin).format(TIME_STRING_TEMPLATE) +
      '-' +
      moment(timeMax).format(TIME_STRING_TEMPLATE) +
      '一周选饭';
  }
  private async mounted() {
    const toast = this.$createToast({
      txt: 'loading...',
      mask: true,
      time: 0,
    });
    const timer = setTimeout(() => {
      toast.show();
    }, 300);
    const res = await fetchWeekdayDishes();
    toast.hide();
    clearTimeout(timer);
    if (res.code !== 200) {
      return;
    }
    if (res.data.dinings.length > 0) {
      const selector: { [key: string]: string | null } = {};
      const orders = res.data.orders;
      this.list = lodash.sortBy(res.data.dinings, 'pick_start');
      // 判断是否已经点过，点过的直接帮他选上
      if (orders.length <= 0) {
        this.list.forEach((_) => (selector[_._id] = null));
      } else {
        // 整理成 key value 形式
        const orderByKey: { [key: string]: string } = lodash(orders)
          .keyBy('dining_id')
          .mapValues('menu_id')
          .value();
        this.list.forEach((value) => {
          selector[value._id] = orderByKey[value._id];
        });
        // 先送去结束界面
        this.showFinish = true;
      }
      this.selector = selector;
      this.refreshTitle();
    } else {
      this.showFinish = true;
    }
    this.show = true;
  }
  private loginOut() {
    loginOut(this);
  }
  private async download() {
    const myDishesRes = await fetchMyDishes();
    if (myDishesRes.code === 200) {
      const myDishes = myDishesRes.data || [];
      const mealList = myDishes.map((dish: IMyDining) => {
        return {
          time: dish.pick_start,
          title: dish.title,
          desc: dish.menu.desc ?? '',
          isVoteDown: false,
          type: getTimeType(dish)?.key ?? MENU_TIME_TYPE.BREAKFAST,
          id: dish.id,
        };
      });
      const str = createIcal(mealList);
      const blob = new Blob([str], {
        type: 'text/calendar',
      });
      const a = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      const filename = 'date.ics';
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      // TODO: 异常处理情况
    }
  }
  // getter
  get progressLength() {
    const selectList = lodash(this.selector)
      .filter((_) => Boolean(_))
      .value();
    return (selectList.length / this.list.length) * 100 + '%';
  }
}
