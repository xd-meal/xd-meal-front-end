import OrderBodyDining from '@/components/app/v2/order/OrderBodyDining';
import OrderTopDate from '@/components/app/v2/order/OrderTopDate';
import { IScrollObj, scrollTo } from '@/components/utils/scroll';
import { getMenuGroupBy } from '@/components/utils/group';
import { IStoreDining } from '@/store/order';
import moment from 'moment';
import { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
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
  @Prop({
    default: () => [],
  })
  protected list!: Array<{
    key: string;
    value: IStoreDining[];
  }>;
  @Prop({
    default: () => ({}),
  })
  protected selector!: { [key: string]: string | null };
  @Prop({
    default: '下周选饭',
  })
  protected title!: string;
  @Prop({
    default: false,
  })
  protected optional!: boolean;

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

  // 动画相关
  private fadeOutAnimate = false;
  private headLoadFinish = false;
  private foldingTimer: any = null;
  private nowBodyTransition = 'none';

  public resetTime() {
    const list = getMenuGroupBy<IStoreDining>(this.$store.state.order.list);
    // 生成时间
    const allDate = list.map((i) => i.key);
    const validDate: { [key: string]: boolean } = {};
    this.list?.forEach((i, index) => {
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

  public mounted() {
    document
      .querySelector('body, html')
      ?.setAttribute('style', 'overflow: hidden;');
  }

  public setFadeOutAnimate(flag: boolean) {
    this.fadeOutAnimate = flag;
  }
  public activeTimeChange(d: string) {
    this.$emit('activeTimeChange', { time: d });
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

  @Watch('list')
  private onListChange() {
    this.resetTime();
    this.$nextTick(() => {
      this.nowBodyTransition = 'list';
    });
  }

  private backToMain() {
    this.fadeOutAnimate = true;
    this.$emit('orderBack');
    this.$nextTick(() => {
      this.$router.back();
      // this.$router.push({
      //   name: ROUTER_NAME.TAB_WRAP,
      //   params: { menu: '1' },
      // });
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
          data-for-test='orderHead'
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
            <div class='v2-order_header-title'>{this.title}</div>
            {this.$slots.btns}
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
          data-for-test='orderBodyScroll'
        >
          <div class='v2-order_body-wrap'>
            <transition-group name={this.nowBodyTransition} tag='div'>
              {this.list.map((diningList) => (
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
                      optional={this.optional}
                      onChange={this.diningChange.bind(this, dining)}
                    />
                  ))}
                </div>
              ))}
            </transition-group>
          </div>
          {this.$slots.footer}
        </div>
        {this.$slots.footerOutSide}
      </div>
    );
  }

  private diningChange(dining: IStoreDining, value: string) {
    this.$emit('diningChange', { dining, value });
    this.$emit('update:selector', this.selector);
  }
  private onScroll() {
    if (this.block) {
      return;
    }
    const oldTop = this.lastTop;
    const bodyTop = (this.$refs.orderV2Body as Element).scrollTop;
    this.lastTop = bodyTop;
    this.inScrolling = bodyTop >= 30;
    if (!this.foldingTimer) {
      // this.folding = bodyTop >= 90 && bodyTop - oldTop >= 0;
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
}
