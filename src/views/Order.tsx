import './Order.scss';

import lodash from 'lodash';
import { VNode } from 'vue';
import { Component, Ref } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

import { MENU_TIME_TYPE } from '@/store/menu';
import { IOrderSingleItem, MENU_TYPE } from '@/store/order';

import FoodSelect from '@/components/utils/FoodSelect';
import { getDay } from '@/components/utils/time.ts';

export interface IOrderSingleItemWithChecked extends IOrderSingleItem {
  checked?: boolean;
}

@Component
export default class Order extends tsx.Component<any> {
  // TODO: 逻辑太乱，待整理存在多个或多个不同的方式获取同一份数据
  protected scrollY: number[] = [0, 0];
  protected currentTime: string | undefined = '';
  protected current: any | undefined;
  protected data: any[] = [];
  protected currentSelectTime: MENU_TIME_TYPE = MENU_TIME_TYPE.LUNCH;
  protected tabList: { [keys: string]: { name: string } } = {
    [MENU_TIME_TYPE.LUNCH]: {
      name: '午餐',
    },
    [MENU_TIME_TYPE.DINNER]: {
      name: '晚餐',
    },
  };

  protected orderList: IOrderSingleItemWithChecked[] = [];

  @Ref('hammerDom') private hammerDom: any;
  @Ref('tabNav') private tabNav: any;
  @Ref('slide') private slide: any;
  @Ref('pageSticky') private pageSticky: any;

  private scrollOptions = {
    directionLockThreshold: 0,
    click: false,
    bounce: {
      top: false,
      bottom: true,
      left: true,
      right: true,
    },
  };

  private slideOptions = {
    listenScroll: true,
    probeType: 3,
    directionLockThreshold: 0,
  };
  protected render(): VNode {
    // XXX: 拆分小组件
    const orderMain = (
      <cube-slide
        ref='slide'
        loop={false}
        initial-index={this.initialIndex}
        auto-play={false}
        show-dots={false}
        options={this.slideOptions}
        onScroll={this.scroll.bind(this)}
        onChange={this.changePage.bind(this)}
      >
        {[this.Lunch, this.Dinner].map((list, index) => (
          <cube-slide-item>
            <cube-sticky
              pos={this.scrollY[this.initialIndex]}
              onChange={this.pageStickyChangeHandler.bind(this)}
              ref='pageSticky'
            >
              <cube-scroll
                scroll-events={['scroll', 'scroll-end']}
                options={this.scrollOptions}
                onScroll={this.yScroll.bind(this, index)}
              >
                {lodash(list)
                  .groupBy('time')
                  .map((item: IOrderSingleItemWithChecked[], key: string) => {
                    return (
                      <div>
                        <cube-sticky-ele ele-key={getDay(key)} />
                        <FoodSelect
                          value={item}
                          onToggle={(payload: {
                            item: IOrderSingleItemWithChecked;
                            value: boolean;
                          }) => this.setItemToggle(payload, item)}
                        />
                      </div>
                    );
                  })
                  .value()}
              </cube-scroll>
            </cube-sticky>
          </cube-slide-item>
        ))}
      </cube-slide>
    );
    const timeTxts = this.timeTxts;
    const orderSide = (
      <cube-scroll-nav-bar
        direction='vertical'
        txts={timeTxts}
        current={this.currentTime}
        labels={timeTxts}
      />
    );
    return (
      <div class='order'>
        <div class='order-header'>
          <div className='order-header-wrap'>
            <div class='go-back' onClick={this.goBack.bind(this)}>
              <i class='cubeic-back'></i>
            </div>
            <div class='order-header-title'>下周选饭</div>
          </div>
        </div>
        <div class='order-body'>
          <cube-tab-bar
            vModel={this.currentSelectTime}
            show-slider
            ref='tabNav'
          >
            {Object.keys(this.tabList).map((key) => {
              return (
                <cube-tab
                  label={this.tabList[key].name}
                  key={key}
                  value={key}
                />
              );
            })}
          </cube-tab-bar>
          <div class='order-body-content'>
            <div class='order-body-content-wrap'>
              <div class='order-body-content-side'>{orderSide}</div>
              <div class='order-body-content-main'>{orderMain}</div>
            </div>
          </div>
        </div>
        <div class='order-footer'>
          <div onClick={() => this.selectAllBuffet()}>全自助</div>
          <div onClick={() => this.selectAllRandom()}>随机选</div>
          <div>
            <button class='submit' onClick={this.submit.bind(this)}>
              下单
            </button>
          </div>
        </div>
      </div>
    );
  }
  // events
  protected mounted() {
    const orderList = lodash.clone(this.$store.state.order.list);
    this.orderList = orderList.map((order: IOrderSingleItemWithChecked) => {
      order.checked = false;
      return order;
    });

    this.$nextTick(() => {
      // XXX: 可能有需要？不确定，先使用 nextTick 包起来
      this.refresh();
    });
  }
  // method
  private refresh() {
    (this.$refs.pageSticky as any).refresh();
  }
  private yScroll(index: number, pos: any) {
    this.$set(this.scrollY, index, -pos.y);
  }
  private pageStickyChangeHandler(current: any) {
    window.console.log(current);
    lodash(this.timeTxts)
      .map((item) => ({ label: item }))
      .find();
    this.currentTime = current;
  }

