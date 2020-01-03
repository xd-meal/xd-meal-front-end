import { VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
@Component
export default class AdminEdit extends tsx.Component<any> {
  protected email: string = '';
  protected list = [];
  private render(): VNode {
    return (
      <div>
        <div>
          <label htmlFor=''>邮箱</label>
          <input type='text' id='username' vModel={this.email} />
          <button onClick={this.search.bind(this)}>搜索</button>
        </div>
        {this.list.length === 0 && <div>查无此人</div>}
        {this.list.length > 0 && <div>{JSON.stringify(this.list)}</div>}
      </div>
    );
  }
  private search() {
    // TODO: API 查询
  }
}
