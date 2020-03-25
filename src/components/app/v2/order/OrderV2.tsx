import { orderDishes } from '@/api/menu';
import OrderBodyDining from '@/components/app/v2/order/OrderBodyDining';
import OrderTopDate from '@/components/app/v2/order/OrderTopDate';
import { IScrollObj, scrollTo } from '@/components/utils/scroll';
import { filterMenuList, IRule } from '@/components/utils/filter';
import { getMenuGroupBy } from '@/components/utils/group';
import { timeMMDD } from '@/components/utils/time';
import { ROUTER_NAME } from '@/router';
import { IStoreDining, IStoreDish } from '@/store/order';
import _ from 'lodash';
import moment from 'moment';
import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import '@/components/app/v2/order/OrderV2.scss';

@Component({
  components: {
    Order: OrderTopDate,
    OrderBodyDining,
  },
})
export default class OrderV2 extends tsx.Component<any> {
  // 数据相关
  protected list: Array<{
    key: string;
    value: IStoreDining[];
  }> = [];
  protected selector: { [key: string]: string | null } = {};
  // 是否显示加班餐
  protected extra: boolean = false;
  // 上方日历相关设置
  private selectTime: string = '';
  private currentDate: Array<{
    time: string;
    status: boolean;
  }> = [];
  private currentTime: string = '';

  // 滚动相关
  private block: boolean = false;
  private timer?: IScrollObj;

  private folding?: boolean = false;

  private inScrolling: boolean = false;

  private lastTop: number = 0;
  // 按钮相关
  private randomBtn: boolean = false;
  private allBuffetBtn: boolean = false;
  private allRandom: boolean = false;
  private allBuffeted: boolean = false;

  // 随机选饭相关
  private randomForNoSpicy: boolean = false;
  private randomForEmpty: boolean = false;

  // 随机选饭规则列表
  private randomRules: Array<string | IRule> = [];

  // 动画相关
  private fadeOutAnimate = false;
  private headLoadFinish = false;
  private foldingTimer: any = null;

  // 错误提示信息
  private errorText: string = '';
  public resetList() {
    let list = this.$store.state.order.list;
    if (!this.extra) {
      list = list.filter((item: IStoreDining) => !/加班/.test(item.title));
    }
    this.list = getMenuGroupBy(list);
    const selector: { [key: string]: string | null } = {};
    // 生成选项列表
    for (const item of list) {
      selector[item._id] = null;
    }
    this.selector = selector;
  }
  public resetTime() {
    const list = getMenuGroupBy<IStoreDining>(this.$store.state.order.list);
    // 生成时间
    const allDate = list.map((i) => i.key);
    const validDate: { [key: string]: boolean } = {};
    this.list.forEach((i, index) => {
      if (index === 0) {
        this.selectTime = i.key;
      }
      validDate[i.key] = true;
    });
    this.currentDate = allDate.map((i) => ({
      time: i,
      status: validDate[i],
    }));
    this.currentTime = moment()
      .format('MM-dd')
      .toString();
    this.$nextTick(() => {
      (this.$refs.OrderTopDate as OrderTopDate).reset();
      setTimeout(() => {
        // 初始化完成后在开启移动动画
        this.headLoadFinish = true;
      }, 100);
    });
  }
  public resetButton() {
    // 设置按钮显示
    const config = this.$store.state.user.config;
    this.randomBtn = config.randomBtn;
    this.allBuffetBtn = config.buffetBtn;
    this.randomForNoSpicy = config.randomForNoSpicy;
    this.randomForEmpty = config.randomForEmpty;
    // 设置随机规则
    if (this.randomForEmpty) {
      this.randomRules = [];
    } else {
      this.randomRules = ['NO_EMPTY'];
    }

    if (this.randomForNoSpicy) {
      this.randomRules.push('NO_SPICY');
    }
  }
  public mounted() {
    document
      .querySelector('body, html')
      ?.setAttribute('style', 'overflow: hidden;');
    this.resetList();
    this.resetTime();
    this.resetButton();
    // 设置错误提示信息
    this.refreshError();
  }
  private backToMain() {
    this.fadeOutAnimate = true;
    this.$nextTick(() => {
      this.$router.push({ name: ROUTER_NAME.TAB_WRAP });
    });
  }

