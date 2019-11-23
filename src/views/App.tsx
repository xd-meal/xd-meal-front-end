import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

import AppMain from '@/components/AppMain.tsx';

@Component({
  components: {
    AppMain,
  },
})
export default class Index extends tsx.Component<any> {
  public render(): VNode {
    return (
      <div class='app-wrap'>
        <App-Main />
      </div>
    );
  }
}
