import { ORDER, ORDER_NAMESPACE } from '@/store/order';
import { USER, USER_NAMESPACE } from '@/store/user';
import { VNode } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import '@/components/app/v2/TabWrap.scss';
import IndexWrap from '@/components/app/v2/index/IndexWrap';
import Pay from '@/components/app/pay/Pay';
import Profile from '@/components/app/v2/profile/Profile';
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
  private shows = [true, false, false];
  // 动画相关
  private transitionName: string = '';
  private mounted() {
    this.$store.dispatch(ORDER_NAMESPACE + ORDER.FETCH_ORDER_DISHES_ACTION);
    this.$store.dispatch(USER_NAMESPACE + USER.FETCH_USER_PROFILE_ACTION);
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

        <div class='v2-main-footer'>
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
  private changeToTab(toIndex: number) {
    const fromIndex = this.now;
    this.now = toIndex;
    const shows = new Array(3).fill(false);
    shows[toIndex] = true;
    this.transitionName =
      toIndex < fromIndex ? 'v2-slide-right' : 'v2-slide-left';
    // 由于更新次序，必须要延迟一个 tick 来更新 show 保证先 slide 动画正确，在移除
    this.$nextTick(() => {
      this.shows = shows;
    });
  }
}
