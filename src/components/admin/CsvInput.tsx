import { VNode } from 'vue';
import { Component, Model, Vue } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

@Component
export default class CsvInput extends tsx.Component<any> {
  @Model('change', { type: File })
  protected readonly value!: File | null;
  private render(): VNode {
    return (
      <input
        type='file'
        accept='text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        onchange={this.changeFile.bind(this)}
      />
    );
  }
  private changeFile(e: InputEvent) {
    const files = (e.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      this.$emit('change', files[0]);
    }
  }
}
