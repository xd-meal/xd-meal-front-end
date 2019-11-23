import { VNode } from 'vue';
import * as tsx from 'vue-tsx-support';
import { Component } from 'vue-property-decorator';

import { USER, USER_NAMESPACE } from '@/store/user';
import { IUserLoginData } from '@/api/login';

@Component
export default class Login extends tsx.Component<any> {
  protected username: string = '';
  protected password: string = '';
  public render(): VNode {
    return (
      <div class='login-wrap'>
        <div class='sign-in'>
          <div class='title'>Sign in</div>
          <div class='input-wrap'>
            <div class='username'>
              <label for='username' />
              <input
                type='text'
                name='username'
                id='username'
                vModel={this.username}
              />
            </div>
            <div class='password'>
              <label for='password' />
              <input
                type='text'
                name='password'
                id='password'
                vModel={this.password}
              />
            </div>
          </div>
          <button class='btn btn-primary login' onClick={() => this.login()}>
            登陆
          </button>
        </div>
        <div class='error'>{this.status}</div>
      </div>
    );
  }
  private login() {
    this.$store.dispatch(USER_NAMESPACE + USER.LOGIN_ACTION);
  }
  get status() {
    return this.$store.state.user.loginStatus;
  }
}
