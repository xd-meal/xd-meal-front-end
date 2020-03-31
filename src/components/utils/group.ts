import lodash from 'lodash';
import moment from 'moment';
export interface IInstanceHasPickStartTime {
  pick_start: any;
}
export function getMenuGroupBy<T extends IInstanceHasPickStartTime>(
  dinings: T[],
): Array<{ key: string; value: T[] }> {
  const pDinings = lodash.sortBy(dinings, 'pick_start');
  const timeGroup: { [key: string]: T[] } = {};
  // 手工整理，不使用lodash
  // 先整理出 time: IStoreDining 的形势
  for (const item of pDinings) {
    if (item.pick_start) {
      const pickTime = moment(item.pick_start);
      const pickTimeName = pickTime.format('YYYY-MM-DD');
      if (!timeGroup?.[pickTimeName]?.push(item)) {
        timeGroup[pickTimeName] = [item];
      }
    }
  }
  // 然后使用这个形式整理成 {time, dining[]}[] 的形式
  return Object.keys(timeGroup).map((key) => ({
    key,
    value: timeGroup[key],
  }));
}
