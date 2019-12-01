import './PcLogin.scss';
import { VNode } from 'vue';

import { Component } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

@Component
export default class PcLogin extends tsx.Component<any> {
  protected render(): VNode {
    return <div class='pcorder'></div>;
  }
}
