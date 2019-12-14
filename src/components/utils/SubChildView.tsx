import ChildPageConstruction from '@/components/utils/ChildPageConstruction';
import CommonHeader from '@/components/utils/CommonHeader';
import { VNode } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import * as tsx from 'vue-tsx-support';

@Component({
  components: {
    CommonHeader,
  },
})
export default class SubChildView extends tsx.Component<any> {
  @Prop({
    required: true,
  })
  protected title!: string;
  @Prop()
  protected goBackPath!: RouteConfig | string;
  private render(): VNode {
    return (
      <ChildPageConstruction class='subchild'>
        <div class='subchild-header' slot='header'>
          <CommonHeader
            slot='header'
            title={this.title}
            goBackPath={this.goBackPath}
          />
        </div>
        <div class='subchild-body' slot='context'>
          <cube-scroll
            ref='scroll'
            options={{
              directionLockThreshold: 0,
            }}
          >
            {this.$slots.default}
          </cube-scroll>
        </div>
      </ChildPageConstruction>
    );
  }
}
