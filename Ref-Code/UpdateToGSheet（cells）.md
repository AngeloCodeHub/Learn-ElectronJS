# 將 mac 資料update至google sheet

讀取 switch_data.json，使用GoogleSpreadsheet 套件 cell 方式填入我自訂  
的 Google sheet

sheet 第一行與第一列都為凍結行與列

json 檔案資料為 MAC.SwitchIP、MAC.SwitchPort、MAC.LanPort、MAC.Speed、MAC.IP

runtime是使用 bun 非 node.js

互動全程使用繁體中文
## 步驟

1. 核對 json MAC.SwitchIP、MAC.SwitchPort、MAC.LanPort
   與 sheet 的 ConnIP、ConnPort、PortAlias
   欄位字串值是否相等
2. 相等時則將json 頂層資料（MAC）填上 sheet MAC 欄位，與
   MAC.IP 填上 "對接IP" 欄位
3. MAC.Speed 如果是 "2500" 則在sheet Speed欄位填上 "2.5G"
   如果是 "1000" 則填上 "1G"