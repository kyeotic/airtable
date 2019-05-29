'use strict'

require('dotenv').config()
const { Client } = require('../build/main/lib/Client')
let client = new Client({ apiKey: process.env.AIRTABLE_KEY })
let baseId = process.env.AIRTABLE_BASE_ID
let tableName = process.env.AIRTABLE_TABLE_NAME
// eslint-disable-next-line no-console
let log = console.log.bind(console)

;(async () => {
  let query = client.query(baseId, tableName)
  log(query)
  log('for-of-await iteration')
  for await (let page of query()) {
    log(page.records.length)
  }
  log('auto iteration')
  let items = await query.all()
  log(items.length)
  log('stream iteration')
  await query.eachPage(async page => {
    log(page.records.length)
  })
  log('done')
})().catch(e => log(e))
