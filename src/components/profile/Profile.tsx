import './Profile.scss';
import { logoutApi } from '@/api/login';
import { VNode } from 'vue';
import axios from 'axios';

import { Component, Vue } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

@Component
export default class Index extends tsx.Component<any> {
  protected render(): VNode {
    return (
      <div class='profile'>
        <div class='profile-wrap'>
          <div class='profile-name'>
            <div class='profile-name-title'>心动吴彦祖</div>
            <div class='profile-name-desc'>在忙也要好好吃饭哟～</div>
          </div>
          <div class='profile-avatar'></div>
        </div>
        <div class='profile-context'>
          {[
            // {
            //   name: '商家收藏',
            //   target: 'profile',
            // },
            // {
            //   name: '商家收藏',
            //   target: 'profile',
            // },
            {
              name: '通知提醒',
              target: 'notification',
            },
            {
              name: '设置',
              target: 'setting',
            },
            {
              name: '退出登录',
              onClick: this.loginout.bind(this),
              class: {
                error: true,
              },
            },
          ].map((item) => (
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
  private async loginout() {
    const res = await logoutApi();
    if (res.code === 200) {
      this.$router.push({
        name: 'login',
      });
    } else {
      this.$createDialog({
        type: 'alert',
        title: '系统提示',
        content: res.msg,
        icon: 'cubeic-alert',
      }).show();
    }
  }
}
