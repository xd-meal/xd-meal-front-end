<template>
  <div id="app" :class="nowClass">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';

@Component
export default class Home extends Vue {
  protected nowClass = '';
  @Watch('$route')
  private onRouterChanged(to: Route) {
    console.log(1);
    this.nowClass = to.fullPath.match(/pc/g) ? 'pc' : '';
  }
  private mounted() {
    this.nowClass = this.$router.currentRoute.fullPath.match(/^\/pc/g)
      ? 'pc'
      : '';
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
  height: 100%;
  overflow: hidden;
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
