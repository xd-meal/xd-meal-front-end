import './Admin.scss';

import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

import SideBar from '@/components/admin/AdminSideBar.tsx';

@Component({
  components: {
    SideBar,
  },
})
export default class Admin extends tsx.Component<any> {
  public render(): VNode {
    return (
      <div class='admin'>
        <div class='admin-sidebar'>
          <SideBar />
        </div>
        <div class='admin-child'>
          <router-view class='admin-child-view' />
        </div>
      </div>
    );
  }
}
