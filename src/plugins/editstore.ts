import Datastore from "nedb"
import path from "path"
// import electron from 'electron'
let etn : any = null

function getdbPath(){
  if(etn === null){
    etn = require("electron")
  }
  return etn.remote.app.getPath('userData')
}

export default new Datastore({
  autoload: true,
  // filename: path.join(electron .remote.app.getPath('userData'), "tododata.db") 
  filename: path.join(getdbPath(), "editordata.db")
})