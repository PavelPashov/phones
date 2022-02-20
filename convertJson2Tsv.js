const fs = require('fs');
const numbers = require('./addressBook');
const readTsv = require('./tsv');

const fileName = process.argv[2]

if (!fileName) {
  let string = Object.keys(numbers[0]).join('\t') + '\n';
  string = string + numbers.map(n => Object.keys(n).map((key) => n[key]).join('\t')).join('\n')
  fs.writeFileSync('numbers/numbers.tsv', string)
} else {
  const numbersArray = readTsv(fileName)
  fs.writeFileSync('numbers/numbers.json', JSON.stringify(numbersArray))
}

