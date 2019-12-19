// import { shallowMount } from '@vue/test-utils';
import { createIcal } from '@/components/utils/ical';
import { getDay, timeParser, timeMMDD } from '@/components/utils/time.ts';
import { json, text } from './ical';
import moment from 'moment';

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
  it('createIcal', () => {
    const REGEX = /UID:.*?@meal.xindong.com/g;
    const receivedTxt = createIcal(json, moment('20191219T045617Z'))
      .replace(REGEX, '')
      .replace(/(\r\n|\n|\r)/g, '\n');
    const expectTxt = text.replace(REGEX, '').replace(/(\r\n|\n|\r)/g, '\n');
    expect(receivedTxt).toBe(expectTxt);
  });
});
