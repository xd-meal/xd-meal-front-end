import { VNode } from 'vue';
import axios from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
@Component
export default class AdminSwitch extends tsx.Component<any> {
  protected switch: boolean = false;
  private render(): VNode {
    return (
      <div>
        <h3>开关订餐</h3>
        <div>当前订餐状态：</div>
        {this.switch ? (
          <div>
            <div>开启</div>
            <div>
              <button onClick={this.setSwitch.bind(this, false)}>
                关闭订餐
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div>关闭</div>
            <div>
              <button onClick={this.setSwitch.bind(this, true)}>
                开启订餐
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  private setSwitch(flag: boolean) {
    axios
      .post('/api/v1/EnableOrderSwitch', {
        enable: flag ? 1 : 0,
      })
      .then((res) => {
        if (res.data.code === 200) {
          this.$createDialog({
            type: 'alert',
            title: '系统提示',
            content: '成功',
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
      })
      .then(() => {
        this.refreshData();
      });
  }
  private refreshData() {
    axios.get('/api/v1/GetOrderSwitch').then((res) => {
      if (res.data.code === 200) {
        this.switch = Boolean(res.data.data);
      }
    });
  }
  private mounted() {
    this.refreshData();
  }
}
