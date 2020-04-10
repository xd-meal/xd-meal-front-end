import './pay.scss';
import { payCode } from '@/api/pay';
import { VNode } from 'vue';

import { Component } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

@Component
export default class Pay extends tsx.Component<any> {
  protected d: any = {};
  protected timer: any;
  protected msg: string = '';
  protected timeInterval: number = 0;

  protected time: number = 0;
  protected delayTime: number = 60;

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
                <qriously
                  class='pay-qr-code'
                  value={'XY' + this.d.token + 'XZ'}
                  level={'L'}
                  size={270}
                />
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
    if (!(this.d.dining && this.d.order && this.d.dining.stat_type)) {
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
  private async startTimer(timeSecond: number) {
    // 先调用一次，获取 token
    await this.refreshToken();
    this.timeInterval = timeSecond;
    // 开启定时器，1秒检测一次时间是否正确
    this.timer = setInterval(async () => {
      // 当相差时间大于 60 秒的时候，刷新 token
      if (Date.now() - this.time >= this.delayTime * 1000) {
        await this.refreshToken();
      }
    }, this.timeInterval * 1000);
  }
  private stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  private async refreshToken(withMask = false): Promise<boolean> {
    const toast = this.$createToast({
      txt: 'loading',
    });
    if (withMask) {
      setTimeout(() => {
        toast.show();
      }, 300);
    }
    const res = await payCode();
    // 上一个 token 以结果时间为准,不论是否成功
    this.time = Date.now();
    // 设置为默认错误重试时间
    if (res.code === 200) {
      this.d = res.data;
      this.msg = res.msg || '';
      // 成功情况下等待 60秒
      this.delayTime = 60;
    } else {
      // 如果没有回执，说明有错误，或是没有可以领取的餐次
      this.d = { token: '12312312312awedq' };
      this.msg = res.msg || '未知错误，请联系陈总';
      // 没有可以取餐次情况下等待 30 秒，其余情况下等待 5 秒
      this.delayTime = res.msg === '目前没有可取餐次' ? 30 : 5;
    }
    toast.hide();
    return res.code === 200;
  }
  private async userRefresh() {
    await this.refreshToken(true);
  }
  private async mounted() {
    await this.startTimer(1);
  }
}
