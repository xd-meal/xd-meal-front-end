import './Setting.scss';
import { VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

import SubChildView from '@/components/utils/SubChildView';

@Component({ components: { SubChildView } })
export default class Setting extends tsx.Component<any> {
  protected notification = false;
  private render(): VNode {
    return (
      <SubChildView title='设置' class='setting'>
        <p>通知设置</p>
        <div class='setting-content'>
          <div class='group'>
            <cube-switch vModel={this.notification}>显示通知按钮</cube-switch>
          </div>
        </div>
      </SubChildView>
    );
  }
}
