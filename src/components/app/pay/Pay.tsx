import './pay.scss';
import { payCode } from '@/api/pay';
import { USER, USER_NAMESPACE } from '@/store/user';
import { VNode } from 'vue';

import { Component } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

@Component
export default class Pay extends tsx.Component<any> {
  protected d: any = {};
  protected timer: any;
  protected msg: string = '';
  protected timeInterval: number = 0;
  protected render(): VNode {
    return (
      <div class='pay'>
        <div class='pay-wrap'>
          <div class='pay-circle' />
          <div class='pay-logo' />
          <div class='pay-container'>
            <div class='pay-qr'>
              <div class='pay-qr-tips'>二维码60秒自动刷新</div>
              {this.d.token && (
                <qriously class='pay-qr-code' value={this.d.token} size={270} />
              )}
              {!this.d.token && (
                <div class='pay-qr-code pay-qr-code_disable'>
                  <button
                    class='pay-qr-code_disable-refresh'
                    onClick={this.userRefresh.bind(this)}
                  />
                </div>
              )}
              <div class='pay-qr-hint'>{this.dish || this.msg}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  private get dish() {
    if (!(this.d.dining && this.d.order)) {
      return '';
    }
    const dish = this.d.dining.menu.find((el: any) => {
      return el._id === this.d.order.menu_id;
    });
    return dish.title;
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
      this.d = res.data;
      this.msg = res.msg || '';
      // this.$store.commit(USER_NAMESPACE + USER.SET_TOKEN, {
      //   payCode: this.d.token,
      // });
      this.startTimer(60);
    } else if (res.msg) {
      this.d = {};
      this.msg = res.msg;
      this.startTimer(30);
    } else {
      this.d = {};
      this.startTimer(5);
    }
    toast.hide();
  }
  private userRefresh() {
    this.stopTimer();
    this.refreshToken(true);
  }
  private mounted() {
    // this.code = this.$store.state.user.payCode;
    this.refreshToken();
  }
}
