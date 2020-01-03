import {
  ActionSheet,
  CascadePicker,
  DatePicker,
  Dialog,
  ImagePreview,
  Picker,
  Popup,
  SegmentPicker,
  TimePicker,
  Toast,
} from 'cube-ui';
import { CubeUIComponent } from 'cube-ui/types/component';
import Vue, { VNode } from 'vue';

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
// 注意因 vue 本身对 ts 的不友好，这里 ts 无法准确的判定
// @component 或是 tsx.Component 创建出的对象所具有的属性
// 所以这里只能通过此方法阻止提示
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    [propName: string]: any;

    ref?: string;
  }
}
