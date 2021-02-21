const electron = require("electron");

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const session = electron.session;
const protocol = electron.protocol;

const packageJson = require('./package.json');

const fs = require('fs')
const path = require("path");
const isDev = require("electron-is-dev");

const isMac = process.platform === 'darwin'

const template = [
  ...(isMac ? [{
    label: app.name,
    submenu: [
      {role: 'about'},
      {type: 'separator'},
      {role: 'services'},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'}
    ]
  }] : []),
  {
    label: 'File',
    submenu: [
      isMac ? {role: 'close'} : {role: 'quit'}
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      ...(isMac ? [
        {role: 'pasteAndMatchStyle'},
        {role: 'delete'},
        {role: 'selectAll'},
        {type: 'separator'},
        {
          label: 'Speech',
          submenu: [
            {role: 'startSpeaking'},
            {role: 'stopSpeaking'}
          ]
        }
      ] : [
        {role: 'delete'},
        {type: 'separator'},
        {role: 'selectAll'}
      ])
    ]
  },
  {
    label: 'View',
    submenu: [
      {role: 'reload'},
      {role: 'forceReload'},
      {role: 'toggleDevTools'},
      {type: 'separator'},
      {role: 'resetZoom'},
      {role: 'zoomIn'},
      {role: 'zoomOut'},
      {type: 'separator'},
      {role: 'togglefullscreen'}
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Source Code',
        click: async () => {
          const {shell} = require('electron');
          await shell.openExternal('https://github.com/lfuelling/pds-viewer');
        }
      }
    ]
  }
]

let mainWindow;

protocol.registerSchemesAsPrivileged([{
  scheme: 'pds-viewer',
  privileges: {standard: true, secure: true, corsEnabled: true}
}]);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:1234"
      : `pds-viewer://serve/`
  ).then(() => {
    isDev && mainWindow.openDevTools();
  });
  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", () => {
  app.setName("PDS Viewer");

  protocol.registerFileProtocol('pds-viewer', (request, callback) => {
    const url = request.url.substr(18);
    console.log('Url:', url);
    const filePath = path.join(__dirname, "./dist/", url);
    if (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory()) {
      console.log('Returning file...');
      callback({path: filePath});
    } else {
      console.log('Returning index...');
      callback({path: path.join(__dirname, "./dist/index.html")});
    }
  });

  app.setAboutPanelOptions({
    applicationName: "PDS Viewer",
    applicationVersion: packageJson.version,
    authors: packageJson.author
  });
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (compatible; PDS Viewer/' + packageJson.version + ')';
    callback({cancel: false, requestHeaders: details.requestHeaders});
  });

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
