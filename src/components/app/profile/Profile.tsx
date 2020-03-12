import './Profile.scss';
import { getActivity } from '@/components/app/ppx/activity';
import { __ } from '@/components/app/ppx/textTransform';
import { ROUTER_NAME } from '@/router';
import { loginOut } from '@/utils/common';
import { VNode } from 'vue';

import { Component } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
@Component
export default class Index extends tsx.Component<any> {
  private routers: Array<{
    name: string;
    target?: string;
    onClick?: () => void;
    class?: any;
  }> = [];
  protected render(): VNode {
    return (
      <div class='profile'>
        <div class='profile-wrap'>
          <div class='profile-name'>
            <div class='profile-name-title'>{this.name}</div>
            <div class='profile-name-desc'>{this.profileDesc}</div>
          </div>
          {Boolean(this.avatar.trim()) && (
            <div class='profile-avatar'>
              <img src={this.avatar} alt='' />
            </div>
          )}
        </div>
        <div class='profile-context'>
          {this.routers.map((item) => (
            <div class='profile-context-item'>
              <div
                class={{
                  'profile-context-item-menu': true,
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
                {item.name}
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
      // {
      //   name: '商家收藏',
      //   target: 'profile',
      // },
      {
        name: __('设置'),
        target: ROUTER_NAME.APP_SETTING,
      },
      {
        name: __('加班餐'),
        target: ROUTER_NAME.APP_SPECIAL_ORDER,
      },
    ];
    if (isWework) {
      this.routers.push({
        name: __('重设密码'),
        target: ROUTER_NAME.APP_RESET_PSW,
      });
    }
    this.routers.push({
      name: __('退出登录'),
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
