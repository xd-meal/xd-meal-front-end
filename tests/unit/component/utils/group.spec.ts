import {
  IInstanceHasPickStartTime,
  getMenuGroupBy,
} from '@/components/utils/group';
import lodash from 'lodash';
import moment from 'moment';
interface IGroupMockDate extends IInstanceHasPickStartTime {
  id: number;
}
const md1: IGroupMockDate = {
  id: 1,
  pick_start: '2020-01-17T09:00:00.000Z',
};
const md2: IGroupMockDate = {
  id: 2,
  pick_start: '2020-01-16T09:00:00.000Z',
};
const md3: IGroupMockDate = {
  id: 3,
  pick_start: '2020-01-19T09:00:00.000Z',
};
const md4: IGroupMockDate = {
  id: 4,
  pick_start: '2020-01-11T09:00:00.000Z',
};
const md5: IGroupMockDate = {
  id: 5,
  pick_start: '2020-01-20T09:00:00.000Z',
};
// md4 md2 md1 md3 md5
const mockArray = [md1, md2, md3, md4, md5];
const YYYYMMDD = 'YYYY-MM-DD';
describe('@/components/utils/group', () => {
  it('getMenuGroupBy was sorted by pick_start time and return instance of each menu instead of clone item', () => {
    const ma = lodash(mockArray).clone();
    const list = getMenuGroupBy(ma);
    const d0: string = moment(ma[0].pick_start).format(YYYYMMDD);
    const d1: string = moment(ma[1].pick_start).format(YYYYMMDD);
    const d2: string = moment(ma[2].pick_start).format(YYYYMMDD);
    const d3: string = moment(ma[3].pick_start).format(YYYYMMDD);
    const d4: string = moment(ma[4].pick_start).format(YYYYMMDD);
    expect(list[0].key).toBe(d3);
    expect(list[1].key).toBe(d1);
    expect(list[2].key).toBe(d0);
    expect(list[3].key).toBe(d2);
    expect(list[4].key).toBe(d4);
    expect(list[0].value[0]).toBe(md4);
    expect(list[1].value[0]).toBe(md2);
    expect(list[2].value[0]).toBe(md1);
    expect(list[3].value[0]).toBe(md3);
    expect(list[4].value[0]).toBe(md5);
    expect(list).toMatchSnapshot('menuGroupSnapshot');
  });
});
