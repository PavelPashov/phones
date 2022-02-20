# Phones

First copy the zip file containing the json invoices to the root directory of the repo.

To create the image:

```
docker-compose build
```

To run the container:

```
docker-compose up
```

To convert the address book to tsv run:

```
node convertJson2Tsv.js
```

To convert a tsv address book to json run:

```
node convertJson2Tsv.js path-to-tsv-file
```
