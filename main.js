const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
// requiere child_process exec for command line execution
// const exec = require('child_process').exec;
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);

// define async function for running comand line
// this example run 'git config' in the terminal to get git user name and email
async function getGitUser(arg) {
  console.log("getGitUser", arg);
  // Exec output contains both stderr and stdout outputs
  const nameOutput = await exec("git config --global user.name");
  const emailOutput = await exec("git config --global user.email");
  // create response object
  response = {
    name: nameOutput.stdout.trim(),
    email: emailOutput.stdout.trim(),
  };
  // console.log(response);
  return response;
}

// event listener for when Electron application is ready
// note the values of nodeIntegration and contextIsolation which are currently the best practice
app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 600,
    webPreferences: {
      nodeIntegration: false, // default in Electron >= 5
      contextIsolation: true, // default in Electron >= 12
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // listener for asynchronous-message
  ipcMain.on("run-command", (event, arg) => {
    console.log("run-command: ", arg);

    // call getGitUser() async and wait for response in .then()
    res = getGitUser(arg).then((mainRes) => {
      // print response object in main.js
      console.log("getGitUser()\n", mainRes);
      // send response to renderer
      mainWindow.webContents.send("run-command", mainRes);
    });
  });

  // load html template file
  mainWindow.loadFile("index.html");
});