  private scroll(pos: any) {
    const x = Math.abs(pos.x);
    // cube 没有完成全部 ts ，这里只能定义为 any
    const tabNav = this.$refs.tabNav as any;
    const slide = this.$refs.slide as any;
    const tabItemWidth = tabNav.$el.clientWidth;
    const slideScrollerWidth = slide.slide.scrollerWidth;
    const deltaX = (x / slideScrollerWidth) * tabItemWidth;
    tabNav.setSliderTransform(deltaX);
  }
  private changePage(current: number) {
    this.currentSelectTime = Object.keys(this.tabList)[
      current
    ] as MENU_TIME_TYPE;
    this.$nextTick(() => {
      this.refresh();
    });
  }
  private goBack() {
    this.$router.back();
  }
  private selectAllBuffet() {
    const dinner = this.orderList.filter(
      (item) => item.type === MENU_TIME_TYPE.DINNER,
    );
    const lunch = this.orderList.filter(
      (item) => item.type === MENU_TIME_TYPE.LUNCH,
    );
    // TODO: 先随便写写，性能巨差以后优化
    const setBuffe = (listByTime: IOrderSingleItemWithChecked[]) => {
      lodash(listByTime)
        .groupBy('time')
        .forEach((listOfDay: IOrderSingleItemWithChecked[]) => {
          for (const item of listOfDay) {
            const index = this.orderList.indexOf(item);
            this.$set(this.orderList, `${index}`, {
              ...item,
              checked: item.menuType === MENU_TYPE.BUFFE,
            });
          }
        });
    };
    setBuffe(lunch);
    setBuffe(dinner);
  }

  private selectAllRandom() {
    const dinner = this.orderList.filter(
      (item) => item.type === MENU_TIME_TYPE.DINNER,
    );
    const lunch = this.orderList.filter(
      (item) => item.type === MENU_TIME_TYPE.LUNCH,
    );
    // TODO: 先随便写写，性能巨差以后优化
    const setRandom = (listByTime: IOrderSingleItemWithChecked[]) => {
      lodash(listByTime)
        .groupBy('time')
        .forEach((listOfDay: IOrderSingleItemWithChecked[]) => {
          const randomIndex = Math.floor(listOfDay.length * Math.random());
          for (let i = 0; i < listOfDay.length; i++) {
            const item = listOfDay[i];
            const index = this.orderList.indexOf(item);
            this.$set(this.orderList, `${index}`, {
              ...item,
              checked: randomIndex === i,
            });
          }
        });
    };
    setRandom(lunch);
    setRandom(dinner);
  }
  private get listByTime(): {
    [key: string]: IOrderSingleItem[];
  } {
    return lodash.groupBy(this.list, 'time');
  }
  private submit() {
    (this as any)
      .$createDialog({
        type: 'confirm',
        title: '下单',
        content: '请确认下单内容正确，下单后不可更改',
        icon: 'cubeic-alert',
        onConfirm: () => {
          this.$router.replace({
            name: 'index',
          });
        },
      })
      .show();
  }
  private setItemToggle(
    {
      item,
      value,
    }: {
      item: IOrderSingleItemWithChecked;
      value: boolean;
    },
    targetList: IOrderSingleItemWithChecked[],
  ) {
    targetList.forEach((target) => {
      const index = this.orderList.indexOf(target);
      this.$set(this.orderList, `${index}`, {
        ...target,
        checked: target === item ? value : false,
      });
    });
  }
  // getter
  private get timeTxts() {
    return lodash(this.orderList)
      .groupBy('time')
      .keys()
      .map((item) => getDay(item))
      .value();
  }
  private get initialIndex() {
    const index = [MENU_TIME_TYPE.LUNCH, MENU_TIME_TYPE.DINNER].indexOf(
      this.currentSelectTime,
    );
    return index >= 0 ? index : 0;
  }

  private get list(): IOrderSingleItem[] {
    return this.orderList.filter((item: IOrderSingleItem) => {
      return item.type === this.currentSelectTime;
    });
  }

  private get Dinner() {
    return this.orderList.filter((item) => item.type === MENU_TIME_TYPE.DINNER);
  }
  private get Lunch() {
    return this.orderList.filter((item) => item.type === MENU_TIME_TYPE.LUNCH);
  }

  private get listByTimeKeys() {
    return lodash.keys(this.listByTime);
  }
}
