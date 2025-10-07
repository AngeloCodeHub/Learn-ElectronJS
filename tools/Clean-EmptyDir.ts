#!/usr/bin/env node
/**
 * Clean-EmptyDir.ts
 *
 * 在以 `process.cwd()` 為根目錄下，遞迴清除 `./src` 內沒有檔案的資料夾。
 * 可用於建立到其他位置的符號連結（symlink）後從 repo root 執行。
 *
 * Usage:
 *   node tools/Clean-EmptyDir.ts [--dry-run] [--verbose]
 */

import fs from "fs/promises";
import path from "path";

type Opts = {
  dryRun: boolean;
  verbose: boolean;
};

const opts: Opts = {
  dryRun: process.argv.includes("--dry-run"),
  verbose: process.argv.includes("--verbose"),
};

const root = process.cwd();
const srcRoot = path.join(root, "src");

let removedCount = 0;
let errorCount = 0;

async function cleanDir(dir: string): Promise<boolean> {
  let entries: import("fs").Dirent[];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (opts.verbose) console.error("readdir failed:", dir, err);
    errorCount++;
    return true; // treat as containing files to avoid accidental deletion
  }

  let hasFile = false;

  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const childHasFile = await cleanDir(full);
      if (!childHasFile) {
        // child contains no files -> remove directory
        if (opts.dryRun) {
          if (opts.verbose) console.log("[dry-run] rmdir:", full);
        } else {
          try {
            await fs.rmdir(full);
            removedCount++;
            if (opts.verbose) console.log("rmdir:", full);
          } catch (err) {
            console.error("failed to remove dir:", full, err);
            errorCount++;
            hasFile = true; // treat as non-empty on error
          }
        }
      } else {
        hasFile = true;
      }
    } else {
      // treat files and symlinks (non-directory entries) as files
      hasFile = true;
    }
  }

  return hasFile;
}

async function main() {
  try {
    const stat = await fs.stat(srcRoot).catch((): null => null);
    if (!stat || !stat.isDirectory()) {
      console.error("src folder not found at:", srcRoot);
      process.exit(1);
    }

    if (opts.verbose) console.log("root:", root);

    // iterate immediate children of srcRoot and clean them
    const children = await fs.readdir(srcRoot, { withFileTypes: true });
    for (const entry of children) {
      if (!entry.isDirectory()) continue;
      const full = path.join(srcRoot, entry.name);
      const childHasFile = await cleanDir(full);
      if (!childHasFile) {
        if (opts.dryRun) {
          if (opts.verbose) console.log("[dry-run] rmdir:", full);
        } else {
          try {
            await fs.rmdir(full);
            removedCount++;
            if (opts.verbose) console.log("rmdir:", full);
          } catch (err) {
            console.error("failed to remove dir:", full, err);
            errorCount++;
          }
        }
      }
    }

    console.log(`Done. removed=${removedCount} errors=${errorCount} dryRun=${opts.dryRun}`);
    process.exit(errorCount > 0 ? 2 : 0);
  } catch (err) {
    console.error("unexpected error:", err);
    process.exit(1);
  }
}

main();

