const { app, BrowserWindow } = require('electron/main');
const { spawn } = require('node:child_process');
const path = require('node:path')
const electronReload=require('electron-reload')('dist');
const aria2c=require('child_process')
const currentDir = process.cwd();


function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle:'hidden',
    titleBarOverlay: {
      color: '#2e343c9a',
      height: 50,
      symbolColor: 'white'
    }

  })
  win.excludedFromShownWindowsMenu=true
  win.menuBarVisible=false
  win.loadFile('./dist/window.html')
  win.webContents.openDevTools()
}

function runAria2()
{
  const aria2Path = path.resolve(currentDir,'aria2', 'aria2c.exe');
  // 启动aria2进程
  const aria2Process = spawn(aria2Path , ['--conf-path='+path.resolve(currentDir,'aria2','aria2.conf')]);
// 处理标准输出
aria2Process.stdout.on('data', (data) => {
  console.log(`aria2 stdout: ${data}`);
});

// 处理标准错误
aria2Process.stderr.on('data', (data) => {
  console.error(`aria2 stderr: ${data}`);
});

// 处理进程退出
aria2Process.on('close', (code) => {
  console.log(`aria2 process exited with code ${code}`);
});

  console.log("Hello WOrld!")
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

runAria2()