import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
@Component
export default class ProgressLine extends tsx.Component<any> {
  private render(): VNode {
    return <div></div>;
  }
}
