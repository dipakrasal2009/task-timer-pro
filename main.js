const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron');
const path = require('path');

let mainWindow;
let tray;

function createWindow() {
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: path.join(__dirname, 'src/assets/icon.png'),
        frame: false, // Custom window frame
        backgroundColor: '#f0f2f5'
    });

    // Load the index.html file
    mainWindow.loadFile('src/index.html');

    // Create custom title bar
    createCustomTitleBar();

    // Create system tray
    createTray();
}

function createTray() {
    tray = new Tray(path.join(__dirname, 'src/assets/icon.png'));
    const contextMenu = Menu.buildFromTemplate([
        { 
            label: 'Show App', 
            click: () => mainWindow.show() 
        },
        { 
            label: 'Start Break', 
            click: () => mainWindow.webContents.send('start-break') 
        },
        { type: 'separator' },
        { 
            label: 'Quit', 
            click: () => app.quit() 
        }
    ]);
    tray.setToolTip('Task Timer Pro');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    });
}

function createCustomTitleBar() {
    const titleBar = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                { role: 'minimize' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    click: () => {
                        // Show about dialog
                        mainWindow.webContents.send('show-about');
                    }
                }
            ]
        }
    ]);
    Menu.setApplicationMenu(titleBar);
}

// Handle app ready
app.whenReady().then(createWindow);

// Handle app quit
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// IPC Communication
ipcMain.on('app-minimize', () => {
    mainWindow.minimize();
});

ipcMain.on('app-maximize', () => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
});

ipcMain.on('app-quit', () => {
    app.quit();
});

// Handle notifications
ipcMain.on('show-notification', (event, data) => {
    const notification = {
        title: data.title,
        body: data.message,
        icon: path.join(__dirname, 'src/assets/icon.png')
    };
    new Notification(notification).show();
}); 