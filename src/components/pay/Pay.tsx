import './pay.scss';
import { VNode } from 'vue';

import { Component } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

import { USER_NAMESPACE, USER } from '@/store/user';

@Component
export default class Pay extends tsx.Component<any> {
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
  // getter
  protected get code() {
    return this.$store.getters[USER_NAMESPACE + USER.PAYCODE_GETTER];
  }
}
