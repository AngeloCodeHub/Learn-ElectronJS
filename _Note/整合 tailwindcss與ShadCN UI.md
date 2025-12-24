# TailwindCSS｜ShadcnUI｜HeorUI

## tailwindcss
1. [依照官方步驟安裝 tailwindcss 套件](https://tailwindcss.com/docs/installation/using-postcss)
2. 整合 WebPack
   ```PowerShell
   npm install postcss-loader
   ```
3. webpack.renderer.config.ts 設定
   ```TypeScript
rules.push({
  test: /\.css$/,
  use:[
  { loader: 'style-loader' }, 
  { loader: 'css-loader' }, 
  { loader: 'postcss-loader' }
  ],
});
   ```
4. globals.css設定
   ```css
@import "tailwindcss";
body {
  background-color: #000;
  color: #fff;
}
   ```
5. renderer.ts
   ```TypeScript
   import './Styles/globals.css';
   ```
6. vscode設定
   - 安裝 tailwindcss 插件
   - setting.json
     ```Json
     "files.associations": {
    "*.css": "tailwindcss"
  },
     ```

## shadcn/ui
1. [依照步驟安裝官方套件](https://ui.shadcn.com/docs/installation/manual)
2. tsconfig.json 設定
3. components.json
4. Webpack與eslint加入 "@" alias

## [HeroUI（Global Installation）](https://www.heroui.com/docs/guide/installation#global-installation)
- 備註：framer-motion 要多加安裝 "@emotion/is-prop-valid" 套件
