import { type Browser, type BrowserContext, chromium, type Page } from 'playwright';
import { spawn } from 'child_process';
import { readFileSync } from 'fs';
// import path from 'path';
import { decryptCredentials } from '@/security/credentials';

export type AutomationResult = {
  status: 'success' | 'skipped' | 'error';
  message: string;
};

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

const getChromePath = (): string => {
  try {
    const clientVhdxFile = 'd:\\ClientVHDXDriverLetter.json';
    const data = readFileSync(clientVhdxFile, 'utf-8');
    const { driveLetter } = JSON.parse(data) as { driveLetter: string };
    return `${driveLetter}:\\Chrome\\Chrome.exe`;
  } catch (error) {
    console.error('Failed to read ClientVHDXDriverLetter.json:', error);
    return '';
  }
};

export async function runNetflixAutoLogin(onLog?: (message: string) => void): Promise<AutomationResult> {
  const remoteDebuggingPort = 9222;
  const chromePath = getChromePath();
  const userDataDir = process.env.USER_DATA_DIR;
  const appUrl = process.env.APP_URL;

  const log = (message: string) => {
    console.log(message);
    if (onLog) {
      onLog(message);
    }
  };

  if (!chromePath || !userDataDir || !appUrl) {
    throw new Error('Missing Chrome path, USER_DATA_DIR, or APP_URL');
  }

  let browser: Browser | null = null;
  let context: BrowserContext | null = null;
  let chromeProcess: ReturnType<typeof spawn> | null = null;
  let page: Page | null = null;

  try {
    log('Launching Chrome with remote debugging...');
    chromeProcess = spawn(
      chromePath,
      [
        `--remote-debugging-port=${remoteDebuggingPort}`,
        `--user-data-dir=${userDataDir}`,
        `--app=${appUrl}`,
      ],
      { detached: true, stdio: 'ignore' }
    );
    chromeProcess.unref();

    const cdpEndpoint = `http://localhost:${remoteDebuggingPort}`;
    log('Waiting for CDP endpoint to become available...');

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

    const contexts = browser.contexts();
    context = contexts[0] ?? (await browser.newContext());

    log('Browser launched, attaching to page...');
    const pages = context.pages();
    page = pages[0];

    if (!page) {
      throw new Error('無法取得頁面');
    }

    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle').catch(() => { });

    log(`Page title: ${await page.title()}`);

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
      const message = 'Login page not detected, likely already signed in. Skipping login flow.';
      log(message);
      return { status: 'skipped', message };
    }

    const { accounts } = decryptCredentials();
    const randomIndex = Math.floor(Math.random() * accounts.length);
    const credential = accounts[randomIndex];

    if (!credential) {
      throw new Error('Unable to select credentials');
    }

    const { username, password } = credential;

    if (!username || !password) {
      throw new Error('Netflix帳號或密碼未設定');
    }

    log(`Using credentials set #${randomIndex + 1}...`);
    log('Found credentials, attempting to login...');

    try {
      log('Waiting for email input field...');
      const emailSelectors = [
        'input[data-automation="login-username-email-field"]',
        'input[type="email"]',
        'input[name="userLoginId"]',
        'input#id_userLoginId',
      ];

      let emailInput: string | null = null;
      for (const selector of emailSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 3000 });
          emailInput = selector;
          break;
        } catch {
          // continue
        }
      }

      if (!emailInput) {
        throw new Error('找不到郵箱輸入欄位');
      }

      log('Found email field, filling username...');
      await page.fill(emailInput, username);
      await minimizeChromeWindow(context, page);

      log('Waiting for password input field...');
      const passwordSelectors = [
        'input[data-automation="login-password-field"]',
        'input[type="password"]',
        'input[name="password"]',
        'input#id_password',
      ];

      let passwordInput: string | null = null;
      for (const selector of passwordSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 3000 });
          passwordInput = selector;
          break;
        } catch {
          // continue
        }
      }

      if (!passwordInput) {
        throw new Error('找不到密碼輸入欄位');
      }

      log('Found password field, filling password...');
      await page.fill(passwordInput, password);
      await maximizeChromeWindow(context, page);

      log('Looking for login button...');
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
            log(`Found login button with selector: ${selector}`);
            // await button.click();
            loginButtonFound = true;
            break;
          }
        } catch {
          // continue
        }
      }

      if (!loginButtonFound) {
        throw new Error('找不到登入按鈕');
      }

      log('Login button clicked, waiting for navigation...');
      await page.waitForLoadState('networkidle').catch(() => { });

    } catch (error) {
      console.error('Error filling form:', error);
      throw error;
    }

    if (browser) {
      log('Disconnecting Playwright while keeping Chrome open...');
      browser.isConnected();
    }

    const message = 'Netflix 啟動完成。';
    log(message);
    return { status: 'success', message };

  } catch (error) {
    console.error('Error occurred:', error);
    const message = error instanceof Error ? error.message : '發生未知錯誤';
    return { status: 'error', message };
  } finally {
    if (chromeProcess?.killed === false && chromeProcess.exitCode === null) {
      // Chrome 交由使用者關閉，不在此強制結束。
    }
  }
}

if (require.main === module) {
  runNetflixAutoLogin()
    .then(result => {
      console.log(result.message);
      process.exit(result.status === 'error' ? 1 : 0);
    })
    .catch(err => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}
