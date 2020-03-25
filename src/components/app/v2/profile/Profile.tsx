import '@/components/app/v2/profile/Profile.scss';
import { getActivity } from '@/components/app/ppx/activity';
import { __ } from '@/components/app/ppx/textTransform';
import { ROUTER_NAME } from '@/router';
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
      </div>
    );
  }
  protected mounted() {
    const isWework = Boolean(this.$store.state.user.wework_userid);
    this.routers = [
      {
        name: __('设置'),
        target: ROUTER_NAME.APP_SETTING,
        icon: 'icon setting',
      },
    ];
    if (isWework) {
      this.routers.push({
        name: __('重设密码'),
        target: ROUTER_NAME.APP_RESET_PSW,
        icon: 'icon resetpwd',
      });
    }
    this.routers.push({
      name: __('退出登录'),
      icon: 'icon logout',
      onClick: this.loginout.bind(this),
      class: {
        error: true,
      },
    });
  }
  private get profileDesc() {
    const config = this.$store.state.user.config;
    if (config.ppx) {
      return getActivity(this.name);
    }
    return '再忙也要好好吃饭哟～';
  }
  private loginout() {
    loginOut(this);
  }
  private get name() {
    return this.$store.state.user.username || '木得名字的宝宝';
  }
  private get avatar() {
    return this.$store.state.user.avatar;
  }
}
