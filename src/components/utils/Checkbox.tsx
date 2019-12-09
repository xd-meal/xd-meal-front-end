import './Checkbox.scss';
import { Component, Prop, Vue, Model } from 'vue-property-decorator';

@Component
export default class Checkbox extends Vue {
  @Model('change', { type: Boolean }) protected readonly value!: boolean;

  protected render() {
    return (
      <div
        class={{ checkbox_active: this.value, checkbox: true }}
        click={this.toggle}
      >
        <div class='checkbox-inner' />
      </div>
    );
  }

  private toggle() {
    this.$emit('change', !this.value);
  }
}
