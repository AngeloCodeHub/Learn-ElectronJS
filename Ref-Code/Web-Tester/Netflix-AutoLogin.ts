import { type BrowserContext, chromium, type Page } from 'playwright';
import { spawn } from 'child_process';
import * as dotenv from 'dotenv';

dotenv.config();

// Minimize the Chrome window via CDP to reduce on-screen presence during automation
async function minimizeChromeWindow(context: BrowserContext, page: Page) {
  try {
    const session = await context.newCDPSession(page);
    const { windowId } = await session.send('Browser.getWindowForTarget');
    await session.send('Browser.setWindowBounds', {
      windowId,
      bounds: { windowState: 'minimized' },
    });
    console.log('Chrome window minimized.');
  } catch (error) {
    console.warn('Failed to minimize Chrome window:', error);
  }
}

// Restore and maximize the Chrome window via CDP when visibility is needed
async function maximizeChromeWindow(context: BrowserContext, page: Page) {
  try {
    const session = await context.newCDPSession(page);
    const { windowId } = await session.send('Browser.getWindowForTarget');

    // If currently minimized/fullscreen, restore to normal before maximizing
    const { bounds } = await session.send('Browser.getWindowBounds', { windowId });
    if (bounds.windowState === 'minimized' || bounds.windowState === 'fullscreen') {
      await session.send('Browser.setWindowBounds', {
        windowId,
        bounds: { windowState: 'normal' },
      });
    }

    await session.send('Browser.setWindowBounds', {
      windowId,
      bounds: { windowState: 'maximized' },
    });
    console.log('Chrome window maximized.');
  } catch (error) {
    console.warn('Failed to maximize Chrome window:', error);
  }
}

