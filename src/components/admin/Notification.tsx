import CsvInput from '@/components/admin/CsvInput';
import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

@Component
export default class Notification extends tsx.Component<any> {
  private render(): VNode {
    return (
      <div>
        <h3 class='title'>通知发布</h3>
      </div>
    );
  }
}
