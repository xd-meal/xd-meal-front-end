// import { shallowMount } from '@vue/test-utils';
import {
  createIcal,
  icalTimeEnd,
  icalTimeStart,
  icalTitleFromMealList,
} from '@/components/utils/ical';
import { getDay, timeMMDD, timeParser } from '@/components/utils/time.ts';
import { MENU_TIME_TYPE } from '@/store/menu';
import moment from 'moment';
import { json } from './ical';

describe('@/components/utils/time.ts', () => {
  it('getDay', () => {
    expect(getDay('2019.06.24')).toBe('24');
    expect(getDay('2019.06.04')).toBe('04');
  });
  it('timeParser', () => {
    expect(timeParser('2019.12.19')).toBe('12月19日 星期四');
    expect(timeParser('2019.12.20')).toBe('12月20日 星期五');
    expect(timeParser('2019.12.21')).toBe('12月21日 星期六');
    expect(timeParser('2019.12.22')).toBe('12月22日 星期日');
    expect(timeParser('2019.12.23')).toBe('12月23日 星期一');
    expect(timeParser('2019.12.24')).toBe('12月24日 星期二');
    expect(timeParser('2019.12.25')).toBe('12月25日 星期三');
  });
  it('timeMMDD', () => {
    expect(timeMMDD('2019.12.25')).toBe('12月25日');
  });
});

describe('@/components/utils/ical.ts', () => {
  const getMenu = (time: MENU_TIME_TYPE) => ({
    time: '2019-12-23',
    title: '爆炒子姜鸭',
    desc: '',
    isVoteDown: false,
    type: time,
    id: '5dfab97830831e5ba0f0e986',
  });
  it('createIcal', () => {
    // XXX: 幂等性不满足无法测试
    // const REGEX = /UID:.*?@meal.xindong.com/g;
    // const receivedTxt = createIcal(json, moment('20191219T045617Z'))
    //   .replace(REGEX, '')
    //   .replace(/(\r\n|\n|\r)/g, '\n');
    // const expectTxt = text.replace(REGEX, '').replace(/(\r\n|\n|\r)/g, '\n');
    // expect(receivedTxt).toBe(expectTxt);
  });
  it('icalTitleFromMealList', () => {
    const title = icalTitleFromMealList(json);
    expect(title).toBe('12月23日-12月29日一周选饭');
  });
  it('icalTimeStart', () => {
    expect(icalTimeStart(getMenu(MENU_TIME_TYPE.BREAKFAST)).valueOf()).toBe(
      moment('2019-12-23T06:30:00+08:00').valueOf(),
    );
    expect(icalTimeStart(getMenu(MENU_TIME_TYPE.LUNCH)).valueOf()).toBe(
      moment('2019-12-23T11:30:00+08:00').valueOf(),
    );
    expect(icalTimeStart(getMenu(MENU_TIME_TYPE.FRUIT)).valueOf()).toBe(
      moment('2019-12-23T14:00:00+08:00').valueOf(),
    );
    expect(icalTimeStart(getMenu(MENU_TIME_TYPE.DINNER)).valueOf()).toBe(
      moment('2019-12-23T16:30:00+08:00').valueOf(),
    );
  });
  it('icalTimeEnd', () => {
    expect(icalTimeEnd(getMenu(MENU_TIME_TYPE.BREAKFAST)).valueOf()).toBe(
      moment('2019-12-23T11:30:00+08:00').valueOf(),
    );
    expect(icalTimeEnd(getMenu(MENU_TIME_TYPE.LUNCH)).valueOf()).toBe(
      moment('2019-12-23T13:30:00+08:00').valueOf(),
    );
    expect(icalTimeEnd(getMenu(MENU_TIME_TYPE.FRUIT)).valueOf()).toBe(
      moment('2019-12-23T16:00:00+08:00').valueOf(),
    );
    expect(icalTimeEnd(getMenu(MENU_TIME_TYPE.DINNER)).valueOf()).toBe(
      moment('2019-12-23T20:00:00+08:00').valueOf(),
    );
  });
});
