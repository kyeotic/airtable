'use strict'

const { describe, Try } = require('riteway')
const { stub } = require('sinon')
const nock = require('nock')
const { Client } = require('../src/Client')
const { Base } = require('../src/Base')

describe('Client.ctor', async assert => {
  let should = 'throw'

  let actual = Try(() => new Client()).toString()
  assert({
    given: 'no arguments',
    should,
    actual: /cannot destructure/i.test(actual),
    expected: true
  })

  actual = Try(() => new Client({})).toString()
  assert({
    given: 'no apiKey',
    should,
    actual: actual.substring(actual.indexOf('"')),
    expected: '"apiKey" option is required'
  })

  let given = 'valid params'
  actual = Try(() => new Client({ apiKey: 'test-key' }))
  assert({
    given,
    should: 'have no enumerable keys',
    actual: Object.keys(actual),
    expected: []
  })

  assert({
    given,
    should: 'have apiKey key',
    actual: actual.apiKey,
    expected: undefined
  })

  assert({
    given,
    should: 'have baseUrl key',
    actual: actual.baseUrl,
    expected: undefined
  })
})

describe('Client.base', async assert => {
  let client = Try(() => new Client({ apiKey: 'test-key' }))
  let actual = client.base('test-base') instanceof Base
  assert({
    given: 'a baseId',
    should: 'return a new Base instance',
    actual,
    expected: true
  })
})

describe('Client.query', async assert => {
  let client = Try(() => new Client({ apiKey: 'test-key' }))
  let query = Try(() => client.query('test-base', 'test-table'))

  assert({
    given: 'valid params',
    should: 'return query iterator',
    actual: query()[Symbol.asyncIterator] instanceof Function,
    expected: true
  })

  assert({
    given: 'valid params',
    should: 'return query.all',
    actual: query.all instanceof Function,
    expected: true
  })

  assert({
    given: 'valid params',
    should: 'return query.eachPage',
    actual: query.eachPage instanceof Function,
    expected: true
  })
})

describe(
  'Client.get',
  nockTest(async assert => {
    let client = new Client({ apiKey: 'test-key' })
    let expected = { id: '1', fields: {} }

    nock(/airtable/)
      .get(/test-base/)
      .reply(200, expected)

    let actual = await client.get('test-base', 'test-table', '1')

    assert({
      given: 'valid params',
      should: 'return airtable response',
      actual,
      expected
    })

    nock(/airtable/)
      .get(/test-base/)
      .reply(404, null)

    actual = await client.get('test-base', 'test-table', '1')

    assert({
      given: 'missing id',
      should: 'return null',
      actual,
      expected: null
    })

    nock(/airtable/)
      .get(/test-base/)
      .reply(500, { message: 'something failed' })

    actual = await Try(() => client.get('test-base', 'test-table', '1'))

    assert({
      given: 'airtable 500',
      should: 'throw',
      actual: actual.statusCode,
      expected: 500
    })
  })
)

describe(
  'Client.create',
  nockTest(async assert => {
    let client = new Client({ apiKey: 'test-key' })
    let expected = { id: '1', fields: { name: 'test-record' } }

    let usedTypecast
    nock(/airtable/)
      .post(/test-base/)
      .reply(201, function(uri, body) {
        usedTypecast = body.typecast
        return expected
      })

    let actual = await client.create('test-base', 'test-table', expected.fields)

    assert({
      given: 'valid params',
      should: 'return airtable response',
      actual,
      expected
    })

    assert({
      given: 'default client',
      should: 'not send typecast',
      actual: usedTypecast,
      expected: false
    })

    nock(/airtable/)
      .post(/test-base/)
      .reply(500, { message: 'something failed' })

    actual = await Try(() =>
      client.create('test-base', 'test-table', expected.fields)
    )

    assert({
      given: 'airtable 500',
      should: 'throw',
      actual: actual.statusCode,
      expected: 500
    })

    client = new Client({ apiKey: 'test-key', typecast: true })

    nock(/airtable/)
      .post(/test-base/)
      .reply(201, function(uri, body) {
        usedTypecast = body.typecast
        return expected
      })

    actual = await Try(() =>
      client.create('test-base', 'test-table', expected.fields)
    )

    assert({
      given: 'typecast client',
      should: 'send typecast',
      actual: usedTypecast,
      expected: true
    })
  })
)

describe(
  'Client.update',
  nockTest(async assert => {
    let client = new Client({ apiKey: 'test-key' })
    let expected = { id: '1', fields: { name: 'test-record' } }

    let usedTypecast
    nock(/airtable/)
      .put(/test-base/)
      .reply(201, function(uri, body) {
        usedTypecast = body.typecast
        return expected
      })

    let actual = await client.update('test-base', 'test-table', expected)

    assert({
      given: 'valid params',
      should: 'return airtable response',
      actual,
      expected
    })

    assert({
      given: 'default client',
      should: 'not send typecast',
      actual: usedTypecast,
      expected: false
    })

    nock(/airtable/)
      .put(/test-base/)
      .reply(500, { message: 'something failed' })

    actual = await Try(() => client.update('test-base', 'test-table', expected))

    assert({
      given: 'airtable 500',
      should: 'throw',
      actual: actual.statusCode,
      expected: 500
    })

    client = new Client({ apiKey: 'test-key', typecast: true })

    nock(/airtable/)
      .patch(/test-base/)
      .reply(201, function(uri, body) {
        usedTypecast = body.typecast
        return expected
      })

    actual = await Try(() =>
      client.update('test-base', 'test-table', expected, { merge: true })
    )

    assert({
      given: 'typecast client',
      should: 'send typecast',
      actual: usedTypecast,
      expected: true
    })
  })
)

describe(
  'Client.delete',
  nockTest(async assert => {
    let client = new Client({ apiKey: 'test-key' })
    let expected = { id: '1', fields: {} }

    nock(/airtable/)
      .delete(/test-base/)
      .reply(200, expected)

    let actual = await client.delete('test-base', 'test-table', '1')

    assert({
      given: 'valid params',
      should: 'return airtable response',
      actual,
      expected
    })

    nock(/airtable/)
      .delete(/test-base/)
      .reply(500, { message: 'something failed' })

    actual = await Try(() => client.delete('test-base', 'test-table', '1'))

    assert({
      given: 'airtable 500',
      should: 'throw',
      actual: actual.statusCode,
      expected: 500
    })
  })
)

function nockTest(testFn) {
  return async t => {
    nock.cleanAll()
    try {
      return await testFn(t)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('test error', e, e.stack)
      throw e
    } finally {
      nock.cleanAll()
    }
  }
}
