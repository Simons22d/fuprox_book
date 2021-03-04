
const { app,BrowserWindow,ipcMain } = require('electron')
const path=require('path')
const url=require('url')

let win;
let token;


// disabling caching
app.commandLine.appendSwitch ("disable-http-cache");

function createWindows() {
    win = new BrowserWindow({
                height:700,
                width: 1400, 
                minHeight:700,
                minWidth: 1400,
                autoHideMenuBar  : true,
                fullscreen : true,
                frame: false,
    })
    // options  to add later
    // frame: false,
    // fullscreen: true

    // win.webContents.openDevTools()

    win.loadURL(url.format({
        pathname:path.join(__dirname,'index.html'),
        protocol:'file',
        slashes:true
    }))

    win.setMenu(null)
}
ipcMain.on('entry-accepted', (event, arg) => {
    event.reply('token',"arg")
})

app.on('ready',createWindows)

