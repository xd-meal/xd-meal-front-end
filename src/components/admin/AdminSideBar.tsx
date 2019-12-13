import { VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
@Component
export default class AdminSideBar extends tsx.Component<any> {
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
            <li>
              <router-link to={{ name: link.name }}>{link.text}</router-link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
