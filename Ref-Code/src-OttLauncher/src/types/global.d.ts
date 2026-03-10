import type { AutomationResult } from '@/lib/Netflix-AutoLogin';
import type { LaunchResult } from '@/lib/Disney-Launch';

declare global {
  interface Window {
    electronAPI?: {
      startNetflixLogin: () => Promise<AutomationResult>;
      launchDisney: () => Promise<LaunchResult>;
    };
  }
}
export {};
