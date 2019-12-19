import './Setting.scss';
import { NOTIFICATION, NOTIFICATION_NAMESPACE } from '@/store/notification';
import { VNode } from 'vue';
import { Component, Vue, Watch } from 'vue-property-decorator';
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
          <p>用户设置</p>
          <div class='group'>
            <cube-button onClick={this.resetPassword.bind(this)} primary={true}>
              重设密码
            </cube-button>
          </div>
        </div>
      </SubChildView>
    );
  }
  // watch
  @Watch('notification')
  private onChangeValue(newVal: boolean) {
    this.$store.commit(NOTIFICATION_NAMESPACE + NOTIFICATION.SET_BUTTON, {
      status: newVal,
    });
  }
  private mounted() {
    this.notification = this.$store.state.notification.isShow;
  }
  private resetPassword() {
    this.$router.push({
      name: 'resetpsw',
    });
  }
}
