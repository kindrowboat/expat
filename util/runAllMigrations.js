#!/usr/bin/env node

const glob = require('glob');
const path = require('path');
const DB = require('./DB');

function runAllMigrations({overwrite = true}) {
  const migrations = glob.sync(__dirname + '/../migrations/*.js').map(file => require(path.resolve(file)));
  const db = migrations.reduce((interimDb, migration) => migration(interimDb), {});
  if(overwrite) {
    DB.write(db);
  }
}

module.exports = runAllMigrations;

if(require.main === module) {
  runAllMigrations({overwrite: true});
}
