import { filterMenuList } from '@/components/utils/filter.ts';
import { IStoreDish } from '@/store/order';

const menus: IStoreDish[] = [
  {
    _id: 'c5e1eae86623bc9589663614d',
    title: '今天不吃饭',
    desc: '选择了今天不吃饭的，这顿可就木的了！',
    supplier: '',
  },
  {
    _id: '1',
    title: '套餐1',
    desc: '辣子鸡',
    supplier: '',
  },
  {
    _id: '2',
    title: '自助餐',
    desc: '麻辣香锅',
    supplier: '',
  },
  {
    _id: '3',
    title: '香辣蟹炖排条',
    desc: '',
    supplier: '',
  },
  {
    _id: '4',
    title: '青椒炒肉丝饭',
    desc: '',
    supplier: '',
  },
  {
    _id: '5',
    title: '咕咾肉',
    desc: '',
    supplier: '',
  },
];
describe('@/components/utils/filterList.ts', () => {
  it('NO_SPICY should filter spicy', () => {
    const newMenus = filterMenuList(menus, ['NO_SPICY']).map((_) => _._id);
    expect(newMenus).toEqual(['c5e1eae86623bc9589663614d', '4', '5']);
  });
  it('NO_EMPTY should filter `今天不吃饭`', () => {
    const newMenus = filterMenuList(menus, ['NO_EMPTY']).map((_) => _._id);
    expect(newMenus).toEqual(['1', '2', '3', '4', '5']);
  });
});
