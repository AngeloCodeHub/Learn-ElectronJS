import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import fs from 'fs';

const SCOPES: string[] = ['https://www.googleapis.com/auth/spreadsheets'];
const doc_ID = process.env.GsheetDOC_ID;
if (!doc_ID) {
  console.error('錯誤: 找不到 GsheetDOC_ID 環境變數');
  process.exit(1);
}

const jwt = new JWT({ email: process.env.GCP_ServiceAccount, key: process.env.GCP_private_key, scopes: SCOPES });
const doc = new GoogleSpreadsheet(doc_ID, jwt);
const sheetIndex: number = 0;

interface SwitchData {
  SwitchIP: string;
  SwitchPort: string;
  LanPort: string;
  Speed: string;
  IP: string;
}

interface MacData {
  [mac: string]: SwitchData;
}

async function GSheetHandle() {
  try {
    // 讀取 switch_data.json
    const switchDataRaw = fs.readFileSync('switch_data.json', 'utf-8');
    const switchData: MacData = JSON.parse(switchDataRaw);

    // 載入 Google Sheet
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[sheetIndex];
    if (!sheet) {
      console.error('資料表不存在...');
      return;
    }

    // 載入更大範圍的儲存格以確保涵蓋所有資料
    await sheet.loadCells('A1:M500');
    console.log('載入儲存格統計:', sheet.cellStats);

    // 找到標題行的欄位索引
    const headerRow = 0; // 假設標題在第一行
    let connIPCol = -1, connPortCol = -1, portAliasCol = -1, macCol = -1, targetIPCol = -1, speedCol = -1;

    // 掃描標題行找到對應欄位
    for (let col = 0; col < 13; col++) {
      const cell = sheet.getCell(headerRow, col);
      const value = cell.value?.toString().toLowerCase();

      if (value?.includes('connip') || value?.includes('連線ip') || value?.includes('conn ip')) {
        connIPCol = col;
      } else if (value?.includes('connport') || value?.includes('連線port') || value?.includes('conn port')) {
        connPortCol = col;
      } else if (value?.includes('portalias') || value?.includes('port別名') || value?.includes('port alias')) {
        portAliasCol = col;
      } else if (value?.includes('mac')) {
        macCol = col;
      } else if (value?.includes('對接ip') || value?.includes('target ip') || value?.includes('targetip')) {
        targetIPCol = col;
      } else if (value?.includes('speed') || value?.includes('速度')) {
        speedCol = col;
      }
    }

    console.log('找到的欄位索引:');
    console.log(`ConnIP: ${connIPCol}, ConnPort: ${connPortCol}, PortAlias: ${portAliasCol}`);
    console.log(`MAC: ${macCol}, 對接IP: ${targetIPCol}, Speed: ${speedCol}`);

    if (connIPCol === -1 || connPortCol === -1 || portAliasCol === -1 || macCol === -1) {
      console.error('無法找到必要的欄位，請檢查 Google Sheet 的標題行');
      return;
    }

    let updateCount = 0;

    // 掃描資料行進行比對和更新
    for (let row = 1; row < 500; row++) {
      const connIPCell = sheet.getCell(row, connIPCol);
      const connPortCell = sheet.getCell(row, connPortCol);
      const portAliasCell = sheet.getCell(row, portAliasCol);

      if (!connIPCell.value || !connPortCell.value || !portAliasCell.value) {
        continue; // 跳過空行
      }

      const sheetConnIP = connIPCell.value.toString();
      const sheetConnPort = connPortCell.value.toString();
      const sheetPortAlias = portAliasCell.value.toString();

      // 在 JSON 資料中尋找匹配的項目
      for (const [mac, data] of Object.entries(switchData)) {
        if (mac === '-') continue; // 跳過特殊項目

        if (data.SwitchIP === sheetConnIP &&
          data.SwitchPort === sheetConnPort &&
          data.LanPort === sheetPortAlias) {

          // 找到匹配項目，更新 MAC 和對接IP
          const macCell = sheet.getCell(row, macCol);
          macCell.value = mac;

          if (targetIPCol !== -1 && data.IP) {
            const targetIPCell = sheet.getCell(row, targetIPCol);
            targetIPCell.value = data.IP;
          }

          // 更新速度欄位
          if (speedCol !== -1 && data.Speed) {
            const speedCell = sheet.getCell(row, speedCol);
            if (data.Speed === '2500') {
              speedCell.value = '2.5G';
            } else if (data.Speed === '1000') {
              speedCell.value = '1G';
            }
          }

          updateCount++;
          console.log(`更新第 ${row + 1} 行: MAC=${mac}, IP=${data.IP}, Speed=${data.Speed}`);
          break;
        }
      }
    }

    // 儲存變更
    await sheet.saveUpdatedCells();
    console.log(`\n完成! 總共更新了 ${updateCount} 筆資料`);

  } catch (error) {
    console.error('處理過程中發生錯誤:', error);
  }
}

GSheetHandle();
