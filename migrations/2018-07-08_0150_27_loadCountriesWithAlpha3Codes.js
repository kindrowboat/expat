#!/usr/bin/env node
// migrations/2018-07-08_0150_27_loadCountriesWithAlpha3Codes.js

function loadCountriesWithAlpha3Codes(_oldDb) { //eslint-disable-line no-unused-vars
  const newDb = {};
  const countries = require('../data/alpha-3.json');
  countries.forEach(country => {
    newDb[country['alpha-3']] = {
      name: country.name,
      names: [country.name],
      alpha3: country['alpha-3'],
      code: country['country-code'],
    };
  });
  return newDb;
}

module.exports = loadCountriesWithAlpha3Codes;

if(require.main === module) {
  require('../util/runMigrationFromTerminal.js')(loadCountriesWithAlpha3Codes);
}
