import { IStoreDining, IStoreDish } from '@/store/order';
export interface IRule {
  regexp?: RegExp;
  filterFn?: (item: IStoreDish) => boolean;
}
const RULE_MAP: {
  [key: string]: IRule;
} = {
  NO_SPICY: {
    filterFn: (i) => !/辣/g.test(i.title + i.desc),
  },
  NO_EMPTY: {
    filterFn: (item) => item._id !== '5e1eae86623bc9589663614d',
  },
};
export function filterMenuList(
  list: IStoreDish[],
  pRules: Array<string | IRule>,
): IStoreDish[] {
  const rules = pRules.map((rule) => {
    if (typeof rule === 'string') {
      return (
        RULE_MAP[rule] || {
          filterFn: () => true,
        }
      );
    }
    return rule;
  });

  return list.filter((i) => {
    for (const rule of rules) {
      // 如果rule fn判定不需要，则过滤之
      if (rule.filterFn) {
        if (!rule.filterFn(i)) {
          return false;
        }
      }
      // 如果 regexp 判定不通过则过滤之
      if (rule.regexp) {
        if (rule.regexp.test(i.title)) {
          return false;
        }
      }
    }
    return true;
  });
}
