import './pay.scss';
import { payCode } from '@/api/pay';
import { USER, USER_NAMESPACE } from '@/store/user';
import { VNode } from 'vue';

import { Component } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

@Component
export default class Pay extends tsx.Component<any> {
  protected code: string = '';
  protected timer: any;
  protected timeInterval: number = 0;
  protected render(): VNode {
    return (
      <div class='pay'>
        <div class='pay-wrap'>
          <div class='pay-circle' />
          <div class='pay-logo' />
          <div class='pay-container'>
            <div class='pay-qr'>
              <div class='pay-qr-tips'>二维码30秒自动刷新</div>
              {this.code && (
                <qriously class='pay-qr-code' value={this.code} size={270} />
              )}
              {!this.code && (
                <div class='pay-qr-code pay-qr-code_disable'>
                  <button
                    class='pay-qr-code_disable-refresh'
                    onClick={this.userRefresh.bind(this)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  private destroyed() {
    this.stopTimer();
  }
  private startTimer(timeSecond: number) {
    this.timeInterval = timeSecond;
    this.timer = setTimeout(() => {
      this.refreshToken().catch();
    }, this.timeInterval * 1000);
  }
  private stopTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
  private async refreshToken(withMask = false) {
    const toast = this.$createToast({
      txt: 'loading',
    });
    if (withMask) {
      setTimeout(() => {
        toast.show();
      }, 300);
    }
    const res = await payCode();
    this.stopTimer();
    if (res.code === 200) {
      this.code = res.data;
      this.$store.commit(USER_NAMESPACE + USER.SET_TOKEN, {
        payCode: this.code,
      });
      this.startTimer(30);
    } else {
      this.startTimer(1);
    }
    toast.hide();
  }
  private userRefresh() {
    this.stopTimer();
    this.refreshToken(true);
  }
  private mounted() {
    this.code = this.$store.state.user.payCode;
    this.refreshToken();
  }
}
