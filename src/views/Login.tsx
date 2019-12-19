import './Login.scss';

import { VNode } from 'vue';
import * as tsx from 'vue-tsx-support';
import { Component } from 'vue-property-decorator';

import { USER, USER_NAMESPACE } from '@/store/user';

@Component
export default class Login extends tsx.Component<any> {
  protected username: string = '';
  protected password: string = '';
  public render(): VNode {
    return (
      <div class='app-login'>
        <div class='app-login-wrap'>
          <div class='xd-logo' />
          <div class='app-login-form'>
            <div class='app-login__input-wrap'>
              <input
                class='app-login-input'
                type='text'
                name='username'
                id='username'
                placeholder='心动邮箱'
                vModel={this.username}
              />
            </div>
            <div class='app-login__input-wrap password'>
              <input
                class='app-login-input'
                type='password'
                name='password'
                id='password'
                placeholder='密码'
                vModel={this.password}
              />
            </div>
          </div>
          <div class='app-login-forget'>找回密码</div>
          <div class='app-login-buttons'>
            <button class='app-login-submit' onClick={() => this.login()}>
              登陆
            </button>
            <button
              class='app-login-qrcode'
              onClick={() =>
                this.$router.push({
                  name: 'qrlogin',
                })
              }
            ></button>
          </div>
        </div>
        {/*<div class='error'>{this.status}</div>*/}
      </div>
    );
  }
  private async login() {
    const toast = this.$createToast({
      txt: 'loading',
      time: 20000,
    });
    const timer = setTimeout(() => {
      toast.show();
    }, 800);
    const data = await this.$store.dispatch(
      USER_NAMESPACE + USER.LOGIN_ACTION,
      {
        email: this.username,
        password: this.password,
      },
    );
    clearTimeout(timer);
    if (data.status) {
      toast.hide();
    } else {
      toast.hide();
      this.$createToast({
        txt: data.msg,
        time: 2000,
        type: 'txt',
      }).show();
    }
  }
  get status() {
    return this.$store.state.user.loginStatus;
  }
}
