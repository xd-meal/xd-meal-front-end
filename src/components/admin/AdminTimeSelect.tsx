import { VNode } from 'vue';
import { Component, Model, Prop, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';
import * as tsx from 'vue-tsx-support';
import { QInput, QPopupProxy, QDate, QIcon, QTime } from 'quasar';
@Component({
  components: {
    QInput,
    QPopupProxy,
    QDate,
    QIcon,
    QTime,
  },
})
export default class AdminTimeSelect extends tsx.Component<any> {
  @Model('change', { type: String })
  protected readonly value!: string;
  protected date: string = '';
  private render(): VNode {
    return (
      <div style='max-width: 300px;display: inline-block;height: 56px;'>
        <q-input filled vModel={this.date}>
          <template slot='prepend'>
            <q-icon name='event' class='cursor-pointer'>
              <q-popup-proxy transition-show='scale' transition-hide='scale'>
                <q-date vModel={this.date} mask='YYYY-MM-DD HH:mm' />
              </q-popup-proxy>
            </q-icon>
          </template>

          <template slot='append'>
            <q-icon name='access_time' class='cursor-pointer'>
              <q-popup-proxy transition-show='scale' transition-hide='scale'>
                <q-time vModel={this.date} mask='YYYY-MM-DD HH:mm' format24h />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    );
  }
  private mounted() {
    this.date = this.value;
  }

  @Watch('date')
  private onChange(newVal: string, oldVal: string) {
    if (newVal !== oldVal) {
      this.$emit('change', newVal);
    }
  }
}
