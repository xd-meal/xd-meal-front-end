import './AdminSideBar.scss';
import { VNode } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { Route, VueRouter } from 'vue-router/types/router';
import * as tsx from 'vue-tsx-support';
@Component
export default class AdminSideBar extends tsx.Component<any> {
  protected active: any = null;
  protected linkList = [
    {
      name: 'adminImport',
      text: '导入菜品',
    },
    {
      name: 'adminUser',
      text: '外派导入',
    },
    {
      name: 'adminOutput',
      text: '导出列表',
    },
    {
      name: 'adminEdit',
      text: '单独加菜',
    },
    {
      name: 'adminSwitch',
      text: '后台开关',
    },
  ];
  protected render(): VNode {
    return (
      <div class='sidebar'>
        <ul>
          {this.linkList.map((link) => (
            <li class={{ active: this.active === link }}>
              <router-link to={{ name: link.name }}>{link.text}</router-link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  @Watch('$route')
  private onChange(newVal: Route) {
    for (const item of this.linkList) {
      if (item.name === newVal.name) {
        this.active = item;
        return;
      }
    }
  }
  private mounted() {
    for (const item of this.linkList) {
      if (item.name === this.$router.currentRoute.name) {
        this.active = item;
        return;
      }
    }
  }
}
