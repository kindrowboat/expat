#!/usr/bin/env node
// migrations/2018-07-08_0316_22_addGiniScores.js
const parse = require('csv-parse/lib/sync');
const fs = require('fs');

const clone = require('clone');

function addGiniScores(oldDb) {
  const newDb = clone(oldDb);
  const csvText = fs.readFileSync(__dirname + '/../data/OECD_income_equality_scores.csv');
  const rows = parse(csvText, { columns: true });

  rows.forEach(row => {
    if(row['SUBJECT'] === 'GINI') {
      const country = newDb[row['LOCATION']];
      if(country === undefined) {
        throw `Country: ${row['LOCATION']} is not in database`;
      }
      if(country.gini === undefined) {
        country.gini = [];
      }
      country.gini.push({
        year: Number(row['TIME']),
        value: Number(row['Value']),
      });
    }
  });

  return newDb;
}

module.exports = addGiniScores;

if(require.main === module) {
  require('../util/runMigrationFromTerminal.js')(addGiniScores);
}
