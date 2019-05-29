# @kyeotic/airtable

This is alternative to the largely undocumented, and slightly unconventional, [official client](https://github.com/Airtable/airtable.js). This library is _heavily_ inspired by the official client.

# Installation

```
npm install @kyeotic/airtable
```

# Quick Start

```javascript
const { Client } = require('@kyeotic/airtable')
const client = new Client({
  apiKey: string,
  baseUrl: string
})
const myTable = client.base(baseId).table(tableName)

let query = myTable.query({ view: 'Grid View' })

// --- Paging ---

// AsyncIterator paging
for await (let page of query()) {
  console.log(page) /* {
    records: [Record],
    offset: string
  }*/
}

// Auto paging
let records = await query.all()

// Stream paging
await query.eachPage(async page => {
  await processPage(page.records)
})

// --- CRUD ---

/* Record: {
  id: string,
  fields: {},
  createdOn: Datetime
} */

let dbItem = await myTable.get(recordId)
let newItem = await myTable.create(record)
let updated = await myTable.update({ ...newItem.fields, name: 'updated' })
await myTable.delete(recordId)
```

# API

The docs are hosted here
