'use strict'

const { describe, Try } = require('riteway')
const { stub } = require('sinon')
const { createQuery } = require('../dist/main/lib/query')

describe('query()', async assert => {
  let client = { request: stub() }
  let query = createQuery(client, 'test', {})

  let pageOne = { records: [1, 2], offset: 2 }
  let pageTwo = { records: [3, 4] }

  client.request
    .onFirstCall()
    .resolves(pageOne)
    .onSecondCall()
    .resolves(pageTwo)

  let pages = []
  for await (let page of query()) pages.push(page)

  assert({
    given: 'query on 2 page result set',
    should: 'yield twice',
    actual: client.request.callCount,
    expected: 2
  })

  assert({
    given: 'query on 2 page result set',
    should: 'produce 2 pages',
    actual: pages,
    expected: [pageOne, pageTwo]
  })
})

describe('query.all', async assert => {
  let client = { request: stub() }
  let query = createQuery(client, 'test', {})

  let pageOne = { records: [1, 2], offset: 2 }
  let pageTwo = { records: [3, 4] }

  client.request
    .onFirstCall()
    .resolves(pageOne)
    .onSecondCall()
    .resolves(pageTwo)

  let pages = await query.all()

  await assert({
    given: 'query on 2 page result set',
    should: 'yield twice',
    actual: client.request.callCount,
    expected: 2
  })

  assert({
    given: 'query on 2 page result set',
    should: 'produce flattened records',
    actual: pages,
    expected: [...pageOne.records, ...pageTwo.records]
  })
})

describe('query.eachPage', async assert => {
  let client = { request: stub() }
  let query = createQuery(client, 'test', {})

  let pageOne = { records: [1, 2], offset: 2 }
  let pageTwo = { records: [3, 4] }

  client.request
    .onFirstCall()
    .resolves(pageOne)
    .onSecondCall()
    .resolves(pageTwo)

  let pages = []
  await query.eachPage(async page => {
    pages.push(page)
  })

  await assert({
    given: 'query on 2 page result set',
    should: 'yield twice',
    actual: client.request.callCount,
    expected: 2
  })

  assert({
    given: 'query on 2 page result set',
    should: 'produce flattened records',
    actual: pages,
    expected: [pageOne, pageTwo]
  })
})
