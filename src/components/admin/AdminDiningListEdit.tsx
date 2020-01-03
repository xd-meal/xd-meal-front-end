import { VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
@Component
export default class AdminDiningListEdit extends tsx.Component<any> {
  // TODO: 先选择时间
  // TODO: 随后将选择了的时间自动添加到列表
  // TODO: 自动填充早饭午饭晚饭
  // TODO: 可以选择关闭
  private render(): VNode {
    return <div></div>;
  }
}
