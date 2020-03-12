
const { app,BrowserWindow,ipcMain } = require('electron')
const path=require('path')
const url=require('url')

let win;
let token;


function createWindows() {
    
    win = new BrowserWindow({
                height:700,
                width: 1200, 
                minHeight:700,
                minWidth: 1200,
    })

    // win.webContents.openDevTools()

    win.loadURL(url.format({
        pathname:path.join(__dirname,'index.html'),
        protocol:'file',
        slashes:true
    }))
}



ipcMain.on('entry-accepted', (event, arg) => {
    console.log(arg)
    event.reply('token',"arg")
    // if(data[0] == 'ping' && data[1]){

    //     users_token = data[1]
    //     // ipc.sendSync('token', data[1])
    //     event.reply('token', data[1])
    //     // child.hide()
    // }
})

// ipcMain.on('asynchronous-message', (event, arg) => {
//   console.log(arg)
//   let interval  = setInterval(()=>{
//     event.reply('asynchronous-reply', users_token)
//   },1000)
  
//    setTimeout(()=>{
//       clearInterval(interval)
//   },60000)
// })


app.on('ready',createWindows)

