# 複製 Ref-Code 底下程式碼至 repo root

## 說明
- Ref-Code 底下資料夾，這裡以 src-HronrayTools 當範例
- 資料夾結構不變前提下，寫一支程式將 src-HronrayTools 底下擁有的檔案強制覆蓋到 repo root
- 使用 bun runtime
- 可以在 console 執行時可以使用 argv，比如說 bun tools/Copy-RefCode.ts src-HronrayTools.
- 不要有預設值，只要沒填 argv 或是空參數一律拋出錯誤
