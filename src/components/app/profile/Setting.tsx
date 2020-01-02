import './Setting.scss';
import { userConfigUpdate } from '@/api/user';
import { ROUTER_NAME } from '@/router';
import { NOTIFICATION, NOTIFICATION_NAMESPACE } from '@/store/notification';
import { USER, USER_NAMESPACE } from '@/store/user';
import { VNode } from 'vue';
import { Component, Vue, Watch } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

import SubChildView from '@/components/utils/SubChildView';

@Component({ components: { SubChildView } })
export default class Setting extends tsx.Component<any> {
  protected notification = false;

  protected randomBtn = false;
  protected allBuffetBtn = false;

  protected advance = false;

  protected randomForNone = false;
  protected randomForChili = false;
  protected buffetForChili = false;
  protected closeCache = false;
  protected useTest = false;

  private render(): VNode {
    return (
      <SubChildView title='设置' class='setting' ref='subChild'>
        <p>功能设置</p>
        <div class='setting-content'>
          <div class='group'>
            <cube-switch vModel={this.randomBtn}>开启一键随机</cube-switch>
            <cube-switch vModel={this.allBuffetBtn}>开启一键自助</cube-switch>
          </div>
          <p>用户设置</p>
          <div class='group'>
            <cube-switch
              vModel={this.advance}
              onChange={() => (this.$refs.subChild as any).refresh()}
            >
              高级模式
            </cube-switch>
            {/*<cube-button onClick={this.resetPassword.bind(this)} primary={true}>*/}
            {/*  重设密码*/}
            {/*</cube-button>*/}
          </div>
          {this.advance && (
            <div>
              <p>高级设定</p>
              <p style='font-size: 12px;margin: 10px 15px;'>
                开启高级模式代表您已知晓高级模式带来的负面影响，包括但不限于：
                <br />
                随机选饭与预期不符，缓存失灵，界面同其他用户不同等问题。
              </p>
              <p>一键选餐设置</p>
              <cube-switch vModel={this.buffetForChili}>不自助辣</cube-switch>
              <p>随机选餐设置</p>
              <cube-switch vModel={this.randomForChili}>不随机辣</cube-switch>
              <cube-switch vModel={this.randomForNone}>随机不选餐</cube-switch>
              <p>系统设定</p>
              <cube-switch vModel={this.closeCache}>缓存禁用模式</cube-switch>
              <cube-switch vModel={this.useTest}>启用试验特性</cube-switch>
            </div>
          )}
          <div style='margin-top: 20px;'>
            <cube-button onClick={this.save.bind(this)} primary={true}>
              保存
            </cube-button>
          </div>
        </div>
      </SubChildView>
    );
  }
  // watch
  @Watch('notification')
  private onChangeValue(newVal: boolean) {
    this.$store.commit(NOTIFICATION_NAMESPACE + NOTIFICATION.SET_BUTTON, {
      status: newVal,
    });
  }
  private mounted() {
    const config = this.$store.state.user.config;
    this.randomBtn = config.randomBtn;
    this.allBuffetBtn = config.buffetBtn;
    this.advance = config.advance;
  }
  private resetPassword() {
    this.$router.push({
      name: ROUTER_NAME.APP_RESET_PSW,
    });
  }
  private async save() {
    const toast = this.$createToast({
      txt: 'loading',
      type: 'text',
      timeout: 0,
    }).show();
    const config = {
      randomBtn: this.randomBtn,
      buffetBtn: this.allBuffetBtn,
      advance: this.advance,
    };
    const res = await userConfigUpdate(config);
    toast.hide();
    if (res.code === 200) {
      await this.$store.commit(USER_NAMESPACE + USER.SET_CONFIG, { c: config });
    }
  }
}
