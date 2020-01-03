import { ISingleMenuItem, MENU_TIME_TYPE } from '@/store/menu';
import ical from 'ical-generator';
import lodash from 'lodash';
import moment from 'moment';

const TIME_STRING_TEMPLATE = 'MM月DD日';

export function createIcal(mealList: ISingleMenuItem[], time = moment()) {
  const cal = ical({
    domain: 'meal.xindong.com',
    name: icalTitleFromMealList(mealList),
  });
  mealList.forEach((meal: ISingleMenuItem) => {
    cal.createEvent({
      start: icalTimeStart(meal),
      end: icalTimeEnd(meal),
      stamp: time,
      summary: meal.desc,
    });
  });
  return cal.toString();
}

export function icalTimeStart(meal: ISingleMenuItem) {
  let hour;
  let minute;
  switch (meal.type) {
    case MENU_TIME_TYPE.BREAKFAST:
      hour = 6;
      minute = 30;
      break;
    case MENU_TIME_TYPE.LUNCH:
      hour = 11;
      minute = 30;
      break;
    case MENU_TIME_TYPE.FRUIT:
      hour = 14;
      minute = 0;
      break;
    case MENU_TIME_TYPE.DINNER:
      hour = 16;
      minute = 30;
      break;
    default:
      hour = 0;
      minute = 0;
  }
  return moment(meal.time, ['YYYY-MM-DD'])
    .utcOffset(480)
    .set('hour', hour)
    .set('minute', minute);
}
export function icalTimeEnd(meal: ISingleMenuItem) {
  let hour;
  let minute;
  switch (meal.type) {
    case MENU_TIME_TYPE.BREAKFAST:
      hour = 11;
      minute = 30;
      break;
    case MENU_TIME_TYPE.LUNCH:
      hour = 13;
      minute = 30;
      break;
    case MENU_TIME_TYPE.FRUIT:
      hour = 16;
      minute = 0;
      break;
    case MENU_TIME_TYPE.DINNER:
      hour = 20;
      minute = 0;
      break;
    default:
      hour = 0;
      minute = 0;
  }
  return moment(meal.time, ['YYYY-MM-DD'])
    .utcOffset(480)
    .set('hour', hour)
    .set('minute', minute);
}
export function icalTitleFromMealList(mealList: ISingleMenuItem[]): string {
  const timeKeys: number[] = lodash(mealList)
    .groupBy('time')
    .keys()
    .map((_) => moment(_).valueOf())
    .value();

  const timeMax = lodash.max(timeKeys);
  const timeMin = lodash.min(timeKeys);
  return (
    moment(timeMin).format(TIME_STRING_TEMPLATE) +
    '-' +
    moment(timeMax).format(TIME_STRING_TEMPLATE) +
    '一周选饭'
  );
}
