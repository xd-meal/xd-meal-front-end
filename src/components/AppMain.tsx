import './AppMain.scss';
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
    index: 1,
  },
  pay: {
    name: '支付',
    index: 2,
  },
  profile: {
    name: '个人',
    index: 3,
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
    this.$router.push(tab.key as string);
  }

  @Watch('$route')
  public onChangeValue(newVal: Route, oldVal: Route) {
    const toIndex = components[newVal.name as string].index || 0;
    const fromIndex = components[oldVal.name as string].index || 0;
    this.transitionName = toIndex < fromIndex ? 'slide-right' : 'slide-left';
  }
  protected render(): VNode {
    return (
      <div class='app-main'>
        <div class='body'>
          <transition name={this.transitionName}>
            <router-view class='child-view' />
          </transition>
        </div>
        {this.current.key === 'index' && (
          <router-link class='order-btn' to={{ name: 'order' }}>
            订餐
          </router-link>
        )}
        <div class='footer-bar'>
          <div class='footer-active' style={this.footerActiveProp} />
          <div class='footer-bar-wrap'>
            {this.tabList.map((tab) => {
              return (
                <div
                  class={`tab ${this.current === tab ? 'active' : ''}`}
                  key={tab.key}
                  onClick={() => this.changeTabName(tab)}
                >
                  {tab.name}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
