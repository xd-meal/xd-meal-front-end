import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import '@/views/V2.scss';
@Component({
  components: {},
})
export default class Index extends tsx.Component<any> {
  public render(): VNode {
    return (
      <div class='v2' style={{ height: '100%' }}>
        <transition name='delay'>
          <router-view class='v2-global-wrap' />
        </transition>
      </div>
    );
  }
}
