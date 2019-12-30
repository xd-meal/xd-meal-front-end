import { MENU, MENU_TIME_TYPE } from '@/store/menu';
import moment from 'moment';

export const timeIteration = [
  {
    label: '早餐',
    value: ['08:00', '10:00', 0],
    key: MENU_TIME_TYPE.BREAKFAST,
  },
  { label: '午餐', value: ['10:00', '13:30', 1], key: MENU_TIME_TYPE.LUNCH },
  { label: '晚餐', value: ['17:00', '18:30', 1], key: MENU_TIME_TYPE.DINNER },
];
export function getTimeNumber(time: string | number): number[] {
  if (/^\d{2}:\d{2}$/.test(String(time))) {
    const timeArr: string[] = String(time).split(':');
    return [parseInt(timeArr[0], 10), parseInt(timeArr[1], 10)];
  } else {
    const timeMoment = moment(time);
    return [timeMoment.get('hour'), timeMoment.get('minute')];
  }
}
export function timeNumberBeforeTarget(source: number[], target: number[]) {
  return source[0] <= target[0] && source[1] <= target[1];
}
export function timeNumberAfterTarget(source: number[], target: number[]) {
  return source[0] >= target[0] && source[1] >= target[1];
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
export function getTimeName(dining: { pick_start: string; pick_end: string }) {
  const startTime = getTimeNumber(dining.pick_start);
  const endTime = getTimeNumber(dining.pick_end);
  for (const time of timeIteration) {
    const startTimeNumber = getTimeNumber(time.value[0]);
    const endTimeNumber = getTimeNumber(time.value[1]);
    if (
      timeNumberAfterTarget(startTime, startTimeNumber) &&
      timeNumberBeforeTarget(endTime, endTimeNumber)
    ) {
      return time.label;
    }
  }
  const outputStr = 'HH:mm';
  return (
    moment(dining.pick_start).format(outputStr) +
    '-' +
    moment(dining.pick_end).format(outputStr)
  );
}
