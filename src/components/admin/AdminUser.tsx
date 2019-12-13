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
  private render(): VNode {
    return (
      <div>
        <h3>外派人员导入</h3>
      </div>
    );
  }
}
