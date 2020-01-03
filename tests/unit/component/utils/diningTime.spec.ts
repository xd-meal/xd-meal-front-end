import {
  getTimeType,
  getTimeName,
  getTimeNumber,
  timeNumberAfterTarget,
  timeNumberBeforeTarget,
} from '@/components/utils/diningTime';
import { MENU_TIME_TYPE } from '@/store/menu';

describe('@/components/utils/diningTime', () => {
  it('timeNumberAfterTarget(11:30, 12:00) should return false', () => {
    expect(timeNumberAfterTarget([11, 30], [12, 0])).toBe(false);
  });

  it('timeNumberAfterTarget(12:00, 11:30) should return true', () => {
    expect(timeNumberAfterTarget([12, 0], [11, 30])).toBe(true);
  });
  it('timeNumberBeforeTarget(11:30, 12:00) should return true', () => {
    expect(timeNumberBeforeTarget([11, 30], [12, 0])).toBe(true);
  });

  it('timeNumberBeforeTarget(12:00, 11:30) should return false', () => {
    expect(timeNumberBeforeTarget([12, 0], [11, 30])).toBe(false);
  });
  it('getTimeType(11:50, 13:00) should be lunch', () => {
    const time = getTimeType({
      pick_start: '2016-01-18T11:50:00+08:00',
      pick_end: '2016-01-18T13:00:00+08:00',
    });
    expect(time?.key).toBe(MENU_TIME_TYPE.LUNCH);
    expect(time?.label).toBe('午餐');
  });
  it('getTimeType(8:50, 9:20) should be breakfast', () => {
    const time = getTimeType({
      pick_start: '2016-01-18T08:50:00+08:00',
      pick_end: '2016-01-18T09:20:00+08:00',
    });
    expect(time?.key).toBe(MENU_TIME_TYPE.BREAKFAST);
    expect(time?.label).toBe('早餐');
  });
  it('getTimeType(17:50, 18:20) should be dinner', () => {
    const time = getTimeType({
      pick_start: '2016-01-18T17:50:00+08:00',
      pick_end: '2016-01-18T18:20:00+08:00',
    });
    expect(time?.key).toBe(MENU_TIME_TYPE.DINNER);
    expect(time?.label).toBe('晚餐');
  });
  it('getTimeName returns timeStr which is unknown time', () => {
    const time = getTimeName({
      pick_start: '2016-01-18T00:50:00+08:00',
      pick_end: '2016-01-18T00:58:00+08:00',
    });
    expect(time).toBe('00:50-00:58');
  });
});
