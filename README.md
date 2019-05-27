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
const myTable = client.base(baseId: string).table(tableName: string)

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

The Airtable objects come in three layers, with similar methods: **Client**, **Base**, and **Table**. Each is bound to the layer that created it.

For example a `Client` has a `query` method that accepts a `baseId`, `tableName` and query parameters; while a `Base` has a `query` that accepts a `tableName` and query parameters. A `Table` has a `query` method that only accepts query parameters.

## query

Queries are special **async generators** that allow iterating through the query they represent. They can be invoked to get an `AsyncIterator`, or you can use the **all** or **eachPage** functions on.

### AsyncIterator

Return an `AsyncIterator` usable with [`for-of-await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) loops.

```javascript
let query = client.query({/* some params */})
for await (let page of query()) {
  console.log(page) /* {
    records: [Record],
    offset: string
  }*/
}
```

### all

Return a Promise for all pages, flattened.

```javascript
let records = await query.all()
```

### eachPage

Provide an async function to manually page through the query set

```javascript
await query.eachPage(async page => {
  await processPage(page)
  await anotherProcess(page)
  console.log('page finished', page)
})
```

## Record

The **Record** type

```typescript
interface Record {
  id: string
  fields: Object<string, any>
  createdOn: string // datetime
}
```

## Client

### constructor

```typescript
new Client({
  // Airtable API Key
  apiKey: string,
  // API Host
  baseUrl = 'https://api.airtable.com/v0',
  // Enable Typecast for create/update
  typecast = false
})
```

### base

Create a new `Base` bound to the current client

```typescript
let base = client.base(baseId: string)
```

### query

Create a `query` iterable.

```typescript
let base = client.query(baseId: string, tableName: string)
```

### get

Return a record (or `null`) by its Id

```typescript
let base = client.get(baseId: string, tableName: string, recordId: string)
```

### create

Create a new record

```typescript
let { id, fields, createdOn } = client.create(baseId: string, tableName: string, fields: {})
```

### update

Update a record, either by overwriting or merging

```typescript
// Overrwrite
let record = client.create(baseId: string, tableName: string, record: Record)

// Merge
let record = client.create(baseId: string, tableName: string, record: Record, { merge: true} : { merge: boolean })
```

### get

Delete a record by its Id

```typescript
let base = client.delete(baseId: string, tableName: string, recordId: string)
```
