import './Profile.scss';
import { VNode } from 'vue';

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
            {
              name: '商家收藏',
              target: 'profile',
            },
            {
              name: '商家收藏',
              target: 'profile',
            },
            {
              name: '通知提醒',
              target: 'profile',
            },
            {
              name: '设置',
              target: 'profile',
            },
          ].map((item) => (
            <div class='profile-context-item'>
              <div class='profile-context-item-menu'>{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
