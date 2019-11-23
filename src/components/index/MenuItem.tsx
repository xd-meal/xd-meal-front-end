import { ISingleMenuItem } from '@/store/menu';
import { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import moment from 'moment';
function timeFormat(time: string) {
  return moment(time).format('DD');
}
@Component
export default class MenuItem extends tsx.Component<any> {
  @Prop(Array) public readonly data: ISingleMenuItem[] | undefined;

  protected render(): VNode {
    const { currentDate } = this;
    return (
      <div class=''>
        <div class='left-col'>
          {currentDate.map((item) => (
            <div>{timeFormat(item.key)}</div>
          ))}
        </div>
        <div class='body-col'></div>
      </div>
    );
  }

  protected get currentDate() {
    const group: any = {};
    if (this.data) {
      this.data.forEach((data) => {
        if (!group[data.time]) {
          group[data.time] = [data];
        } else {
          group[data.time].push(data);
        }
      });
    }
    return Object.keys(group)
      .sort()
      .map((key: string) => ({ key, group: group[key] }));
  }
}
