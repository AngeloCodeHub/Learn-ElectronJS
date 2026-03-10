import puppeteer from 'puppeteer-core';

// --- 設定 ---
// 請將此處的路徑和電子郵件換成您自己的設定
const CHROME_EXEC_PATH = 'C://Chrome//chrome.exe';
const USER_DATA_DIR = "C://UserData";
const DISNEY_LOGIN_URL = "https://www.disneyplus.com/zh-hant/identity/login/enter-email";
const YOUR_EMAIL = "your-email@example.com"; // <--- 請在這裡輸入您的電子郵件
const YOUR_PASS = "12345"; // <--- 請在這裡輸入您的電子郵件

(async () => {
  console.log("正在啟動瀏覽器並將其隱藏在螢幕外...");
  const browser = await puppeteer.launch({
    headless: false, // 必須在有頭模式下才能操作視窗
    executablePath: CHROME_EXEC_PATH,
    userDataDir: USER_DATA_DIR,
    args: [
      `--app=${DISNEY_LOGIN_URL}`,
      '--window-position=30000,30000', // 將視窗啟動於螢幕外的位置，達到隱藏效果
    ],
    ignoreDefaultArgs: ['--enable-automation'],
    defaultViewport: null
  });

  // 等待頁面加載
  const pages = await browser.pages();
  const page = pages.length > 0 ? pages[0] : await browser.newPage();

  if (!page) {
    console.error("無法獲取頁面，程序終止。");
    await browser.close();
    return;
  }

  try {
    console.log("等待頁面加載完成 (在隱藏視窗中)...");
    await page.waitForSelector('h1', { timeout: 10000 });
    const title = await page.title();
    console.log(`成功載入頁面: ${title}`);

    console.log("正在尋找電子郵件輸入框 (在隱藏視窗中)...");
    const emailInputSelector = 'input[name="email"]';
    await page.waitForSelector(emailInputSelector, { timeout: 5000 });
    
    console.log(`正在輸入電子郵件 (在隱藏視窗中)...`);
    await page.type(emailInputSelector, YOUR_EMAIL);
    console.log("電子郵件已成功輸入。");

    console.log("正在點擊繼續按鈕 (在隱藏視窗中)...");
    const submitButtonSelector = 'button[type="submit"]';
    await page.waitForSelector(submitButtonSelector, { timeout: 5000 });
    await page.click(submitButtonSelector);
    console.log("已點擊繼續按鈕。");

    console.log("等待密碼輸入頁面加載 (在隱藏視窗中)...");
    const passwordInputSelector = 'input[name="password"]';
    await page.waitForSelector(passwordInputSelector, { timeout: 10000 }); // 等待密碼框出現

    console.log("正在輸入密碼 (在隱藏視窗中)...");
    await page.type(passwordInputSelector, "12345");
    console.log("密碼已輸入。");

    console.log("正在點擊登入按鈕 (在隱藏視窗中)...");
    await page.click('button[type="submit"]');
    console.log("已點擊登入按鈕。");

    // --- 將視窗顯示出來 ---
    console.log("正在將瀏覽器視窗顯示並最大化...");
    const session = await page.createCDPSession();
    const { windowId } = await session.send('Browser.getWindowForTarget');
    await session.send('Browser.setWindowBounds', {
      windowId,
      bounds: { windowState: 'maximized' }, // 將視窗移回螢幕內並最大化
    });
    console.log('視窗已顯示並最大化。腳本執行完畢。');

  } catch (error) {
    console.error("腳本執行出錯:", error);
    console.log("發生錯誤，將在5秒後關閉瀏覽器...");
    await new Promise(resolve => setTimeout(resolve, 5000));
    await browser.close();
  }
})();