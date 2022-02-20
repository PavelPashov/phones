const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const PDFMerger = require('pdf-merger-js');

const merger = new PDFMerger();
const dirName = './results';
const results = fs.readdirSync(dirName);
const filePaths = results.map((file) => path.resolve(dirName, file));

const d = new Date();
const month = ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"];

(async () => {
  filePaths.map((f) => merger.add(f))
  await merger.save('./results/Фактури.pdf'); //save under given name and reset the internal document
})();

const password = process.env.PASSWORD
const sender = process.env.SENDER
const recipient = process.env.RECIPIENT

// create reusable transporter object using the default SMTP transport 
const smtpConfig = {
  service: 'Gmail',
  secure: true, // use SSL
  auth: {
    user: sender,
    pass: password
  },
};

const transporter = nodemailer.createTransport(smtpConfig);

// setup e-mail data with unicode symbols
const mailOptions = {
  envelope: {
    from: `${sender}@gmail.com`, // sender address
    to: recipient,   // list of receivers
  },
  subject: `Фактури ${month[d.getMonth()]}`,
  attachments: [{ path: './results/Фактури.pdf', contentType: 'application/pdf' }]
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    return console.log(error);
  }
  console.log('Message sent: ' + info.response);
});


