import moment from 'moment';

export function getDay(time: string) {
  const timeTransfer = '00' + moment(time).date();
  return timeTransfer.toString().substr(timeTransfer.length - 2, 2);
}

export function timeParser(time: string) {
  return moment(time)
    .format('MM月DD日 星期(e)')
    .replace(
      /\(\d\)/,
      (d: string) =>
        ['日', '一', '二', '三', '四', '五', '六'][
          parseInt(d.replace(/[()]/g, ''), 10)
        ],
    );
}
