import { isDev } from '@/utils/common';
import Mock from 'mockjs';
import axios, { AxiosRequestConfig } from 'axios';
if (isDev) {
  Mock.setup({
    timeout: '400-700',
  });
} else {
  axios.defaults.baseURL = '/';

  // 创建一个拦截器，当 axios 同时请求重复 api 的时，终止请求
  const pending: {
    [key: string]: any;
  } = {};
  const CancelToken = axios.CancelToken;
  const removePending = (key: string, isRequest = false) => {
    if (pending[key] && isRequest) {
      pending[key]('取消重复请求');
    }
    delete pending[key];
  };
  const getRequestIdentify = (
    config: AxiosRequestConfig,
    isRequest = false,
  ) => {
    let url = config.url;
    if (isRequest) {
      if (config.url) {
        url = config.baseURL + config.url.substring(1, config.url.length);
      }
    }
    return config.method === 'get'
      ? encodeURIComponent(url + JSON.stringify(config.params))
      : encodeURIComponent(config.url + JSON.stringify(config.data));
  };
  axios.interceptors.request.use(
    (config) => {
      const requestData = getRequestIdentify(config, true);
      removePending(requestData, true);

      config.cancelToken = new CancelToken((c) => {
        pending[requestData] = c;
      });

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
}
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
