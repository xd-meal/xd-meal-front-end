<template>
  <div id="app" :class="nowClass">
    <router-view />
  </div>
</template>

<script lang="ts">
import os from '@/utils/os';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';

@Component
export default class Home extends Vue {
  protected nowClass = {
    pc: false,
    standalone: false,
  };
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
    // this.nowClass.standalone =
    // (window.navigator as any).standalone && os.iphoneX;
    // this.nowClass.iosX = os.iphoneX;
  }
}
</script>

<style lang="scss">
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
</style>
