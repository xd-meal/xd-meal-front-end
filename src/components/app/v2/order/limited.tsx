import { VNode } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
@Component
export default class Limited extends tsx.Component<any> {
  private render(): VNode {
    return <div></div>;
  }
}
