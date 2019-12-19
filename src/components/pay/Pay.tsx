import './pay.scss';
import { payCode } from '@/api/pay';
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
              <qriously class='pay-qr-code' value={this.code} size={270} />
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
  private async refreshToken() {
    const res = await payCode();
    this.stopTimer();
    if (res.code === 200) {
      this.code = res.data;
      this.startTimer(10);
    } else {
      this.startTimer(1);
    }
  }
  private mounted() {
    this.refreshToken();
  }
  // getter
  // protected get code() {
  //   return this.$store.getters[USER_NAMESPACE + USER.PAYCODE_GETTER];
  // }
}
