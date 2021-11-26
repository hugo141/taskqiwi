import Datastore from "nedb"
import path from "path"

import electron from 'electron'

export default new Datastore({
  autoload: true,
  filename: path.join(electron.remote.app.getPath('userData'), "tododata.db")
})