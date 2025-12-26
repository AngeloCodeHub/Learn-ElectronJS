import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, relative, dirname } from "path";
import { readdirSync, statSync } from "fs";
import { fileURLToPath } from "url";

// interface CopyOptions {
//   sourceDir: string;
//   targetDir: string;
//   force?: boolean;
// }

/**
 * 遞迴複製目錄結構和檔案
 * @param sourceDir 來源目錄
 * @param targetDir 目標目錄
 * @param force 是否強制覆蓋
 */
function copyDirectory(
  sourceDir: string,
  targetDir: string,
  force: boolean = true
): void {
  if (!existsSync(sourceDir)) {
    throw new Error(`來源目錄不存在: ${sourceDir}`);
  }

  // 建立目標目錄
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  const entries = readdirSync(sourceDir);

  for (const entry of entries) {
    const sourceFile = join(sourceDir, entry);
    const targetFile = join(targetDir, entry);
    const stat = statSync(sourceFile);

    if (stat.isDirectory()) {
      // 遞迴複製子目錄
      if (!existsSync(targetFile)) {
        mkdirSync(targetFile, { recursive: true });
      }
      copyDirectory(sourceFile, targetFile, force);
    } else {
      // 複製檔案
      if (existsSync(targetFile) && !force) {
        console.warn(`檔案已存在，跳過: ${targetFile}`);
        continue;
      }

      const content = readFileSync(sourceFile);
      writeFileSync(targetFile, content);
      console.log(`✓ 複製: ${relative(sourceDir, sourceFile)}`);
    }
  }
}

/**
 * 主函式：複製 Ref-Code 底下的程式碼到 repo root
 */
async function main() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const projectRoot = join(__dirname, "..");
    const sourceArg = process.argv[2];
    const sourceFolder = sourceArg?.trim();
    if (!sourceFolder) {
      throw new Error("請提供來源資料夾名稱，例如: src-HronrayTools");
    }

    const refCodeDir = join(projectRoot, "Ref-Code", sourceFolder);
    const targetDir = projectRoot;

    console.log(`📁 開始複製檔案...`);
    console.log(`來源: ${refCodeDir}`);
    console.log(`目標: ${targetDir}`);
    console.log("");

    copyDirectory(refCodeDir, targetDir, true);

    console.log("");
    console.log(`✅ 複製完成！`);
  } catch (error) {
    console.error(`❌ 錯誤: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
}

main();
