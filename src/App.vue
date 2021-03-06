<template>
  <div id="app" :class="nowClass">
    <transition :name="transitionName">
      <router-view :class="{ 'none-transition': transitionName === 'none' }" />
    </transition>
  </div>
</template>

<script lang="ts">
import { isEvent } from '@/router';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';

@Component
export default class Home extends Vue {
  protected nowClass = {
    pc: false,
    standalone: false,
  };
  protected transitionName = '';

  @Watch('$route')
  public onChangeValue(newVal: Route, oldVal: Route) {
    if (!isEvent()) {
      this.transitionName = 'none';
      return;
    }
    if (newVal.meta.noAnimation || oldVal.meta.noAnimation) {
      this.transitionName = 'none';
      return;
    }
    if (newVal.meta.stop || oldVal.meta.stop) {
      this.transitionName = 'none';
      return;
    }
    if (oldVal.meta.rightOut) {
      this.transitionName = 'slide-right';
      return;
    }
    if (newVal.meta.rightIn) {
      this.transitionName = 'slide-left';
      return;
    }
  }

  @Watch('$route')
  private onRouterChanged(to: Route) {
    this.nowClass.pc = Boolean(to.fullPath.match(/pc/g));
  }

  private mounted() {
    this.nowClass.pc = Boolean(
      this.$router.currentRoute.fullPath.match(/^\/pc/g),
    );
    const loader = document.querySelector('#loader');
    if (loader) {
      loader.setAttribute('style', 'display: none;');
    }
  }
}
</script>

<style lang="scss">
.cube-dialog-main {
  border-radius: 8px !important;
}
.cube-dialog-icon {
  margin-top: 26px;
}
html {
  font-size: 62.5%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: absolute;
  width: 100%;
  height: auto;
  top: 0;
  bottom: 0;
  overflow: hidden;
}

#app.standalone {
  bottom: 34px;
}

#app {
  bottom: env(safe-area-inset-bottom);

  > div {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  }
}

.app-wrap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

* {
  padding: 0;
  margin: 0;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(100%, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-100%, 0);
}

.none-transition {
  transition: none;
}

.none-leave-active {
  transition: none;
  z-index: -1;
}
.none-enter {
  z-index: 1;
  transition: none;
}
</style>
