const database = require("wio.db")
const db = new database.JsonDatabase({ databasePath:"/src/backend/db/db.json" })

module.exports.db = db