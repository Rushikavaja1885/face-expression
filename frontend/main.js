const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const http = require("http");

let mainWindow;
let loadingWindow;
let backendProcess;

function createLoadingWindow() {
  loadingWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      mediaAccess: true,
    },
  });

  loadingWindow.loadURL(`data:text/html,
    <html>
      <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: Arial;">
        <h2>Loading backend, please wait...</h2>
      </body>
    </html>
  `);
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      mediaAccess: true,
    },
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, "build", "index.html"));
  } else {
    mainWindow.loadURL("http://localhost:3000");
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function startBackend() {
  let backendPath;

  if (app.isPackaged) {
    backendPath = path.join(process.resourcesPath, "backend", "backend.exe");
  } else {
    backendPath = path.join(__dirname, "src", "backend", "backend.exe");
  }

  backendProcess = spawn(backendPath, [], { stdio: "inherit" });

  backendProcess.on("error", (err) => {
    console.error("Failed to start backend:", err);
  });

  backendProcess.on("close", (code) => {
    console.log(`Backend process exited with code ${code}`);
  });
}

function checkBackendReady() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      http
        .get("http://127.0.0.1:8000/ready", (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            const response = JSON.parse(data);
            if (response.models_ready) {
              clearInterval(interval);
              resolve();
            }
          });
        })
        .on("error", () => {});
    }, 1000);
  });
}

app.on("before-quit", () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

app.whenReady().then(async () => {
  createLoadingWindow();

  loadingWindow.webContents.once("did-finish-load", () => {
    startBackend();
  });

  await checkBackendReady();
  createMainWindow();
  loadingWindow.close();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
