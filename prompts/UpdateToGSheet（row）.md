# 將 mac 資料update至google sheet

讀取 switch_data.json，使用GoogleSpreadsheet套件 row base 方式填入我自訂 
的 Google sheet

Google Sheet 會用的欄位 schema
Switch、對接IP、MAC、PortAlias、speed

其中 Switch 欄位已經預填 有 Switch-1、Switch-2、Switch-3
PortAlias  欄位已經預填 分別用於核對 json 檔的MAC.LanPort 

環境與 google sheet 都已經設定好，在 function GSheetHandle撰寫邏輯

## 步驟

1. 讀取 switch_data.json
2. 判斷 json檔中 MAC.SwitchIP，如果是"192.168.1.244"則對應到google sheet Switch欄位的Switch-1
   "192.168.1.245" = Switch-2
   "192.168.1.246" = Switch-3
3. json檔中 MAC.LanPort 與 google sheet PortAlias欄位 string 相等
4. 填入 row ，對接IP=MAC.IP、json檔中頂層資料 MAC 填入 google sheet MAC
5. json MAC.Speed 填入 speed 欄位
   資料轉換，如為2500則填入 2.5G，1000則填入 1G
