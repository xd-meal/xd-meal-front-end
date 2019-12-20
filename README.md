# xd-meal
[![Build Status](https://travis-ci.com/xd-meal/xd-meal-front-end.svg?branch=develop)](https://travis-ci.com/xd-meal/xd-meal-front-end)
[![codecov](https://codecov.io/gh/xd-meal/xd-meal-front-end/branch/develop/graph/badge.svg)](https://codecov.io/gh/xd-meal/xd-meal-front-end)

## 安装项目

```
yarn install
```

### 开发环境

```
yarn run serve
```

### 生产环境构建
```
yarn run build
```

### 更正格式错误

```
yarn run lint
```

### 执行测试
```
yarn run test:unit
```

## 项目约定

1. 使用 typescript 开发
2. 添加单元测试并做检查，但不强求完整单元测试,建议使用 snapshot 功能，做大致的快照检测即可
3. 前端开发情况下所有 api 请自行构建 mock 数据
