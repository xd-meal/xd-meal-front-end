import { IIndexMyDining } from '@/components/app/v2/index/IndexWrap';
import { timeWeekdayParser } from '@/components/utils/time';
import { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import '@/components/app/v2/index/IndexPanel.scss';
const TYPE_LIST = [
  {
    name: null,
    reg: /不吃饭/g,
  },
  {
    name: '自助',
    reg: /自助/g,
  },
  {
    name: '面点',
    reg: /面/g,
  },
  {
    name: '简餐',
    reg: /.*/g,
  },
];
function getTitleLabelType(name: string) {
  for (const type of TYPE_LIST) {
    if (type.reg.test(name)) {
      return type.name;
    }
  }
}
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
          <div class='v2_index-panel_tab-list_tab type'>
            {this.dining.title}
          </div>
          <div class='v2_index-panel_tab-list_tab time'>
            星期{timeWeekdayParser(this.dining.pick_start)}
          </div>
          {this.labelName && (
            <div class='v2_index-panel_tab-list_tab name'>{this.labelName}</div>
          )}
        </div>
        <div class='v2_index-panel_text'>
          {this.dining?.menu.title}
          <br />
          {this.dining?.menu.desc}
        </div>
      </div>
    );
  }
  protected get labelName() {
    return getTitleLabelType(String(this.dining?.menu.title));
  }
}
