const fs = require('fs');
const dbPath = '../db.json';

const DB = {
  read: () => require(dbPath),
  write: (newDb) => {
    const serializedNewDb = JSON.stringify(newDb, null, 2) + '\n';
    fs.writeFileSync(`${__dirname}/${dbPath}`, serializedNewDb);
  }
};

module.exports = DB;
