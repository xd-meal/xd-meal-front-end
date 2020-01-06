import { IDining, IDish } from '@/api/admin';
import { IAdminDish } from '@/components/admin/AdminImport';
import { VNode } from 'vue';
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import {
  QScrollArea,
  QInput,
  QDialog,
  QCard,
  QCardSection,
  QList,
  QItem,
  QItemSection,
} from 'quasar';
export interface IAdminDing {
  _id?: string;
  order_start: number;
  order_end: number;
  pick_start: number;
  pick_end: number;
  stat_type: 0 | 1;
  name: string;
  menu: IAdminDish[];
}
@Component({
  components: {
    QScrollArea,
    QInput,
    QDialog,
    QCard,
    QCardSection,
    QList,
    QItem,
    QItemSection,
  },
})
export default class extends tsx.Component<any> {
  @Prop() protected list!: IAdminDish[];
  protected display = false;
  protected keyword = '';
  protected now: {
    menu: IAdminDish[];
  } | null = null;
  protected nowIndex: number = -1;
  public show(item: { menu: IAdminDish[] }, index: number = -1) {
    this.display = true;
    this.now = item;
    this.nowIndex = index;
  }
  public hide() {
    this.display = false;
  }
  private render(): VNode {
    return (
      <q-dialog vModel={this.display} position='top' class='add-dish-dialog'>
        <q-card style='width: 450px;'>
          <q-card-section class='row items-center no-wrap' style='padding: 0;'>
            <div style='width: 100%;'>
              <q-input
                vModel={this.keyword}
                label='请输入关键词'
                filled
                dense={true}
              />
            </div>
          </q-card-section>
          <q-card-section
            className='row items-center no-wrap'
            style='padding: 0;'
          >
            <q-scroll-area style='height: 400px; width: 100%;'>
              <q-list bordered separator>
                {this.listFiltered.map((item: IAdminDish) => (
                  <q-item
                    clickable
                    onClick={() =>
                      this.$emit('add', item, this.now, this.nowIndex)
                    }
                  >
                    {/*v-ripple*/}
                    <q-item-section>
                      {item.title}({item._id})
                    </q-item-section>
                  </q-item>
                ))}
              </q-list>
            </q-scroll-area>
          </q-card-section>
        </q-card>
      </q-dialog>
    );
  }
  protected get listFiltered() {
    if (!this.keyword) {
      return this.list.filter((dish) => {
        return !this.now?.menu.some(
          (item: IAdminDish) => item._id === dish._id,
        );
      });
    }
    return this.list.filter((dish) => {
      if (this.now?.menu.some((item: IAdminDish) => item._id === dish._id)) {
        return false;
      }
      return (dish.title || '').indexOf(this.keyword) > -1;
    });
  }
}
