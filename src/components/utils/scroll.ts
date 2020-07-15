/**
 * @param t 当前时间
 * @param b 开始值
 * @param c 变化值
 * @param d 持续时长
 */
function easeInOutQuad(t: number, b: number, c: number, d: number) {
  t /= d / 2;
  if (t < 1) {
    return (c / 2) * t * t + b;
  }
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
}

export interface IScrollObj {
  timer: number;
  finish: boolean;
  timerClose: number;
}

/**
 * @param element dom
 * @param to 需要滚动到的位置
 * @param duration 动画时常
 * @return {IScrollObj}
 */
export function scrollTo(
  element: Element,
  to: number,
  duration: number,
): IScrollObj {
  const start = element.scrollTop;
  const change = to - start;
  let currentTime = 0;
  const increment = 16;
  const animateObj: IScrollObj = {
    timer: 0,
    finish: false,
    timerClose: 0,
  };
  const animateScroll = () => {
    currentTime += increment;
    const val = easeInOutQuad(currentTime, start, change, duration);
    element.scrollTop = val;
    if (currentTime < duration) {
      // @ts-ignore
      animateObj.timer = requestAnimationFrame(animateScroll);
    } else {
      animateObj.finish = true;
    }
  };
  animateScroll();
  return animateObj;
}
