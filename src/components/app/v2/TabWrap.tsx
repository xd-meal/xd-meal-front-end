import { ROUTER_NAME } from '@/router';
import { ORDER, ORDER_NAMESPACE } from '@/store/order';
import { USER, USER_NAMESPACE } from '@/store/user';
import { VNode } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { Route, VueRouter } from 'vue-router/types/router';
import * as tsx from 'vue-tsx-support';
import '@/components/app/v2/TabWrap.scss';
import IndexWrap from '@/components/app/v2/index/IndexWrap';
import Pay from '@/components/app/pay/Pay';
import Profile from '@/components/app/v2/profile/Profile';
import { isUndefined } from 'lodash';
@Component({
  components: {
    IndexWrap,
    Pay,
    Profile,
  },
})
export default class TabWrap extends tsx.Component<any> {
  private tabList = [
    {
      name: 'index',
    },
    {
      name: 'qrcode',
    },
    {
      name: 'profile',
    },
  ];
  private now = 0;
  private shows = [false, false, false];
  // 动画相关
  private transitionName: string = '';
  private mounted() {
    this.$store.dispatch(ORDER_NAMESPACE + ORDER.FETCH_ORDER_DISHES_ACTION);
    this.$store.dispatch(USER_NAMESPACE + USER.FETCH_USER_PROFILE_ACTION);
    if (isUndefined(this.$route.params.menu)) {
      this.$router.replace({
        name: ROUTER_NAME.TAB_WRAP,
        params: { menu: String(0) },
      });
      return;
    }
    this.now = parseInt(this.$route.params.menu, 10);
    const shows = [false, false, false];
    shows[this.now] = true;
    this.shows = shows;
  }
  private render(): VNode {
    return (
      <div class='v2-main'>
        <div class='v2-main-body'>
          <transition name={this.transitionName}>
            {this.shows[0] && (
              <div class='v2-main-transition'>
                <IndexWrap />
              </div>
            )}
          </transition>
          <transition name={this.transitionName}>
            {this.shows[1] && (
              <div class='v2-main_pay-wrap v2-main-transition'>
                <Pay />
              </div>
            )}
          </transition>

          <transition name={this.transitionName}>
            {this.shows[2] && (
              <div class='v2-main_profile-wrap v2-main-transition'>
                <Profile />
              </div>
            )}
          </transition>
        </div>

        <div class={'v2-main-footer' + ' ' + this.tabList[this.now].name}>
          <div class='v2-main-footer_icons'>
            {this.tabList.map((_, index) => (
              <div
                class={{
                  'v2-main-footer_icon': true,
                  'v2-main-footer_icon_active': this.now === index,
                }}
                onClick={this.changeToTab.bind(this, index)}
              >
                <div class='click-wrap' />
                <i class={_.name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  @Watch('$route')
  private onRouteChange(to: Route, from: Route) {
    if (from.name === ROUTER_NAME.APP_ORDER_V2) {
      const now = parseInt(this.$route.params.menu, 10);
      if (now === 0) {
        this.setShow(0);
      }
    }
  }

  private setShow(toIndex: number) {
    const shows = new Array(3).fill(false);
    shows[toIndex] = true;
    // 由于更新次序，必须要延迟一个 tick 来更新 show 保证先 slide 动画正确，在移除
    this.$nextTick(() => {
      this.shows = shows;
    });
  }
  private changeToTab(toIndex: number) {
    const fromIndex = this.now;
    this.now = toIndex;
    this.setShow(toIndex);
    this.transitionName =
      toIndex < fromIndex ? 'v2-slide-right' : 'v2-slide-left';
    this.$router.replace({
      name: ROUTER_NAME.TAB_WRAP,
      params: { menu: String(this.now) },
    });
  }
}
