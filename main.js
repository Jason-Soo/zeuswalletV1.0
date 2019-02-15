/*
const {app, BrowserWindow} = require('electron');
const path = require('path');

*/
let win;
let Window;


"use strict";
const url = require('url');
const electron = require("electron");
const path = require("path");
const reload = require("electron-reload");
const isDev = require("electron-is-dev");
const { app, BrowserWindow } = electron;
let mainWindow = null;

if (isDev) {
	const electronPath = path.join(__dirname, "node_modules", ".bin", "electron");
	reload(__dirname, { electron: electronPath });
}
/* Default background color if not fully loaded
mainWindow = new BrowserWindow({
  title: 'ElectronApp',
  backgroundColor: '#757575',
});

//Open only when it is ready to show
var mainWindow = new BrowserWindow({
  title: 'ElectronApp',
  show: false,
});

mainWindow.on('ready-to-show', function() {
  mainWindow.show();
  mainWindow.focus();
});
*/


require('electron-reload')(__dirname, {
    // Note that the path to electron may vary according to the main file
    electron: require(`${__dirname}/node_modules/electron`)
});

function createWindow()
{
  //creating a browser app
  //win = new BrowserWindow({show: false,width: 800, height:600,minWidth:800,minHeight:600,backgroundColor:"#757575", resizable:false,frame: false, icon:__dirname+'/Media/TaskbarLogo.png'});

   Window = new BrowserWindow({show: false,minWidth:800,minHeight:600,backgroundColor:"#757575", resizable:false,frame: false, icon:__dirname+'/Media/TaskbarLogo.png'});
   Window.loadURL(url.format({
     pathname: path.join(__dirname,'Index.html'),
     protocol: 'file:',
     slashes: true
   }));

   Window.on('ready-to-show', function() {
         Window.show();
         Window.focus();
     });

/*
   Window.once('ready-to-show', () => {
     Window.show()
   })

*/
    // Don't show until we are ready and loaded

/*
//to run the index
  win.loadURL(url.format({
    pathname: path.join(__dirname,'Index.html'),
    protocol: 'file:',
    slashes: true
  }));

  */


//for devtools
  Window.webContents.openDevTools();

  Window.on('close', () =>
  {
    win = null;
  });


}


//run
app.on('ready',createWindow);



//quit when all window are closed
app.on('window-all-closed',() => {

  //check if user is using mac because mac will continue process. OSX = darwin , windows = win32
    if(process.platform !== 'darwin')
    {
      app.quit();
    }

})
