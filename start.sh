#!/bin/bash
rm -rf invoices
rm -rf results
unzip invoices* -d invoices
chmod +r invoices/*
node index.js
node email.js
rm -rf invoices*.zip