async function main() {
  // console.log('Starting Playwright...');

  const chromePath = process.env.CHROME_PATH;
  const userDataDir = process.env.USER_DATA_DIR;
  const remoteDebuggingPort = 9222;
  const appUrl = process.env.APP_URL;

  if (!chromePath || !userDataDir || !appUrl) {
    throw new Error('Missing required environment variables: CHROME_PATH, USER_DATA_DIR, or APP_URL');
  }

  let browser;
  let context;
  let chromeProcess;
  let page;
  try {
    console.log('Launching Chrome with remote debugging...');
    chromeProcess = spawn(
      chromePath,
      [
        `--remote-debugging-port=${remoteDebuggingPort}`,
        `--user-data-dir=${userDataDir}`,
        // '--start-maximized',
        `--app=${appUrl}`,
      ],
      { detached: true, stdio: 'ignore' }
    );
    chromeProcess.unref();

    const cdpEndpoint = `http://localhost:${remoteDebuggingPort}`;
    console.log('Waiting for CDP endpoint to become available...');

    // 嘗試連線到 CDP，多次重試以等待 Chrome 啟動完成
    for (let i = 0; i < 20; i += 1) {
      try {
        browser = await chromium.connectOverCDP(cdpEndpoint);
        break;
      } catch (err) {
        if (i === 19) throw err;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    if (!browser) {
      throw new Error('無法連線到 Chrome CDP');
    }

    // 取得現有的持久化 context（使用同一個 user-data-dir）
    const contexts = browser.contexts();
    context = contexts[0] ?? (await browser.newContext());

    console.log('Browser launched, creating new page...');
    const pages = context.pages();
    page = pages[0]; // 取得 --app 開啟的頁面

    if (!page) {
      throw new Error('無法取得頁面');
    }

    // 步驟1: 導航到Netflix登入頁面
    // console.log('Navigating to Netflix login page...');
    // await page.goto('https://www.netflix.com/tw/login', { waitUntil: 'networkidle' });

    // 先等頁面完成初次導覽，避免在導航中取得元素時拋出 execution context destroyed
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle').catch(() => { });

    console.log('Page title:', await page.title());

    // 已登入時頁面會直接跳過登入畫面，若偵測不到登入欄位則結束流程
    const loginFieldSelectors = [
      'input[data-automation="login-username-email-field"]',
      'input[type="email"]',
      'input[name="userLoginId"]',
      'input#id_userLoginId',
    ];

    let loginPageDetected = false;
    try {
      for (const selector of loginFieldSelectors) {
        const handle = await page.$(selector);
        if (handle) {
          loginPageDetected = true;
          break;
        }
      }
    } catch (error) {
      console.warn('Skipping login detection because page navigated:', error);
    }

    if (!loginPageDetected) {
      console.log('Login page not detected, likely already signed in. Skipping login flow.');
      return;
    }

    // 步驟2: 從.env讀取並隨機選擇一組帳號密碼
    const credentials = [
      {
        username: process.env.NETFLIX_USER_01 || '',
        password: process.env.NETFLIX_PASS_01 || '',
      },
      {
        username: process.env.NETFLIX_USER_02 || '',
        password: process.env.NETFLIX_PASS_02 || '',
      },
      {
        username: process.env.NETFLIX_USER_03 || '',
        password: process.env.NETFLIX_PASS_03 || '',
      },
    ];

    // 隨機選擇一組帳號密碼
    const randomIndex = Math.floor(Math.random() * credentials.length);
    const credential = credentials[randomIndex];
    
    if (!credential) {
      throw new Error('Unable to select credentials');
    }
    
    const { username, password } = credential;

    if (!username || !password) {
      throw new Error('Netflix帳號或密碼未在.env中設定');
    }

    console.log(`Using credentials set #${randomIndex + 1}...`);

    console.log('Found credentials, attempting to login...');

    // 等待並填入郵箱/帳號 - Netflix登入表單通常使用data-automation屬性
    console.log('Waiting for email input field...');
    try {
      // 嘗試多個可能的選擇器
      const emailSelectors = [
        'input[data-automation="login-username-email-field"]',
        'input[type="email"]',
        'input[name="userLoginId"]',
        'input#id_userLoginId',
      ];

      let emailInput = null;
      for (const selector of emailSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 3000 });
          emailInput = selector;
          break;
        } catch {
          // 繼續嘗試下一個選擇器
        }
      }

      if (!emailInput) {
        throw new Error('找不到郵箱輸入欄位');
      }

      console.log('Found email field, filling username...');
      await page.fill(emailInput, username);
      await minimizeChromeWindow(context, page);

      // 等待並填入密碼
      console.log('Waiting for password input field...');
      const passwordSelectors = [
        'input[data-automation="login-password-field"]',
        'input[type="password"]',
        'input[name="password"]',
        'input#id_password',
      ];

      let passwordInput = null;
      for (const selector of passwordSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 3000 });
          passwordInput = selector;
          break;
        } catch {
          // 繼續嘗試下一個選擇器
        }
      }

      if (!passwordInput) {
        throw new Error('找不到密碼輸入欄位');
      }

      console.log('Found password field, filling password...');
      await page.fill(passwordInput, password);
      await maximizeChromeWindow(context, page);

      console.log('Credentials filled successfully...');

      // 等待並點擊登入按鈕
      console.log('Looking for login button...');
      const loginButtonSelectors = [
        'button[data-automation="login-submit-button"]',
        'button[type="submit"]',
        'button:has-text("登入")',
        'button:has-text("Sign In")',
      ];

      let loginButtonFound = false;
      for (const selector of loginButtonSelectors) {
        try {
          const button = await page.$(selector);
          if (button) {
            console.log(`Found login button with selector: ${selector}`);
            // await button.click();
            loginButtonFound = true;
            break;
          }
        } catch {
          // 繼續嘗試下一個選擇器
          // console.warn(`Error trying selector ${selector}:`, error);
        }
      }

      if (!loginButtonFound) {
        throw new Error('找不到登入按鈕');
      }

      console.log('Login button clicked, waiting for navigation...');
      // await page.waitForNavigation({ timeout: 30000 }).catch(() => { });
      await page.waitForLoadState('networkidle').catch(() => { });

    } catch (error) {
      console.error('Error filling form:', error);
      throw error;
    }

    // 已完成操作後關閉與 Playwright 的連線，但保留 Chrome 視窗
    if (browser) {
      console.log('Disconnecting Playwright while keeping Chrome open...');
      await browser.close();
    }

  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    console.log('Done!');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
