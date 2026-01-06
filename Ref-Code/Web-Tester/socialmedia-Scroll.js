// Facebook
/* 
let el = document.body;
let delay = 500;
let autoScroll = setInterval(() => {
  if (scrollY < el.scrollHeight) {
    scrollTo(0, el.scrollHeight)
  } else {
    clearInterval(autoScroll);
  }
}, delay);
 */

// raindrop.io
/* 
const el = document.querySelector("#react > div > div > main > div > div > div.scroll-IT9j");
// console.log(el, el.scrollHeight, el.clientHeight, el.scrollTop);
const pixelHeight = 500; // 每次捲動的像素高度
const delay = 600; // 延遲時間，單位毫秒
let autoScroll = setInterval(() => {
  if (el.scrollTop + el.clientHeight < el.scrollHeight) {
    el.scrollBy({
      top: pixelHeight,
      behavior: "smooth"
    });
  } else {
    // 到底時如仍要重頭開始，取消下面註解
    // el.scrollTop = 0;
    // 若到最底就停止
    clearInterval(autoScroll);
  }
}, delay);
 */