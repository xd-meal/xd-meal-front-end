import './NotificationGroup.scss';
import { INotification } from '@/store/notification';
import { VNode } from 'vue';
import { Component, Vue, Prop } from 'vue-property-decorator';
import moment from 'moment';
import * as tsx from 'vue-tsx-support';
@Component
export default class NotificationGroup extends tsx.Component<any> {
  @Prop({ required: true })
  public value!: INotification;
  // getter
  protected get title() {
    return this.value.title;
  }
  protected get time() {
    return moment(this.value.time).format('YYYY.MM.DD');
  }
  protected get desc() {
    return this.value.desc;
  }
  private render(): VNode {
    return (
      <div class='notification-group'>
        <h3 class='notification-group-title'>{this.title}</h3>
        <p class='notification-group-time'>{this.time}</p>
        <p class='notification-group-desc'>{this.desc}</p>
      </div>
    );
  }
}
