<template>
  <div class="checkbox" :class="{ checkbox_active: value }" @click="toggle">
    <div class="checkbox-inner"></div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Model } from 'vue-property-decorator';

@Component
export default class Checkbox extends Vue {
  @Model('change', { type: Boolean }) readonly value!: boolean;

  private toggle() {
    this.$emit('change', !this.value);
  }
}
</script>

<style lang="scss">
.checkbox {
  display: inline-block;
  width: 16px;
  height: 16px;
  position: relative;
  line-height: 16px;
  background-color: #eeeeee;
  border-radius: 16px;
  &-inner {
    width: 8px;
    height: 8px;
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 8px;
    margin: -4px 0 0 -4px;
  }
  &_active {
    background-color: #ff6600;
    .checkbox-inner {
      background-color: #fff;
    }
  }
}
</style>
