const fs = require('fs');
const path = require('path');
const pdf = require("pdf-creator-node");
const tsv = require('./tsv');

const allNumbersHtml = fs.readFileSync('./templates/allNumbers.html', 'utf8')
const summedHtml = fs.readFileSync('./templates/summed.html', 'utf8')
const dirName = './invoices';
const numbersFile = './numbers/numbers.tsv';
const invoices = fs.readdirSync(dirName);

const openJson = (dirName, fileName) => {
  const pathToFile = path.resolve(dirName, fileName);
  const openedFile = fs.readFileSync(pathToFile);
  return JSON.parse(openedFile);
}

const createTotalSumArray = (array, attributeName) => {
  const object = array.reduce((dict, cur) => {
    if (!dict[cur[attributeName]]) {
      return {
        ...dict,
        [cur[attributeName]]: cur.price,
      }
    }
    return {
      ...dict,
      [cur[attributeName]]: dict[cur[attributeName]] + cur.price,
    }
  }, {});
  return Object.keys(object).map(k => ({ name: k, sum: Number((object[k]).toFixed(2)) }));
}

const createPdf = (object) => {
  const document = {
    html: object.html,
    data: {
      ...object
    },
    path: `./results/${object.name}.pdf`
  };
  const options = {
    format: "A4", orientation: "portrait", border: "10mm", footer: {
      height: "10mm",
      contents: {
        default: `<span style="color: #444;">${object.name} {{page}}</span>/<span>{{pages}}</span>`
      }
    }
  }

  pdf.create(document, options)
    .then(res => {
      console.log(res)
    })
    .catch(error => {
      console.error(error)
    });
}

const translateGroup = (group) => {
  switch (group) {
    case 'one':
      return 'павилион'
    case 'two':
      return 'гъбене'
    case 'three':
      return 'музга'
    case 'four':
      return 'камещица'
    default:
      return group;
  }
}

const translateEntry = (entry) => {
  return {
    ...entry,
    group: translateGroup(entry.group),
  }
}

const invoicesArrays = invoices.map((file) => {
  const invoice = openJson(dirName, file)
  if (!invoice.summaryCharges.summaryCharge || invoice.summaryCharges.summaryCharge.length === 0) {
    throw new Error("They've changed some shit!!!!!!")
  }
  return invoice.summaryCharges.summaryCharge.map((charge) => {
    const number = tsv.readTsv(numbersFile).find(n => n.number === charge.msisdn);
    if (number) {
      const totalCharges = charge.otherCharges ? charge.generalCharges + charge.otherCharges : charge.generalCharges;
      return { ...number, price: Number((totalCharges * 1.2).toFixed(2)) };
    }
  });
});

const allCharges = invoicesArrays.reduce((arr, cur) => arr.concat(cur), []);

const chargesByGroup = createTotalSumArray(allCharges, 'tag');
const chargesByLocation = createTotalSumArray(allCharges, 'location');

// Create PDFs
invoicesArrays.forEach((array) => {
  const name = translateEntry(array[0]).group;
  const groupArray = createTotalSumArray(array, 'tag');
  const pdfData = {
    html: allNumbersHtml,
    array: array,
    groupArray: groupArray,
    name: name,
    sum: Number((array.reduce((sum, cur) => sum + cur.price, 0).toFixed(2))),
    groupSum: Number((groupArray.reduce((sum, cur) => sum + cur.price, 0).toFixed(2)))
  }
  createPdf(pdfData)
})

createPdf({ html: summedHtml, name: 'сумирани групи', array: chargesByGroup, type: 'група' })
createPdf({ html: summedHtml, name: 'сумирани локации', array: chargesByLocation, type: 'локация' })
