const DB = require('./DB.js');
const argv = require('yargs')
  .boolean('print')
  .default('print', true)
  .boolean('overwrite')
  .argv;

function runMigrationFromTerminal(migration) {
  const db = DB.read();
  const newDb = migration(db);
  if(argv.print) {
    console.log(newDb); //eslint-disable-line no-console
  }
  if(argv.overwrite) {
    DB.write(newDb);
  }
}

module.exports = runMigrationFromTerminal;
