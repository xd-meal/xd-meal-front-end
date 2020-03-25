import { IIndexMyDining } from '@/components/app/v2/index/IndexWrap';
import { VNode } from 'vue';
import { Component, Vue, Prop } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import '@/components/app/v2/index/IndexPanel.scss';

const BUFFET_REG = /自助/g;
@Component
export default class IndexPanel extends tsx.Component<any> {
  @Prop({
    required: true,
  })
  public dining?: IIndexMyDining;
  @Prop({
    required: true,
  })
  public time?: string;
  private render(): VNode {
    if (!this.dining) {
      return <div />;
    }

    return (
      <div class='v2_index-panel'>
        <div class='v2_index-panel_tab-list'>
          <div class='v2_index-panel_tab-list_tab time'>{this.time}</div>
          <div class='v2_index-panel_tab-list_tab type'>
            {this.dining.title}
          </div>
          <div class='v2_index-panel_tab-list_tab name'>
            {this.isBuffet ? '自助餐' : '简餐'}
          </div>
        </div>
        <div class='v2_index-panel_text'>{this.dining?.menu.desc}</div>
      </div>
    );
  }
  protected get isBuffet() {
    return BUFFET_REG.test(String(this.dining?.menu.title));
  }
}
