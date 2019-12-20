import './ResetPassword.scss';
import { resetPwd } from '@/api/login';
import { gotoLogin } from '@/utils/common';
import { VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

import SubChildView from '@/components/utils/SubChildView';

@Component({ components: { SubChildView } })
export default class ResetPassword extends tsx.Component<any> {
  protected oldPsw: string = '';
  protected newPsw: string = '';
  protected newPswRe: string = '';
  private render(): VNode {
    return (
      <SubChildView title='重设密码' class='resetpsw'>
        <div class='resetpsw-content'>
          <p>请输入原始密码</p>
          <cube-input
            eye={true}
            type='password'
            clearable={true}
            maxlength={22}
            vModel={this.oldPsw}
          />
          <p>请输入新密码</p>
          <cube-input
            eye={true}
            vModel={this.newPsw}
            type='password'
            maxlength={22}
            clearable={true}
          />
          <p>请再次输入新密码</p>
          <cube-input
            eye={true}
            vModel={this.newPswRe}
            type='password'
            maxlength={22}
            clearable={true}
          />
          <cube-button onClick={this.resetPassword.bind(this)} primary={true}>
            确认重设密码
          </cube-button>
        </div>
      </SubChildView>
    );
  }
  private async resetPassword() {
    if (this.newPsw !== this.newPswRe) {
      return this.$createToast({
        txt: '两次输入的密码不一致',
        type: 'text',
      }).show();
    }
    if (this.newPsw.length <= 6) {
      return this.$createToast({
        txt: '密码位数不得小于 7',
        type: 'text',
      }).show();
    }
    // TODO: 对接 API
    const res = await resetPwd(this.oldPsw, this.newPsw);
    if (res.code === 200) {
      return this.$createDialog({
        type: 'alert',
        title: '系统提示',
        content: res.msg,
        icon: 'cubeic-alert',
        showClose: false,
        onConfirm: gotoLogin,
      }).show();
    } else {
      return this.$createToast({
        txt: res.msg,
        type: 'text',
      }).show();
    }
  }
}
