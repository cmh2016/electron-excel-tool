import { app, BrowserWindow, Menu, screen,dialog  } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  Menu.setApplicationMenu(null)
  const size = screen.getPrimaryDisplay().size
  console.log(size.width,size.height)
  let  winheight='',winwidth='';
  if(size.height<1080){
   winheight =  size.height;
   winwidth =  size.width
   }else{
    winheight =  size.height-100;
    winwidth =  size.width-200
   }
  mainWindow = new BrowserWindow({
    height: winheight,
    useContentSize: false,
    width: winwidth,
    show:false
  })
  mainWindow.loadURL(winURL)
  mainWindow.on('ready-to-show', function() {
      mainWindow.show();
      mainWindow.focus();
  });
  

  mainWindow.on('closed', () => {
    mainWindow = null
  })

}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})




