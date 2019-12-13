import { VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
@Component
export default class AdminOutput extends tsx.Component<any> {
  private render(): VNode {
    return <div></div>;
  }
}
