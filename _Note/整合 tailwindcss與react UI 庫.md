### Webpack tailwindcss

1. [安裝 tailwindcss、postcss](https://tailwindcss.com/docs/installation/using-postcss)
2. 安裝 postcss-loader
   ```Powershell
   npm install postcss-loader
   ```
3. 設定 webpack.renderer.config.ts 加入 "postcss-loader"
   ```Javascript
   rules.push({
  test: /\.css$/,
  use: [
    { loader: 'postcss-loader' }
  ],
});
   ```
4. 此時可在 app.tsx 使用純 html 標籤 classname
5. 使用 HeroUI 接續下個步驟

### [HeroUI（Global Installation）](https://www.heroui.com/docs/guide/installation#global-installation)
[備註：framer-motion 要多加安裝 "@emotion/is-prop-valid" 套件](https://www.perplexity.ai/search/electron-js-zhuo-mian-kai-fa-t-Jn1CJdOPSE6eX6OaBG0kZg#1)

### shadcn/ui
