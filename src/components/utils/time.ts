import moment from 'moment';

export function getDay(time: string) {
  const timeTransfer = '00' + moment(time, ['YYYY-MM-DD']).date();
  return timeTransfer.toString().substr(timeTransfer.length - 2, 2);
}
const timeRegex = /\(\d\)/;
const parenthesesRegex = /[()]/g;
export function timeWeekdayParser(time: string) {
  return moment(time, ['YYYY-MM-DD'])
    .format('(e)')
    .replace(
      timeRegex,
      (d: string) =>
        ['日', '一', '二', '三', '四', '五', '六'][
          parseInt(d.replace(parenthesesRegex, ''), 10)
        ],
    );
}
export function timeParser(time: string) {
  return moment(time, ['YYYY-MM-DD'])
    .format('MM月DD日 星期(e)')
    .replace(
      timeRegex,
      (d: string) =>
        ['日', '一', '二', '三', '四', '五', '六'][
          parseInt(d.replace(parenthesesRegex, ''), 10)
        ],
    );
}
export function timeMMDD(time: string) {
  return moment(time, ['YYYY-MM-DD']).format('MM月DD日');
}
