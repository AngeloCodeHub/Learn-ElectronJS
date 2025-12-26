import type { AutomationResult } from '@/lib/Netflix-AutoLogin';

declare global {
  interface Window {
    electronAPI?: {
      startNetflixLogin: () => Promise<AutomationResult>;
    };
  }
}
export {};
