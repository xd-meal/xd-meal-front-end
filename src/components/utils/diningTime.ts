import moment from 'moment';
// XXX: don`t know why error
enum MENU_TIME_TYPE {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  FRUIT = 'fruit',
}
export const timeIteration = [
  {
    label: '早餐',
    value: ['08:25', '09:45', 0],
    key: MENU_TIME_TYPE.BREAKFAST,
  },
  { label: '午餐', value: ['11:45', '13:30', 1], key: MENU_TIME_TYPE.LUNCH },
  { label: '晚餐', value: ['17:45', '19:30', 1], key: MENU_TIME_TYPE.DINNER },
];
const cache: { [key: string]: number[] } = {};
export function getTimeNumber(time: string | number): number[] {
  if (cache[time]) {
    return cache[time];
  }
  if (/^\d{2}:\d{2}$/.test(String(time))) {
    const timeArr: string[] = String(time).split(':');
    cache[time] = [parseInt(timeArr[0], 10), parseInt(timeArr[1], 10)];
    return cache[time];
  }
  const timeMoment = moment(time).utcOffset(480);
  cache[time] = [timeMoment.get('hour'), timeMoment.get('minute')];
  return cache[time];
}
export function timeNumberBeforeTarget(source: number[], target: number[]) {
  return source[0] * 60 + source[1] <= target[0] * 60 + target[1];
}
export function timeNumberAfterTarget(source: number[], target: number[]) {
  return source[0] * 60 + source[1] >= target[0] * 60 + target[1];
}
export function getTimeType(dining: {
  pick_start: string;
  pick_end: string;
}): {
  label: string;
  value: Array<string | number>;
  key: MENU_TIME_TYPE;
} | null {
  const startTime = getTimeNumber(dining.pick_start);
  const endTime = getTimeNumber(dining.pick_end);
  for (const time of timeIteration) {
    const startTimeNumber = getTimeNumber(time.value[0]);
    const endTimeNumber = getTimeNumber(time.value[1]);
    if (
      timeNumberAfterTarget(startTime, startTimeNumber) &&
      timeNumberBeforeTarget(endTime, endTimeNumber)
    ) {
      return time;
    }
  }
  return null;
}
const timeNameCache: { [key: string]: string } = {};
export function getTimeName(dining: {
  pick_start: string;
  pick_end: string;
}): string {
  const key = dining.pick_start + dining.pick_end;
  if (timeNameCache[key]) {
    return timeNameCache[key];
  }
  const startTime = getTimeNumber(dining.pick_start);
  const endTime = getTimeNumber(dining.pick_end);
  for (const time of timeIteration) {
    const startTimeNumber = getTimeNumber(time.value[0]);
    const endTimeNumber = getTimeNumber(time.value[1]);
    if (
      timeNumberAfterTarget(startTime, startTimeNumber) &&
      timeNumberBeforeTarget(endTime, endTimeNumber)
    ) {
      timeNameCache[key] = time.label;
      return time.label;
    }
  }
  const outputStr = 'HH:mm';
  timeNameCache[key] =
    moment(dining.pick_start)
      .utcOffset(480)
      .format(outputStr) +
    '-' +
    moment(dining.pick_end)
      .utcOffset(480)
      .format(outputStr);

  return timeNameCache[key];
}
