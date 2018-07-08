#!/usr/bin/env node

const fs = require('fs');

function createMigration(name, {createFile = true}) {
  if(!hasCharacters(name)) throw 'name: must be a non-empty string';
  if(!startsWithLowercaseLetter(name)) throw 'name: must start with a lowercase letter';
  if(illegalCharacters(name) !== null) {
    throw `name: "${name}" contains illegal characters`;
  }

  const migrationFilePath = `migrations/${formattedTimestamp()}_${name}.js`;
  const absoluteMigrationFilePath = __dirname + '/../' + migrationFilePath;

  const migration = `
    #!/usr/bin/env node
    // ${migrationFilePath}

    const clone = require('clone');

    function ${name}(oldDb) {
      const newDb = clone(oldDb);
      // TODO: do stuff with newDb
      return newDb;
    }

    module.exports = ${name};

    if(require.main === module) {
      require('../util/runMigrationFromTerminal.js')(${name});
    }
  `.trim().replace(/^ {4}/mg, '');

  if(createFile) {
    fs.writeFileSync(absoluteMigrationFilePath, migration);
    fs.chmodSync(absoluteMigrationFilePath, '755');
  }

  return [absoluteMigrationFilePath, migration];
}

function hasCharacters(str) { return str && str.length > 0; }
function startsWithLowercaseLetter(str) { return /^[a-z]/.test(str); }
function illegalCharacters(str) { return str.match(/[^a-zA-Z0-9]/g); }
function formattedTimestamp() {
  return (new Date())
    .toISOString()
    .replace('T', '_')
    .replace(':', '')
    .replace(':', '_')
    .replace(/\.\d+Z$/, '');
}

module.exports = createMigration;

if(require.main === module) {
  const argv = require('yargs').argv;
  const name = argv._[0];
  const createFile = argv.createFile;
  const [absoluteMigrationFilePath, migration] = createMigration(name, {createFile});
  if(argv.printMigration) {
    console.log(migration); // eslint-disable-line no-console
  }
  if(argv.printFilePath) {
    console.log(absoluteMigrationFilePath); // eslint-disable-line no-console
  }
}
