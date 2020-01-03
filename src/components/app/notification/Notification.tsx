import './Notification.scss';
import { INotification } from '@/store/notification';
import { VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

import SubChildView from '@/components/utils/SubChildView';
import NotificationGroup from '@/components/app/notification/NotificationGroup.tsx';
@Component({ components: { SubChildView, NotificationGroup } })
export default class Notification extends tsx.Component<any> {
  protected notification = false;
  private render(): VNode {
    return (
      <SubChildView title='通知' class='notification'>
        <div class='notification-wrap'>
          {this.list.map((item) => (
            <NotificationGroup value={item} />
          ))}
        </div>
      </SubChildView>
    );
  }
  // getter
  protected get list(): INotification[] {
    return this.$store.state.notification.list;
  }
}
