import './CsvInput.scss';
import { VNode } from 'vue';
import { Component, Model, Vue } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

@Component
export default class CsvInput extends tsx.Component<any> {
  @Model('change', { type: File })
  protected readonly value!: File | null;
  private render(): VNode {
    return (
      <div class='uploader'>
        <div class='before' style={{ display: this.value ? 'none' : 'block' }}>
          <div class='uploader-title'>点击添加</div>
          <div class='uploader-desc'>支持 Excel </div>
          <input
            class='uploader-file'
            type='file'
            accept='text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            onchange={this.changeFile.bind(this)}
          />
        </div>

        {this.value && (
          <div class='after'>
            <div>{(this.value as File).name}</div>
            <button onclick={this.delete.bind(this)}>删除</button>
          </div>
        )}
      </div>
    );
  }
  private changeFile(e: InputEvent) {
    const files = (e.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      this.$emit('change', files[0]);
    }
  }
  private delete() {
    this.$emit('change', null);
  }
}
