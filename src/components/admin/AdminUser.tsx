import { IDishes } from '@/api/menu';
import axios from 'axios';
import { VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import CsvInput from '@/components/admin/CsvInput.tsx';

@Component({
  components: {
    CsvInput,
  },
})
export default class AdminUser extends tsx.Component<any> {
  protected file: File | null = null;
  protected list: [] = [];
  private render(): VNode {
    return (
      <div>
        <h3 class='title'>外派人员导入</h3>
        <div style={{ marginBottom: '20px' }}>
          <label>选择文件</label>
        </div>
        <div>
          <CsvInput vModel={this.file} />
        </div>
        <button onclick={this.submit.bind(this)}>确认无误并上传</button>
      </div>
    );
  }

  private submit() {
    // TODO: 上传 csv
    const formData = new FormData();
    // File 是继承 blob 的，直接类型转换即可
    formData.append('file', this.file as Blob);
    axios
      .post('/api/v1/ImportUser\n', formData, {
        headers: {
          'Content-Type': 'multipart/form-data;charset=UTF-8',
        },
      })
      .then((res) => {
        this.$createDialog({
          type: 'alert',
          title: '系统提示',
          content: res.data.msg,
        }).show();
      });
  }
}
