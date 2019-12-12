import { VNode } from 'vue';
import axios from 'axios';

import { Component, Vue } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
@Component
export default class AdminImport extends tsx.Component<any> {
  protected file: File | null = null;
  private render(): VNode {
    return (
      <div>
        <label>选择文件</label>
        <input
          type='file'
          accept='text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          onChange={this.changeFile.bind(this)}
        />
        <button onClick={this.importCsv.bind(this)}>上传</button>
      </div>
    );
  }
  private changeFile(e: InputEvent) {
    const files = (e.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      this.file = files[0];
    }
  }
  private importCsv() {
    // TODO: 上传 csv
    // 实例化
    const formData = new FormData();
    // File 是继承 blob 的，直接类型转换即可
    formData.append('data', this.file as Blob);
    axios
      .post('/api/v1/ImportMenu', formData, {
        headers: {
          'Content-Type': 'multipart/form-data;charset=UTF-8',
        },
      })
      .then((data) => {
        console.log(data);
      });
  }
}
