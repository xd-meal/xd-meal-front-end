import { VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
@Component
export default class AdminLogin extends tsx.Component<any> {
  private render(): VNode {
    return <div class='admin-login'></div>;
  }
}
