# 診斷結果

實際跑了一次 npm run dev（含 debug log）驗證：這次從啟動到 Electron 視窗開起來,只花了約 45 秒（type-check 幾秒 + webpack 編譯主/渲染/preload 三份 bundle）。專案本身 src/ 只有 13 個檔案，程式碼量非常小，不可能是 9 分鐘的主因。這說明 9m4s 是「環境因素」造成的異常,不是專案結構問題。排查後找到幾個關鍵點：

1. Windows Defender 即時防護開啟中(最可能的主因)

確認 RealTimeProtectionEnabled = True,而 node_modules 有 720MB / 37,306 個檔案。webpack + ts-loader + fork-ts-checker 啟動時會密集讀取大量 node_modules 內的檔案,若剛好遇到：
- 冷啟動(重開機、剛 npm install、Defender 剛更新病毒碼)
- 或背景正在掃描這個資料夾

每個檔案讀取都會被即時掃描攔截一次,這是 Windows 上 Node/webpack 專案「有時候很快、有時候幾分鐘」最常見的原因,也符合你「等待時間過久」但這次我測試很快的落差。

解法：把整個專案資料夾(至少 node_modules)加入 Defender 排除清單。這需要系統管理員權限,我這邊查不到現有排除清單(Get-MpPreference 回報 "Must be an administrator")。建議你自己執行：
Add-MpPreference -ExclusionPath "D:\WorkSpace\Learn-ElectronJS"
(用系統管理員權限開 PowerShell 執行)

2. webpack 沒有設定持久化快取(filesystem cache)

webpack.main.config.ts / webpack.renderer.config.ts 都沒有設定 cache,代表每次 npm run dev 都是從零重新編譯,無法重用上次的結果。這會讓上面 Defender 掃描的成本每次都要重付一次,而不是只有第一次。

3. webpack.rules.ts 的 asset-relocator-loader 被渲染端也套用

rendererConfig 直接 import 了跟 main 共用的 rules(見 webpack.renderer.config.ts:3),其中 @vercel/webpack-asset-relocator-loader 這條規則本來是給 main process 處理原生模組(.node binary)用的,但因為共用陣列,渲染端打包時也會對所有進到 bundle 的 node_modules JS 檔案跑一次 AST 轉換 —— 這是多餘的開銷(渲染端只有 react/radix/lucide 等,沒有原生模組)。

---

要我現在直接幫你套用第 2、3 點的設定修正嗎(加上 filesystem cache、渲染端移除不必要的 relocator loader)？第 1 點的 Defender 排除因為需要系統管理員權限,需要你自己操作。


> 我長期觀察以來，npm run dev 第一次確實會很久(約10分鐘)，但是第二次run的時候啟動時間就正常
  但是電腦重開後第一次run的時間又很久.這樣是不是比較符合第1點的診對結果?

● 是的，這個 pattern 完全符合第 1 點的診斷，而且比我原本的說法更精確：

  機制說明：Windows Defender
  的即時防護會把「已掃描過、判定乾淨」的檔案結果快取在記憶體中(每次開機後才建立這份快取)，同一次開機期間，同一個檔案只要沒被修改過，第二次以後存取就不會再重新掃描,所以速度正常。但這份快取不會跨開機保留 ——
  重開機後記憶體清空，node_modules 裡那 37,306 個檔案在這次開機的第一次存取(也就是第一次 npm run dev)又要全部重新掃描一次，之後在同一次開機內的第二次、第三次 run 就都很快。

  這正好對應你觀察到的：
  - 重開機後第一次 run → 全部 37k+ 檔案重新掃描 → ~10 分鐘
  - 同一次開機內第二次 run → 已在 Defender 快取中 → 正常速度
  - 再次重開機 → 快取又清空 → 又變慢一次

  這也代表第 2 點(webpack persistent cache)其實能額外緩解這個「重開機後第一次」的情境：webpack 的 filesystem cache 會記住上次編譯結果，之後開機第一次 run 時，webpack 只需要對沒變更的模組做 mtime
  比對，而不必真的重新讀取/解析全部 node_modules 檔案內容 —— 間接減少需要被 Defender 掃描的檔案數量與 I/O 量。但根本解法還是第 1 點：把專案資料夾加入 Defender 排除清單，這樣不管開機幾次，第一次 run
  都不會觸發全量掃描。

  要我現在幫你套用 webpack 的 filesystem cache 設定，並移除渲染端多餘的 asset-relocator-loader 規則嗎？Defender 排除的部分則需要你自己用系統管理員權限執行我前面給的指令。
