import './Pc.scss';

import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

import AppMain from '@/components/AppMain.tsx';

@Component({
  components: {
    AppMain,
  },
})
export default class Pc extends tsx.Component<any> {
  public render(): VNode {
    return (
      <div class='pc-wrap'>
        <router-view class='pc-child-view' />
      </div>
    );
  }
}
