import Mock from 'mockjs';
Mock.setup({
  timeout: '400-700',
});
export const defaultResponse = {
  code: 0,
  msg: '网络错误',
  data: {},
};

export const defaultOkMock = {
  code: 200,
  data: '',
  msg: '操作成功（这是一个 mock 数据）',
};
