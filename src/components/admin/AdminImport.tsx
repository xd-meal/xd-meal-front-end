import { VNode } from 'vue';
import axios from 'axios';

import { Component, Vue } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

import { IDishes } from '@/api/menu';
import CsvInput from '@/components/admin/CsvInput.tsx';
@Component({
  components: {
    CsvInput,
  },
})
export default class AdminImport extends tsx.Component<any> {
  protected file: File | null = null;
  protected list: IDishes[] = [];
  private render(): VNode {
    return (
      <div>
        <h3>导入菜品</h3>
        <div>
          <label>选择文件</label>
          <CsvInput vModel={this.file} />
          <button onClick={this.importCsv.bind(this)}>校验</button>
        </div>
        {this.list.length > 0 && (
          <div>
            <table>
              <tr>
                <th>日期</th>
                <th>用餐时间（上午 1 下午 2）</th>
                <th>是否是自助 1 自助 2 简餐</th>
                <th>菜品名称</th>
                <th>供应商</th>
                <th>菜品编号</th>
              </tr>
              <tbody>
                {this.list.map((item) => {
                  return (
                    <tr>
                      <td>{item.mealDay}</td>
                      <td>{item.typeA}</td>
                      <td>{item.typeB}</td>
                      <td>{item.name}</td>
                      <td>{item.supplier}</td>
                      <td>{item.mealNum}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div>
              <button onClick={this.submit.bind(this)}>上传</button>
            </div>
          </div>
        )}
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
    const formData = new FormData();
    // File 是继承 blob 的，直接类型转换即可
    formData.append('file', this.file as Blob);
    // TODO: 抽取到 api 里面
    axios
      .post('/api/v1/ReadMenu', formData, {
        headers: {
          'Content-Type': 'multipart/form-data;charset=UTF-8',
        },
      })
      .then((res) => {
        this.list = res.data.data;
      });
  }
  private submit() {
    axios
      .post('/api/v1/ImportMenu', {
        data: this.list,
      })
      .then((res) => {
        if (res.data.code === 200) {
          this.$createDialog({
            type: 'alert',
            title: '系统提示',
            content: '提交成功',
            icon: 'cubeic-ok',
          }).show();
        } else {
          this.$createDialog({
            type: 'alert',
            title: '系统提示',
            content: res.data.msg,
            icon: 'cubeic-alert',
          }).show();
        }
      });
  }
}
