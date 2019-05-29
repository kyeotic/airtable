'use strict'

const { describe, Try } = require('riteway')
const { stub } = require('sinon')
const { Base } = require('../build/module/lib/Base')
const { Table } = require('../build/module/lib/Table')

describe('Base.ctor', async assert => {
  let should = 'throw'

  let actual = Try(() => new Base()).toString()
  assert({
    given: 'no arguments',
    should,
    actual: actual.substring(actual.indexOf('"')),
    expected: '"client" is required'
  })

  actual = Try(() => new Base(undefined, 'base')).toString()
  assert({
    given: 'no client',
    should,
    actual: actual.substring(actual.indexOf('"')),
    expected: '"client" is required'
  })

  actual = Try(() => new Base({ query: {} })).toString()
  assert({
    given: 'no baseId',
    should,
    actual: actual.substring(actual.indexOf('"')),
    expected: '"baseId" is required'
  })

  actual = Try(() => new Base('test-client', 'test-base')).toString()
  assert({
    given: 'invalid client',
    should,
    actual: actual.substring(actual.indexOf('"')),
    expected: '"client" must be a Client instance'
  })

  let given = 'valid base'
  actual = Try(() => new Base({ query: {} }, 'test-base'))
  assert({
    given,
    should: 'have no enumerable keys',
    actual: Object.keys(actual),
    expected: []
  })

  assert({
    given,
    should: 'have client key',
    actual: actual.client,
    expected: undefined
  })

  assert({
    given,
    should: 'have baseId key',
    actual: actual.baseId,
    expected: undefined
  })
})

describe('Base.table', async assert => {
  let query = { _: 'query' }
  let client = { query: stub().returns(query) }
  let base = Try(() => new Base(client, 'test-base'))
  let actual = base.table('test-table') instanceof Table
  assert({
    given: 'a tableName',
    should: 'return a new Table instance',
    actual,
    expected: true
  })
})

describe('Base.query', async assert => {
  let query = { _: 'query' }
  let client = { query: stub().returns(query) }
  let base = Try(() => new Base(client, 'test-base'))

  assert({
    given: 'valid params',
    should: 'call client.query',
    actual: (Try(() => base.query('test-table', { name: 'test' })),
    client.query.firstCall.args),
    expected: ['test-base', 'test-table', { name: 'test' }]
  })

  assert({
    given: 'valid params',
    should: 'return query',
    actual: Try(() => base.query('test-table', { name: 'test' })),
    expected: query
  })
})

describe('Base.get', async assert => {
  let method = { _: 'method' }
  let client = { query: {}, get: stub().resolves(method) }
  let base = new Base(client, 'test-base')

  let actual = await Try(() => base.get('test-table', 9))
  assert({
    given: 'valid params',
    should: 'call client.get',
    actual: client.get.firstCall.args,
    expected: ['test-base', 'test-table', 9]
  })

  assert({
    given: 'valid params',
    should: 'return get',
    actual,
    expected: method
  })
})

describe('Base.create', async assert => {
  let method = { _: 'method' }
  let client = { query: {}, create: stub().resolves(method) }
  let base = new Base(client, 'test-base')

  let actual = await Try(() => base.create('test-table', { name: 'test' }))
  assert({
    given: 'valid params',
    should: 'call client.create',
    actual: client.create.firstCall.args,
    expected: ['test-base', 'test-table', { name: 'test' }]
  })

  assert({
    given: 'valid params',
    should: 'return create',
    actual,
    expected: method
  })
})

describe('Base.update', async assert => {
  let method = { _: 'method' }
  let client = { query: {}, update: stub().resolves(method) }
  let base = new Base(client, 'test-base')

  let actual = await Try(() =>
    base.update('test-table', { name: 'test' }, { merge: true })
  )
  assert({
    given: 'valid params',
    should: 'call client.update',
    actual: client.update.firstCall.args,
    expected: ['test-base', 'test-table', { name: 'test' }, { merge: true }]
  })

  assert({
    given: 'valid params',
    should: 'return update',
    actual,
    expected: method
  })

  actual = await Try(() => base.update('test-table', { name: 'test' }))
  assert({
    given: 'no optional params',
    should: 'call client.update',
    actual: client.update.secondCall.args,
    expected: ['test-base', 'test-table', { name: 'test' }, undefined]
  })

  assert({
    given: 'no optional params',
    should: 'return update',
    actual,
    expected: method
  })
})

describe('Base.delete', async assert => {
  let method = { _: 'method' }
  let client = { query: {}, delete: stub().resolves(method) }
  let base = new Base(client, 'test-base')

  let actual = await Try(() => base.delete('test-table', 9))
  assert({
    given: 'valid params',
    should: 'call client.delete',
    actual: client.delete.firstCall.args,
    expected: ['test-base', 'test-table', 9]
  })

  assert({
    given: 'valid params',
    should: 'return delete',
    actual,
    expected: method
  })
})
