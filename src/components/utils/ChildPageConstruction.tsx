import './ChildPageConstruction.scss';

import { VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

@Component
export default class ChildPageConstruction extends tsx.Component<any> {
  private render(): VNode {
    return (
      <div class={{ childpage: true }}>
        <div class='childpage-header'>{this.$slots.header}</div>
        <div class='childpage-container'>{this.$slots.context}</div>
        {this.$slots.footer && (
          <div class='childpage-footer'>{this.$slots.footer}</div>
        )}
      </div>
    );
  }
}
