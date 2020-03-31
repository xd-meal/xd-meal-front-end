import { timeWeekdayParser } from '@/components/utils/time';
import moment from 'moment';
import { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import '@/components/app/v2/order/OrderTopDate.scss';
import { chunk } from 'lodash';
@Component
export default class OrderTopDate extends tsx.Component<any> {
  @Prop({
    required: true,
  })
  private currentDate?: Array<{
    time: string;
    status: boolean;
  }>;
  @Prop({
    required: true,
  })
  private activeTime?: string;

  @Prop({
    required: true,
  })
  private currentTime?: string;
  @Prop({
    required: true,
  })
  private headLoadFinish?: boolean;

  private left: number = 0;
  // 左右滑动相关
  private currentSlide: number = 0;

  private inSwipe = false;
  private additionalLeft = 0;
  private startPointX = 0;
  // 动画延迟相关
  private delay: any = null;

  public reset() {
    const activeElement = this.$refs.activeElement;
    if (!activeElement) {
      return false;
    }
    this.setPos(activeElement as HTMLElement);
    // tslint:disable-next-line:forin
    for (let index = 0; index < this.slides.length; index++) {
      const slides = this.slides[index];
      for (const date of slides) {
        if (date.time === this.activeTime) {
          this.currentSlide = index;
          return false;
        }
      }
    }
  }
  private get currentTransform() {
    if (this.inSwipe) {
      const width = (this.$refs.topDataBody as HTMLElement).clientWidth;
      return `transition: none;transform: translateX(${this.additionalLeft +
        width * -this.currentSlide}px )`;
    }
    return `transform: translate(${-100 * this.currentSlide}%, 0)`;
  }
  private touchStart(event: TouchEvent) {
    this.inSwipe = true;
    this.startPointX = event.touches[0].pageX;
    this.additionalLeft = 0;
  }
  private touchMove(event: TouchEvent) {
    const nowX = event.touches[0].pageX;
    this.additionalLeft = nowX - this.startPointX;
    event.preventDefault();
  }
  private touchEnd(event: TouchEvent) {
    this.inSwipe = false;
    if (Math.abs(this.additionalLeft) >= 30) {
      const flag =
        -1 *
        parseInt(
          String(this.additionalLeft / Math.abs(this.additionalLeft)),
          10,
        );
      if (
        this.currentSlide + flag < this.slides.length &&
        this.currentSlide + flag >= 0
      ) {
        this.currentSlide += flag;
      }
      event.preventDefault();
    }
  }
  private render(): VNode {
    return (
      <div
        class='top-date'
        onTouchstart={this.touchStart.bind(this)}
        onTouchmove={this.touchMove.bind(this)}
        onTouchend={this.touchEnd.bind(this)}
        data-for-test='orderTopDate'
      >
        <div
          class='top-date-body'
          ref='topDataBody'
          style={this.currentTransform}
        >
          {this.slides.map((slides) => (
            <div class='top-date_slide-wrap'>
              <div class='top-date-wrap' style='padding: 16px 30px 0 30px;'>
                {slides.map((d, i) =>
                  d.time === '0' ? (
                    <div class='top-date_content' />
                  ) : (
                    <div
                      class='top-date_content'
                      data-for-test={'orderTopDateDayContent' + i}
                    >
                      <div class='top-date_content-weekday'>
                        {timeWeekdayParser(d.time)}
                      </div>
                    </div>
                  ),
                )}
              </div>
              <div class='top-date-wrap' style='margin: 14px 30px 16px 30px;'>
                {slides.map((d, i) =>
                  d.time === '0' ? (
                    <div class='top-date_content' />
                  ) : (
                    <div
                      class={{
                        'top-date_content': true,
                        'top-date_content_disable': !d.status,
                      }}
                      data-for-test={'orderTopDateSlideContent' + i}
                    >
                      {this.activeTime === d.time ? (
                        <div
                          class='top-date_content-date'
                          style={`${
                            this.currentTime === d.time ? 'color: #ff6600;' : ''
                          }`}
                          onclick={this.handleActiveChange.bind(this, d)}
                          ref='activeElement'
                        >
                          <div
                            class='top-date_content-text'
                            style='color: #fff;'
                          >
                            {moment(d.time).date()}
                          </div>
                        </div>
                      ) : (
                        <div
                          class='top-date_content-date'
                          style={`${
                            this.currentTime === d.time ? 'color: #ff6600;' : ''
                          }`}
                          onclick={this.handleActiveChange.bind(this, d)}
                        >
                          <div class='top-date_content-text'>
                            {moment(d.time).date()}
                          </div>
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>
          ))}
          <div
            class={{
              'top-date_content-circle': true,
              'close-animation': !this.headLoadFinish,
            }}
            style={this.pos}
          >
            <div class='inner' />
          </div>
        </div>
        <div class='top-date_slide-pagination'>
          {this.slides.map((_, index) => (
            <div
              class={{
                'top-date_slide-pagination-part': true,
                'top-date_slide-pagination-part_active':
                  index === this.currentSlide,
              }}
            />
          ))}
        </div>
      </div>
    );
  }
  private handleActiveChange(
    d: {
      time: string;
      status: boolean;
    },
    event: MouseEvent,
  ) {
    if (!d.status) {
      return;
    }
    this.$emit('activeChange', d.time);
    const html: EventTarget | null = event.target;
    if (!html) {
      return;
    }
    this.setPos(html as HTMLElement);
  }
  private mounted() {
    this.reset();
  }
  private setPos(html: HTMLElement) {
    if (this.delay) {
      clearTimeout(this.delay);
    }
    this.delay = setTimeout(() => {
      const htmlRect = html.getBoundingClientRect();
      const left = (this.$refs
        .topDataBody as HTMLElement).getBoundingClientRect().left;
      this.left = htmlRect.left - left;
    }, 100);
  }
  private get slides(): Array<Array<{ time: string; status: boolean }>> {
    if (!this.currentDate || this.currentDate.length === 0) {
      return [];
    }
    const slides = chunk(this.currentDate, 7);
    const last = slides.length - 1;
    if (slides[last].length < 7) {
      const length = slides[last].length;
      for (let i = 0; i < 7 - length; i++) {
        slides[last].push({
          time: '0',
          status: false,
        });
      }
    }
    return slides;
  }

  private get pos() {
    if (this.activeTime != null && this.currentDate != null) {
      return {
        transform: `translate(${this.left}px, 0)`,
      };
    } else {
      return {
        display: 'none',
      };
    }
  }
}
