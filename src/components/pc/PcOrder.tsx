import './PcOrder.scss';
import { VNode } from 'vue';
import Mock from 'mockjs';

import { Component } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

import Checkbox from '@/components/utils/Checkbox.tsx';

declare interface IOrder {
  title: string;
  chooseList: Array<{ type: string; desc: string; checked: boolean }>;
}
@Component({
  components: {
    Checkbox,
  },
})
export default class PcOrder extends tsx.Component<any> {
  protected list: IOrder[] = [];

  protected render(): VNode {
    return (
      <div class='pcorder'>
        <header class='pc-header'>
          <div class='pc-header-wrap'>
            <div class='pc-header-logo'></div>
            <div class='pc-header-right'>
              <button>登陆选饭</button>
              <button>下载app</button>
            </div>
          </div>
        </header>
        <div class='pc-order-wrap'>
          <h3 class='pc-order-wrap-title'>
            <span class='strong' style={{ marginRight: '25px' }}>
              xxx月xxx日--xx月xx日一周选饭
            </span>
            <span class='light'>
              友情提示选饭包括 #午饭 和 晚饭#！感谢配合～
            </span>
          </h3>
          <div class='pc-order-content'>
            {this.list.map((item) => {
              return (
                <section class='pc-day-menu'>
                  <h3>{item.title}</h3>
                  {item.chooseList.map((_) => {
                    return (
                      <div class='pc-single-check'>
                        <Checkbox vModel={_.checked} />
                        <div class='pc-single-check-wrap'>
                          <div class='pc-single-check-text'>
                            <div class='pc-single-check-text-title'>
                              {_.type}
                            </div>
                            <div class='pc-single-check-text-desc'>
                              {_.desc}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </section>
              );
            })}
          </div>
        </div>
        <div class='pc-order-progress-bar progress'>
          <div class='progress-wrap'>
            <div class='progress-left'>
              <div class='progress-left-wrap'>
                <div class='progress-left-inner' style={{ width: '50%' }}></div>
              </div>
            </div>
            <div class='progress-right'>
              <button class='progress-right-btn btn-default random'>
                随机选饭
              </button>
              <button class='progress-right-btn btn-default all'>
                全部自助
              </button>
              <button class='progress-right-btn btn-primary'>提交</button>
              <button class='progress-right-btn btn-primary calendar'>
                下载日历
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  private mounted() {
    this.list = Mock.mock({
      'data|10': [
        {
          'title|1': 'title @cword(5)',
          'chooseList|5': [
            {
              type: '@cword(3)',
              desc: '@cword(3): @cword(15,50)',
              selected: false,
            },
          ],
        },
      ],
    }).data;
    //   [
    //   {
    //     title: '1. 午饭 ～ 午饭 - 9月2日 周一',
    //     chooseList: [
    //       {
    //         type: '自助餐',
    //         desc:
    //           '大荤：红酒焖牛腩，啤酒鸭，上海熏鱼；小荤：四川肉末麻婆豆腐（微辣），莴笋鸡片；素菜：清炒蒜苗，荷塘小炒，清炒杭白菜汤',
    //         selected: false,
    //       },
    //       {
    //         type: '简餐',
    //         desc:
    //           ' 鸡胸肉红肠沙拉香煎鸡胸肉、红肠、圣女果、水果玉米、黄瓜、混合生菜基底 配千岛酱（供应商多点沙拉）',
    //         selected: false,
    //       },
    //       {
    //         type: '简餐',
    //         desc: ' 糖醋里脊配西葫芦肉片（供应商大宁中心美食）',
    //         selected: false,
    //       },
    //       {
    //         type: '简餐',
    //         desc: ' 辣味小炒肉（微辣）（供应商红采餐饮）',
    //         selected: false,
    //       },
    //       {
    //         type: '简餐',
    //         desc: ' 泡菜培根炒饭配意式红肠烩时蔬（供应商大宁中心美食）',
    //         selected: false,
    //       },
    //       {
    //         type: '今天不吃午饭',
    //         desc: '',
    //         selected: false,
    //       },
    //     ],
    //   },
    // ];
  }
}
