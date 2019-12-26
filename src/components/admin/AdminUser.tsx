import { IDishes } from '@/api/menu';
import axios from 'axios';
import { VNode } from 'vue';
import { Component, Vue, Watch } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import CsvInput from '@/components/admin/CsvInput.tsx';
import { QMarkupTable } from 'quasar';
import XLSX from 'xlsx';
function readFileAsString(files: File[]) {
  return new Promise((resolve) => {
    if (files.length === 0) {
      return '';
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        resolve(event.target.result);
      } else {
        resolve('');
      }
    };
    reader.readAsText(files[0]);
  });
}
@Component({
  components: {
    CsvInput,
    QMarkupTable,
  },
})
export default class AdminUser extends tsx.Component<any> {
  protected file: File | null = null;
  protected list: string[][] = [];
  private render(): VNode {
    return (
      <div style={{ textAlign: 'left' }}>
        <h3 class='title text-h3'>外派人员导入</h3>
        <div style={{ marginBottom: '20px' }}>
          <label>选择文件</label>
        </div>
        <div>
          <CsvInput
            vModel={this.file}
            onChange={(val: File) => this.onFileChange(val)}
          />
        </div>
        {this.list.length > 0 && this.list[0].length > 0 && (
          <q-markup-table separator={'cell'} flat bordered>
            <thead>
              <tr>
                <th class='text-right'>username</th>
                <th class='text-right'>department</th>
                <th class='text-right'>corp</th>
                <th class='text-right'>email</th>
                <th class='text-right'>password</th>
              </tr>
            </thead>
            <tbody>
              {this.list.map((item) => (
                <tr>
                  <th class='text-left'>{item[0]}</th>
                  <th class='text-left'>{item[1]}</th>
                  <th class='text-left'>{item[2]}</th>
                  <th class='text-left'>{item[3]}</th>
                  <th class='text-left'>{item[4]}</th>
                </tr>
              ))}
            </tbody>
          </q-markup-table>
        )}

        <button onclick={this.submit.bind(this)}>确认无误并上传</button>
      </div>
    );
  }

  private submit() {}

  private async onFileChange(newVal: File) {
    if (newVal) {
      const text = await readFileAsString([newVal]);
      const wb = XLSX.read(text, { type: 'binary' });
      const json = XLSX.utils.sheet_to_json(wb.Sheets.Sheet1, {
        header: 1,
        raw: true,
      });
      this.list = json as string[][];
    } else {
      this.list = [];
    }
  }
}
