import './AppMain.scss';
import { CanUserOrder } from '@/api/menu';
import { VNode } from 'vue';
import { Component, Vue, Watch } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import { Route } from 'vue-router';
interface SingleComponent {
  name: string;
  index?: number;
  key?: string;
}
interface ComponentMap {
  [key: string]: SingleComponent;
}
const components: ComponentMap = {
  index: {
    name: '菜单',
    index: 0,
  },
  pay: {
    name: '支付',
    index: 1,
  },
  profile: {
    name: '个人',
    index: 2,
  },
};
const ComponentList: SingleComponent[] = Object.keys(components).map(
  (current: string) => {
    return {
      ...components[current],
      key: current,
    };
  },
);
@Component
export default class AppMain extends tsx.Component<any> {
  private current: SingleComponent = ComponentList[0];
  private tabList: SingleComponent[] = ComponentList;
  private transitionName: string = '';
  private orderBtnShow: boolean = false;
  private get footerActiveProp() {
    const length = this.tabList.length;
    const index = this.tabList.indexOf(this.current);
    return {
      left: `${(100 / length) * index}%`,
      width: `${100 / length}%`,
    };
  }
  private get path() {
    return this.$route.name;
  }

  public changeTabName(tab: SingleComponent) {
    this.current = tab;
    this.$router.push({ name: tab.key as string });
  }

  protected render(): VNode {
    return (
      <div class='app-main'>
        <div class='body'>
          <transition name={this.transitionName}>
            <router-view class='child-view' />
          </transition>
        </div>
        {this.current.key === 'index' && this.orderBtnShow && (
          <router-link class='order-btn' to={{ name: 'order' }}>
            <span class='order-icon' />
          </router-link>
        )}
        <div class='footer-bar'>
          {/*<div class='footer-active' style={this.footerActiveProp} />*/}
          <div class='footer-bar-wrap'>
            {this.tabList.map((tab) => {
              return (
                <div
                  class={`tab ${this.current === tab ? 'tab_active' : ''}`}
                  key={tab.key}
                  onClick={() => this.changeTabName(tab)}
                >
                  <div class={{ icon: true, [tab.key as string]: true }} />
                  <div class='text'>{tab.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
  private mounted() {
    const index =
      components[this.$router.currentRoute.name as string].index || 0;
    this.current = ComponentList[index];
    if (index === 0) {
      this.refreshOrderBtn().catch(() => (this.orderBtnShow = false));
    }
  }

  private async refreshOrderBtn() {
    const data = await CanUserOrder();
    if (data.code === 200) {
      this.orderBtnShow = Boolean(data.data);
    } else {
      this.orderBtnShow = false;
    }
  }

  @Watch('$route')
  private onChangeValue(newVal: Route, oldVal: Route) {
    const index = components[newVal.name as string].index || 0;
    this.current = ComponentList[index];
    const toIndex = index;
    const fromIndex = components[oldVal.name as string].index || 0;
    this.transitionName = toIndex < fromIndex ? 'slide-right' : 'slide-left';
    if (index === 0) {
      this.refreshOrderBtn().catch(() => (this.orderBtnShow = false));
    }
  }
}
