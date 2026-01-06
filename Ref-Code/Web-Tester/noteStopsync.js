const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const gitignorePath = path.join(__dirname, "..", ".gitignore");

fs.readFile(gitignorePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const lines = data.split("\n");

  // line 4: comment
  if (lines.length > 3 && !lines[3].startsWith("#")) {
    lines[3] = "#" + lines[3];
  }

  // line 5: uncomment
  if (lines.length > 4 && lines[4].startsWith("#")) {
    lines[4] = lines[4].slice(1);
    // lines[4] = "#" + lines[4];
  }

  const updatedData = lines.join("\n");

  fs.writeFile(gitignorePath, updatedData, "utf8", (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log(".gitignore updated successfully.");

    const commands = [
      "git rm --cached .obsidian/ -r",
      "git add .gitignore",
      "git commit -m '筆記暫停同步'",
    ];

    function executeCommand(index) {
      if (index >= commands.length) {
        console.log("All git commands executed successfully.");
        return;
      }
      exec(commands[index], (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${commands[index]}`);
          console.error(stderr);
          // Stop execution if a command fails
          return;
        }
        console.log(`Successfully executed: ${commands[index]}`);
        console.log(stdout);
        executeCommand(index + 1);
      });
    }

    executeCommand(0);
  });
});
