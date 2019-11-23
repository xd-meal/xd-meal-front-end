import moment from 'moment';

export function getDay(time: string) {
  const timeTransfer = '00' + moment(time).date();
  return timeTransfer.toString().substr(timeTransfer.length - 2, 2);
}
