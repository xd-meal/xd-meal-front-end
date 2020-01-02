import { QBtn, QCard, QCardActions, QCardSection, QDialog } from 'quasar';
import { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
@Component({
  components: {
    QBtn,
    QDialog,
    QCard,
    QCardActions,
    QCardSection,
  },
})
export default class AdminDialog extends tsx.Component<any> {
  protected show: boolean = false;
  public display() {
    this.show = true;
  }
  public close() {
    this.show = false;
  }

  private render(): VNode {
    return (
      <q-dialog vModel={this.show}>
        <q-card style={{ width: '700px', maxWidth: '80vw' }}>
          <q-card-section>
            {this.$slots.title || <div class='text-h4'>系统提示</div>}
          </q-card-section>
          <q-card-section>{this.$slots.content}</q-card-section>
          <q-card-actions align='right'>
            <div>
              {this.$slots.footer || (
                <q-btn flat label='OK' color='primary' v-popup-close />
              )}
            </div>
          </q-card-actions>
        </q-card>
      </q-dialog>
    );
  }
}
