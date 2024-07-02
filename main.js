// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const fs = require('fs');

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// Fonction pour enregistrer une note
function saveNote(noteContent) {
  const filePath = path.join(__dirname, 'notes.txt');
  fs.appendFileSync(filePath, noteContent + '\n', 'utf-8');
}

// Gestionnaire d'événements pour enregistrer une note
ipcMain.handle('saveote', async (event, noteContent) => {
  try {
    saveNote(noteContent);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// Gestionnaire d'événements pour lire les notes
ipcMain.handle('readNotes', async () => {
  const filePath = path.join(__dirname, 'notes.txt');
  try {
    const notes = fs.readFileSync(filePath, 'utf-8');
    return { success: true, notes };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
