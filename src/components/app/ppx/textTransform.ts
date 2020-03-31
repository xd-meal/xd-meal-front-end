/* tslint:disable:object-literal-key-quotes */
import store from '@/store/user';
const list: { [key: string]: string } = {
  ['下单']: '恰饭',
  ['全自助']: '全自助',
  ['随机选']: '随机选',
};
export function __(str: string): string {
  if (store?.state?.config?.ppx) {
    return list[str] ?? str;
  }
  return str;
}
