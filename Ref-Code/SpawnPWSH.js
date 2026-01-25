// https://stackoverflow.com/questions/10179114/execute-powershell-script-from-node-js

const { log } = require("console");

// var spawn = require("child_process").spawn, child;
var spawn = require("child_process").spawn;

child = spawn("pwsh.exe", ["helloworld.ps1"]);

child.stdout.on("data", function (data) {
    console.log("Powershell Data: " + data);
});

child.stderr.on("data", function (data) {
    console.log("Powershell Errors: " + data);
});

child.on("exit", function () {
    console.log("Powershell Script finished");
});
child.stdin.end(); //end input


log(child.pid)
// log(child)
// log(typeof child)


