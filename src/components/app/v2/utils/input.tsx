import { VNode } from 'vue';
import { Component, Model, Prop, Vue } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import './input.scss';
@Component
export default class Input extends tsx.Component<any> {
  @Model('change')
  protected value?: string;
  @Prop()
  protected type?: string;
  @Prop()
  protected label?: string;
  @Prop()
  protected focusPlaceholder?: string;

  private onFocus = false;
  private v2InputClass = 'v2-input';
  private setV2InputClass() {
    const classes = ['v2-input'];
    if (this.onFocus) {
      classes.push('focus');
    }
    if (this.value) {
      classes.push('has-value');
    }
    this.v2InputClass = classes.join(' ');
  }
  private render(): VNode {
    return (
      <div class={this.v2InputClass}>
        <div class='split' />
        <div class='label'>{this.label}</div>
        <div class='focus-label'>{this.value ? '' : this.focusPlaceholder}</div>
        <input
          type={this.type || 'text'}
          placeholde=''
          onfocus={() => {
            this.onFocus = true;
            this.setV2InputClass();
          }}
          onblur={() => {
            this.onFocus = false;
            this.setV2InputClass();
          }}
          oninput={(e: any) => {
            this.update(e);
            if (!e.currentTarget.value) {
              this.v2InputClass = 'v2-input focus';
            }
          }}
          onChange={(e: any) => {
            this.update(e);
            this.setV2InputClass();
          }}
        />
      </div>
    );
  }
  private update(event: Event) {
    this.$emit('change', (event?.currentTarget as HTMLInputElement)?.value);
  }
}
