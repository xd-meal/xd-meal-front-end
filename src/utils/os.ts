const ua = navigator.userAgent;
const isWindowsPhone = /(?:Windows Phone)/.test(ua);
const isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone;
const isAndroid = /(?:Android)/.test(ua);
const isFireFox = /(?:Firefox)/.test(ua);
const isChrome = /(?:Chrome|CriOS)/.test(ua);
const isTablet =
  /(?:iPad|PlayBook)/.test(ua) ||
  (isAndroid && !/(?:Mobile)/.test(ua)) ||
  (isFireFox && /(?:Tablet)/.test(ua));
const isPhone = /(?:iPhone)/.test(ua) && !isTablet;
const isPc = !isPhone && !isAndroid && !isSymbian;

export default {
  isTablet,
  isPhone,
  isAndroid,
  isChrome,
  isPc,
};
