import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    executableName: 'OTTLauncher',
    ignore: (path) => {
      if (!path) return false;
      // 除錯
      // console.log('Path:', path);
      // 必須保留的路徑
      const keepPatterns = [
        /^\/\.webpack/,                         // ✅ Webpack 編譯輸出
        /^\/node_modules$/,                     // ✅ node_modules 根目錄本身
        /^\/node_modules\/playwright/,          // ✅ playwright
        /^\/node_modules\/@playwright/,         // ✅ @playwright
      ];
      const shouldKeep = keepPatterns.some(pattern => pattern.test(path));
      // 如果是 node_modules 下的其他套件，忽略它
      if (path.startsWith('/node_modules/') && !shouldKeep) {
        return true;
      }
      return !shouldKeep;
    },
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
