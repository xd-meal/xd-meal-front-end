import './QRLogin.scss';

import { VNode } from 'vue';
import * as tsx from 'vue-tsx-support';
import { Component } from 'vue-property-decorator';

import { USER, USER_NAMESPACE } from '@/store/user';

@Component
export default class Login extends tsx.Component<any> {
  public render(): VNode {
    return (
      <div class='app-qrlogin'>
        <div class='app-login-wrap'>
          <div class='xd-logo' />
          <div id='corp-wechat-sso-launcher'>
            <div class='wework-login-item'>
              <a
                onClick={() => this.doQRLogin('xd')}
                href='javascript:void(0)'
                style='background:no-repeat #ff6600 url(https://osf.xdcdn.net/EntWechat-xdos/c56d2277/03c142137b24ad6b14494ccd0369863010d972e0.svg);border:1px solid #ff6600;color: #ffffff;'
              >
                <span>心动网络</span>
              </a>
            </div>
            <div class='wework-login-item'>
              <a
                // onClick={() => this.doQRLogin('tap')}
                href='javascript:void(0)'
                style='background:no-repeat #00B9C8 url(https://osf.xdcdn.net/EntWechat-xdos/c56d2277/9e5c03ec7e32c8249fe4e51760e609d64a9266a8.png);border:1px solid #00B9C8;color: #ffffff;'
              >
                <span>TapTap</span>
              </a>
            </div>
            <div class='wework-login-item'>
              <a
                // onClick={() => this.doQRLogin('xdg')}
                href='javascript:void(0)'
                style='background:no-repeat #E71A3C url(https://osf.xdcdn.net/EntWechat-xdos/c56d2277/6ef66098acb8733b767734f098005c2a5ce72f77.png);border:1px solid #E71A3C;color: #ffffff;'
              >
                <span>龙成网络</span>
              </a>
            </div>
            <div class='wework-login-item'>
              <a
                // onClick={() => this.doQRLogin('???')}
                href='javascript:void(0)'
                style='background:no-repeat #4D91BB url(https://osf.xdcdn.net/EntWechat-xdos/c56d2277/27f1a88a22d60d0b38e4c0f4d97097a1b5ccd08e.svg);border:1px solid #4D91BB;color: #fff;'
              >
                <span>赋游网络</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  private doQRLogin(corp: string) {
    const params = new URLSearchParams();
    let corpid: string = '';
    let agentid: string = '';
    switch (corp) {
      case 'xd':
        corpid = 'wxe2be6e5c62e7b072';
        agentid = '1000033';
        break;
      case 'xdg':
        corpid = 'ww126a15b3a0d87c23';
        break;
      case 'tap':
        corpid = 'wwc2b230af5a43715b';
        break;
      // case 'xd':
      //   corpid = 'wxe2be6e5c62e7b072';
      //   break;

      default:
        break;
    }
    params.set('appid', corpid);
    params.set('agentid', agentid);
    params.set('state', 'wework_redirect');
    params.set(
      'redirect_uri',
      encodeURIComponent(window.location.origin + '/#/login'),
    );
    const url =
      'https://open.work.weixin.qq.com/wwopen/sso/qrConnect?' +
      params.toString();
    window.location.href = url;
  }
}
