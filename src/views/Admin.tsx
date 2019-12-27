import './Admin.scss';

import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

import SideBar from '@/components/admin/AdminSideBar.tsx';
import {
  QLayout,
  QHeader,
  QToolbarTitle,
  QDrawer,
  QPage,
  QToolbar,
  QPageContainer,
  QScrollArea,
} from 'quasar';
@Component({
  components: {
    QLayout,
    QHeader,
    QToolbar,
    QToolbarTitle,
    QDrawer,
    QPage,
    QPageContainer,
    QScrollArea,
  },
})
export default class Admin extends tsx.Component<any> {
  protected drawerLeft: boolean = false;
  public render(): VNode {
    return (
      <q-layout
        view='lhh LpR lff'
        container
        style={{ height: window.innerHeight + 'px' }}
      >
        <q-header reveal class='bg-black'>
          <q-toolbar>
            <q-toolbar-title>Header</q-toolbar-title>
          </q-toolbar>
        </q-header>
        <q-drawer
          side='left'
          vModel={this.drawerLeft}
          width={200}
          breakpoint={500}
          content-class='bg-grey-3'
        >
          <SideBar />
        </q-drawer>
        <q-page-container>
          <q-page className='q-pa-md'>
            <router-view class='admin-child-view' />
          </q-page>
        </q-page-container>
      </q-layout>
    );
  }
}
