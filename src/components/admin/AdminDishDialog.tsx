import { createDish } from '@/api/admin';
import { QInput } from 'quasar';
import { VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import AdminDialog from '@/components/admin/AdminDialog';
import { QBtn } from 'quasar';
@Component({
  components: {
    AdminDialog,
    QInput,
    QBtn,
  },
})
export default class AdminDishDialog extends tsx.Component<any> {
  protected title: string = '';
  protected desc: string = '';
  protected supplier: string = '';

  public show() {
    (this.$refs.dialog as AdminDialog).display();
  }
  private render(): VNode {
    return (
      <AdminDialog ref='dialog'>
        <template slot='title'>
          <h3 class='text-h4'>创建菜品</h3>
        </template>
        <template slot='content'>
          <div class='input-group'>
            <q-input
              outlined
              vModel={this.title}
              label='餐品名字'
              dense={false}
            />
          </div>
          <div class='input-group'>
            <q-input
              filled
              type='textarea'
              vModel={this.desc}
              autogrow
              label='餐品描述'
            />
          </div>
          <div class='input-group'>
            <q-input
              outlined
              vModel={this.supplier}
              label='餐品供应商'
              dense={false}
            />
          </div>
        </template>
        <template slot='footer'>
          <q-btn
            flat
            label='确认'
            color='primary'
            onClick={this.onOk.bind(this)}
          />
        </template>
      </AdminDialog>
    );
  }
  private async onOk() {
    const res = await createDish({
      title: this.title,
      supplier: this.supplier,
      desc: this.desc,
    });
    if (res.code === 200) {
      this.$q.notify({
        color: 'white',
        textColor: 'primary',
        position: 'top',
        message: '创建成功',
      });
      this.$emit('createSuccess', res.data);
      (this.$refs.dialog as AdminDialog).close();
    } else {
      this.$q.notify({
        color: 'white',
        textColor: 'negative',
        position: 'top',
        message: res.msg || '未知错误',
      });
    }
  }
}
