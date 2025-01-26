const { ipcRenderer } = require('electron');

document.getElementById('minimizeBtn').addEventListener('click', () => {
    ipcRenderer.send('app-minimize');
});

document.getElementById('maximizeBtn').addEventListener('click', () => {
    ipcRenderer.send('app-maximize');
});

document.getElementById('closeBtn').addEventListener('click', () => {
    ipcRenderer.send('app-quit');
});

// Listen for notifications from main process
ipcRenderer.on('start-break', () => {
    // Handle break timer
    startBreakTimer();
});

ipcRenderer.on('show-about', () => {
    showAboutDialog();
});

function showAboutDialog() {
    const aboutDialog = document.createElement('div');
    aboutDialog.className = 'about-dialog';
    aboutDialog.innerHTML = `
        <h2>Task Timer Pro</h2>
        <p>Version 1.0.0</p>
        <p>A professional task management and time tracking application.</p>
        <button onclick="this.parentElement.remove()">Close</button>
    `;
    document.body.appendChild(aboutDialog);
}
