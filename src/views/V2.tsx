import { VNode } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';
import * as tsx from 'vue-tsx-support';
import '@/views/V2.scss';
@Component({
  components: {},
})
export default class Index extends tsx.Component<any> {
  private animateDelay = 'none';
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
