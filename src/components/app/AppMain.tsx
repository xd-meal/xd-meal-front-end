import './AppMain.scss';
import { isEvent } from '@/router';
import { ORDER, ORDER_NAMESPACE } from '@/store/order';
import { USER, USER_NAMESPACE } from '@/store/user';
import { VNode } from 'vue';
import { Component, Watch } from 'vue-property-decorator';
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
    name: '取餐',
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
    this.$router.push({ name: tab.key as string });
  }

  public get current(): SingleComponent {
    for (const component of ComponentList) {
      if (component.key === this.$route.name) {
        return component;
      }
    }
    return ComponentList[0];
  }

  protected render(): VNode {
    return (
      <div class='app-main'>
        <div class='body'>
          <transition name={this.transitionName}>
            <router-view
              class={{
                'child-view': true,
                'none-transition': this.transitionName === 'none',
              }}
            />
          </transition>
        </div>
        {this.current?.key === 'index' && this.orderBtnShow && (
          <router-link class='order-btn' to={{ name: 'order' }}>
            <span class='order-icon' />
          </router-link>
        )}
        <div class='footer-bar'>
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
    this.$store.dispatch(USER_NAMESPACE + USER.FETCH_USER_PROFILE_ACTION);
    if (this.current.index === 0) {
      this.refreshOrderBtn().catch(() => (this.orderBtnShow = false));
    }
  }

  private async refreshOrderBtn() {
    const shouldLoad = this.$store.getters[
      ORDER_NAMESPACE + ORDER.SHOULD_UPDATE
    ];
    if (shouldLoad) {
      await this.$store.dispatch(
        ORDER_NAMESPACE + ORDER.FETCH_ORDER_DISHES_ACTION,
      );
      this.orderBtnShow = this.$store.state.order.list.length > 0;
    }
  }

  @Watch('$route')
  private onChangeValue(newVal: Route, oldVal: Route) {
    const index = components[newVal.name as string].index || 0;
    const toIndex = index;
    const fromIndex = components[oldVal.name as string].index || 0;
    this.transitionName = toIndex < fromIndex ? 'slide-right' : 'slide-left';
    if (index === 0) {
      this.refreshOrderBtn().catch(() => (this.orderBtnShow = false));
    }
    if (!isEvent()) {
      this.transitionName = 'none';
    }
  }
}
