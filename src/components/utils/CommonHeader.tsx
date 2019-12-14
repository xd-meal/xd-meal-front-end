import './CommonHeader.scss';
import { VNode } from 'vue';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import * as tsx from 'vue-tsx-support';

@Component
export default class CommonHeader extends tsx.Component<any> {
  @Prop({
    required: true,
  })
  protected title!: string;
  @Prop()
  protected goBackPath!: RouteConfig | string;
  private render(): VNode {
    return (
      <div class='common-header'>
        <div class='common-header-wrap'>
          <div class='common-header__go-back' onclick={this.goBack.bind(this)}>
            <i class='cubeic-back' />
          </div>
          <div class='common-header-title'>{this.title}</div>
        </div>
      </div>
    );
  }
  private goBack() {
    if (this.goBackPath) {
      this.$router.push(this.goBackPath);
    } else {
      this.$router.back();
    }
  }
}