  private render(): VNode {
    return (
      <div
        class={{
          'v2-order': true,
          'v2-order-remove': this.fadeOutAnimate,
          'v2-order_folding': this.folding,
        }}
        onmousemove={(e: Event) => e.preventDefault()}
      >
        <div
          class={{
            'v2-order_header': true,
            'v2-order_header_scroll': this.inScrolling,
          }}
        >
          <div class='v2-order_header-wrap'>
            <div
              class='v2-order_header-backicon'
              onClick={this.backToMain.bind(this)}
            >
              <i class='cubeic-back' />
            </div>
            <div class='v2-order_header-title'>下周选饭</div>
            <div
              class={{
                'v2-order_header_extra': true,
                'v2-order_header_extra_active': this.extra,
              }}
              onClick={this.toggleExtra.bind(this)}
            >
              加班
            </div>
          </div>
          <OrderTopDate
            currentDate={this.currentDate}
            activeTime={this.selectTime}
            currentTime={this.currentTime}
            onActiveChange={this.activeTimeChange.bind(this)}
            headLoadFinish={this.headLoadFinish}
            ref='OrderTopDate'
          />
        </div>
        <div
          class='v2-order_body'
          ref='orderV2Body'
          onScroll={this.onScroll.bind(this)}
        >
          <div class='v2-order_body-wrap'>
            <transition-group name='list' tag='div'>
              {this.list.map((diningList, i) => (
                <div
                  class='v2-order_panel'
                  key={String(diningList.key)}
                  ref={`d-${diningList.key}`}
                >
                  {diningList.value.map((dining, index) => (
                    <OrderBodyDining
                      vModel={this.selector[dining._id]}
                      data={dining}
                      time={diningList.key}
                      index={index}
                      onChange={this.diningChange.bind(this, dining)}
                    />
                  ))}
                </div>
              ))}
            </transition-group>
          </div>
        </div>
        <div
          class={{
            'v2-order_footer': true,
            'no-error': !this.errorText,
          }}
        >
          <div class='v2-order_footer_error-text'>{this.errorText}</div>
          <div class='v2-order_buttons'>
            <div class='v2-order_buttons-wrap'>
              <div class='v2-order_buttons-right'>
                {this.allBuffetBtn && (
                  <div
                    class={{
                      'v2-order_buttons_button': true,
                      'v2-order_buttons_button_active': this.allBuffeted,
                    }}
                    onclick={this.selectAllBuffet.bind(this)}
                  >
                    <button class='v2-order_buttons-checkbox' role='button' />
                    <div class='v2-order_buttons-label' role='note'>
                      全自助
                    </div>
                  </div>
                )}
                {this.randomBtn && (
                  <div
                    class={{
                      'v2-order_buttons_button': true,
                      'v2-order_buttons_button_active': this.allRandom,
                    }}
                    onclick={this.selectAllRandom.bind(this)}
                  >
                    <button class='v2-order_buttons-checkbox' role='button' />
                    <div class='v2-order_buttons-label' role='note'>
                      随机选
                    </div>
                  </div>
                )}
              </div>
              <div
                class={{
                  'v2-order_buttons-left': true,
                  'v2-order_buttons-left_disable': this.submitDisable,
                }}
                role='button'
              >
                <div
                  class='v2-order_buttons-left-text'
                  onclick={this.submit.bind(this)}
                >
                  提交
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  protected get submitDisable() {
    return _.some(this.selector, (item) => !item);
  }
  private toggleExtra() {
    this.extra = !this.extra;
    this.resetList();
    this.resetTime();
  }
  private diningChange(dining: IStoreDining, value: string) {}
  private activeTimeChange(d: string) {
    this.selectTime = d;
    const ref = this.$refs[`d-${d}`];
    if (ref instanceof Element) {
      // 存在的调用 animate
      const top = (ref as HTMLElement).offsetTop;
      clearTimeout(this.timer?.timerClose);
      clearTimeout(this.timer?.timer);
      this.timer = scrollTo(
        this.$refs.orderV2Body as Element,
        top - 40 - 13 - 1,
        1200,
      );
      this.block = true;

      // @ts-ignore
      this.timer.timerClose = setTimeout(() => {
        this.block = false;
      }, 1300);
    }
  }
  private onScroll() {
    if (this.block) {
      return;
    }
    const oldTop = this.lastTop;
    const bodyTop = (this.$refs.orderV2Body as Element).scrollTop;
    this.lastTop = bodyTop;
    if (bodyTop >= 30) {
      this.inScrolling = true;
    } else {
      this.inScrolling = false;
    }
    if (!this.foldingTimer) {
      this.folding = bodyTop >= 90 && bodyTop - oldTop >= 0;
      this.foldingTimer = setTimeout(() => {
        clearTimeout(this.foldingTimer);
        this.foldingTimer = null;
      }, 500);
    }
    const lastSelectTime = String(this.selectTime);
    for (const i of this.list) {
      const ref = this.$refs[`d-${i.key}`];
      const top = (ref as HTMLElement).offsetTop;
      if (top > bodyTop) {
        if (lastSelectTime !== this.selectTime) {
          this.$nextTick(() => {
            (this.$refs.OrderTopDate as OrderTopDate).reset();
          });
        }
        return;
      } else {
        this.selectTime = i.key;
      }
    }
    if (lastSelectTime !== this.selectTime) {
      this.$nextTick(() => {
        (this.$refs.OrderTopDate as OrderTopDate).reset();
      });
    }
  }

  // method
  private selectAllBuffet() {
    const regex = /自助/;
    let count = 0;
    this.list.forEach(({ value }) => {
      value.forEach((dining) => {
        const menuBuffet = dining.menu.filter((str) => regex.test(str.title));
        if (menuBuffet.length > 0) {
          count++;
          // 如果之前是选过的，把所有的自助餐全部反选
          if (this.allBuffeted) {
            this.selector[dining._id] = null;
          } else {
            this.selector[dining._id] = menuBuffet[0]._id;
          }
        }
      });
    });
    // 如果没有任何一项被选中，说明就没有自助餐，什么都不操作
    if (count !== 0) {
      this.allBuffeted = !this.allBuffeted;
    }
    this.refreshError();
  }
  private selectAllRandom() {
    this.allRandom = true;
    this.list.forEach(({ value }) => {
      value.forEach((dining) => {
        const menu = filterMenuList(dining.menu, this.randomRules);
        const index = Math.floor(menu.length * Math.random());
        this.selector[dining._id] = menu[index]._id;
      });
    });
    this.refreshError();
    this.refreshBuffeted();
  }
  private refreshError() {
    for (const { value } of this.list) {
      for (const item of value) {
        if (!this.selector[item._id]) {
          this.errorText = `${timeMMDD(item.pick_start)}尚未选择`;
          return;
        }
      }
    }
    this.errorText = '';
  }
  private refreshBuffeted() {
    const regex = /自助/;
    const allMenus: { [key: string]: IStoreDish } = _(this.list)
      .map((v) => v.value.map((vv) => vv.menu))
      .flatten()
      .flatten()
      .mapKeys((v) => v._id)
      .value();
    // tslint:disable-next-line:forin
    for (const key in this.selector) {
      const s = this.selector[key];
      let title = '';
      if (s && allMenus[String(s)]?.title) {
        title = allMenus[String(s)]?.title;
      }
      if (!regex.test(title.toString())) {
        this.allBuffeted = false;
        return;
      }
    }
    this.allBuffeted = true;
  }

  private submit() {
    // tslint:disable-next-line:forin
    for (const key in this.selector) {
      const item = this.selector[key];
      if (!item) {
        for (const ll of this.list) {
          for (const singleMenu of ll.value) {
            if (singleMenu._id === key) {
              // 跳转到指定位置
              this.activeTimeChange(ll.key);
              this.selectTime = ll.key;
              this.$nextTick(() => {
                (this.$refs.OrderTopDate as OrderTopDate).reset();
              });
            }
          }
        }
        return false;
      }
    }
    const ids: Array<{ diningId: string; menuId: string }> = _.map(
      this.selector,
      (item, key) => {
        return {
          diningId: key,
          menuId: String(item),
        };
      },
    );

    this.$createDialog({
      type: 'confirm',
      content:
        '<span class="dialog-pc-order">确认要这样恰饭嘛？<br>( • ̀ω•́ )✧</span>',
      icon: 'cubeic-alert',
      onConfirm: async () => {
        const res = await orderDishes(ids);
        if (res.code === 200) {
          await this.$router.replace({
            name: ROUTER_NAME.APP_INDEX,
          });
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
}
