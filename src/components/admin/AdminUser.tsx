import { importUserList, IUserTableItem } from '@/api/admin';
import { IDishes } from '@/api/menu';
import axios from 'axios';
import { VNode } from 'vue';
import { Component, Vue, Watch } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import CsvInput from '@/components/admin/CsvInput.tsx';
import { QMarkupTable, QBtn } from 'quasar';
import AdminDialog from './AdminDialog';
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
declare interface IUserBackData {
  email: string;
  password: string;
}
@Component({
  components: {
    CsvInput,
    QMarkupTable,
    QBtn,
    AdminDialog,
  },
})
export default class AdminUser extends tsx.Component<any> {
  protected file: File | null = null;
  protected loading: boolean = false;
  protected list: string[][] = [];

  protected alert: boolean = false;
  protected success: boolean = false;
  protected msg: string = '';
  protected successList: IUserBackData[] = [];
  private render(): VNode {
    return (
      <div style={{ textAlign: 'left' }}>
        <h3
          class='title text-h3'
          style={{ borderBottom: '1px solid #ccc', marginBottom: '20px' }}
        >
          外派人员导入
        </h3>
        <div class='text-h4' style={{ marginBottom: '20px' }}>
          <label>选择文件</label>
        </div>
        <div>
          <CsvInput
            vModel={this.file}
            onChange={(val: File) => this.onFileChange(val)}
          />
        </div>
        {this.list.length > 0 && this.list[0].length > 0 && (
          <div>
            <q-markup-table separator='cell' flat bordered wrapCells>
              <thead>
                <tr style={{ height: '22px' }}>
                  <th class='text-right'>username</th>
                  <th class='text-right'>department</th>
                  <th class='text-right'>corp</th>
                  <th class='text-right'>email</th>
                  <th class='text-right'>password</th>
                </tr>
              </thead>
              <tbody>
                {this.list.map((item) => (
                  <tr style={{ height: '22px' }}>
                    <td class='text-left'>{item[0]}</td>
                    <td class='text-left'>{item[1]}</td>
                    <td class='text-left'>{item[2]}</td>
                    <td class='text-left'>{item[3]}</td>
                    <td class='text-left'>{item[4]}</td>
                  </tr>
                ))}
              </tbody>
            </q-markup-table>
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <q-btn
                loading={this.loading}
                // percentage='percentage2'
                round
                color='secondary'
                onclick={this.submit.bind(this)}
                icon='cloud_upload'
              />
            </div>
          </div>
        )}
        <AdminDialog ref='adminDialog'>
          <template slot='content'>
            {!this.success && this.msg}
            {this.success && (
              <q-markup-table separator='cell' flat bordered wrapCells>
                <thead>
                  <tr style={{ height: '22px' }}>
                    <th class='text-right'>email</th>
                    <th class='text-right'>password</th>
                  </tr>
                </thead>
                <tbody>
                  {this.successList.map((item) => (
                    <tr style={{ height: '22px' }}>
                      <td class='text-left'>{item.email}</td>
                      <td class='text-left'>{item.password}</td>
                    </tr>
                  ))}
                </tbody>
              </q-markup-table>
            )}
          </template>
        </AdminDialog>
      </div>
    );
  }

  private async submit() {
    this.loading = true;
    const userList: IUserTableItem[] = this.list.map((user) => ({
      username: String(user[0]),
      department: String(user[1]),
      corp: String(user[2]),
      email: String(user[3]),
      password: String(user[4]),
    }));
    const res = await importUserList(userList);
    if (res.code === 200) {
      this.successList = res.data;
      this.success = true;
    } else {
      this.success = false;
      this.msg = res.msg || '';
    }
    (this.$refs.adminDialog as AdminDialog).display();
    this.loading = false;
  }

  private async onFileChange(newVal: File) {
    if (newVal) {
      const text = await readFileAsString([newVal]);
      const wb = XLSX.read(text, { type: 'binary' });
      const json = XLSX.utils.sheet_to_json(wb.Sheets.Sheet1, {
        header: 1,
        raw: true,
      });
      json.splice(0, 1);
      this.list = json as string[][];
    } else {
      this.list = [];
    }
  }
}
