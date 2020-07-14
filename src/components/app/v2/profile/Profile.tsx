import '@/components/app/v2/profile/Profile.scss';
import { getActivity } from '@/components/app/ppx/activity';
import { __ } from '@/components/app/ppx/textTransform';
import { ROUTER_NAME } from '@/router';
import { ORDER, ORDER_NAMESPACE } from '@/store/order';
import { loginOut } from '@/utils/common';
import { VNode } from 'vue';

import { Component } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
@Component
export default class V2Profile extends tsx.Component<any> {
  private routers: Array<{
    name: string;
    target?: string;
    icon?: string;
    onClick?: () => void;
    class?: any;
  }> = [];
  private isWework = true;
  protected render(): VNode {
    return (
      <div class='v2_profile'>
        <div class='v2_profile-wrap'>
          <div class='v2_profile-name'>
            <div class='v2_profile-name-title'>{this.name}</div>
            <div class='v2_profile-name-desc'>{this.profileDesc}</div>
          </div>
          {Boolean(this.avatar.trim()) && (
            <div class='v2_profile-avatar'>
              <img src={this.avatar} alt='' />
            </div>
          )}
        </div>
        <div class='v2_profile-context'>
          {this.routers.map((item, i) => (
            <div
              class='v2_profile-context-item'
              style={i === this.routers.length - 1 ? 'border: none;' : ''}
            >
              <div
                class={{
                  'v2_profile-context-item-menu': true,
                  ...(item.class || {}),
                }}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  }
                  if (item.target) {
                    this.$router.push({
                      name: item.target,
                    });
                  }
                }}
              >
                <i class={item.icon} />
                <span>{item.name}</span>
              </div>
            </div>
          ))}
        </div>
        {!this.isWework && (
          <div
            class='v2_profile-logout'
            role='button'
            onclick={this.loginOut.bind(this)}
          >
            退出登录
          </div>
        )}
      </div>
    );
  }
  protected mounted() {
    this.isWework = Boolean(this.$store.state.user.wework_userid);
    this.routers = [
      {
        name: __('设置'),
        target: ROUTER_NAME.APP_SETTING,
        icon: 'icon setting',
      },
    ];
    if (!this.isWework) {
      this.routers.push({
        name: __('重设密码'),
        target: ROUTER_NAME.APP_RESET_PSW,
        icon: 'icon resetpwd',
      });
    }
    if (this.$store.state.user.corp === 'xd') {
      this.routers.push({
        icon: 'icon service',
        name: __('猛戳陈总（反馈）'),
        onClick: () => {
          // TODO: 跳转并联系 陈总
        },
      });
    }
    this.routers.push({
      icon: 'icon limit',
      name: __('限量菜品'),
      onClick: () => {
        const list = this.$store.getters[
          ORDER_NAMESPACE + ORDER.ORDER_LIMIT_LIST
        ];
        if (list.length === 0) {
          const toast = this.$createToast({
            txt: '没有可选择的限量菜品',
            type: 'text',
            timeout: 3000,
          });
          toast.show();
          return;
        }
        this.$router.push({
          name: ROUTER_NAME.APP_LIMITED_V2,
        });
      },
    });

    // this.routers.push({
    //   name: __('退出登录'),
    //   icon: 'icon logout',
    //   onClick: this.loginout.bind(this),
    //   class: {
    //     error: true,
    //   },
    // });
  }
  private get profileDesc() {
    const config = this.$store.state.user.config;
    if (config.ppx) {
      return getActivity(this.name);
    }
    return __('再忙也要好好吃饭哟～');
  }
  private loginOut() {
    loginOut(this);
  }
  private get name() {
    return this.$store.state.user.username || __('木得名字的宝宝');
  }
  private get avatar() {
    return this.$store.state.user.avatar;
  }
}
