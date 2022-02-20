const fs = require('fs');
const readTsv = (fileName) => {
  const data = fs.readFileSync(fileName, { encoding: 'utf8', flag: 'r' });
  const keys = data.split('\n')[0].split('\t')
  return data.split('\n').filter((d, i) => i !== 0)
    .map((d) => d.split('\t').reduce((dict, cur, i) => ({ ...dict, [keys[i]]: cur }), {}))
}

module.exports = { readTsv };