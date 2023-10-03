const { contextBridge, ipcRenderer } = require("electron");

// Define customized API functions which can be called from renderer.js
contextBridge.exposeInMainWorld("BBB_API", {
  sendToMain: (msg = "") =>
    /*
      Sends asynchronous message to main process in channel: 'run-command'.
      'msg' var is optional in this case, and should be used only to pass parameters
      because, for security reasons, and respecting 'nodeIntegration: false' and 'contextIsolation: true'
      we should NOT pass any command from the renderer process, 
      but rather use the channel id "run-command" to trigger a secure command defined in main    
    */
    ipcRenderer.send("run-command", msg),
});

// other examples

// listener for an asynchronous message from main
ipcRenderer.on("run-command", (_, ...args) => {
  console.log(...args);
  // for testing, writting result to DOM element.
  document.getElementById("resCode").innerHTML = JSON.stringify(args);
});
