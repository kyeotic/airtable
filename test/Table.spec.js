'use strict'

const { describe, Try } = require('riteway')
const { stub } = require('sinon')
const { Table } = require('../src/Table')

describe('Table.ctor', async assert => {
  let should = 'throw'

  let actual = Try(() => new Table()).toString()
  assert({
    given: 'no arguments',
    should,
    actual: actual.substring(actual.indexOf('"')),
    expected: '"base" is required'
  })

  actual = Try(() => new Table(undefined, 'table')).toString()
  assert({
    given: 'no base',
    should,
    actual: actual.substring(actual.indexOf('"')),
    expected: '"base" is required'
  })

  actual = Try(() => new Table({ query: {} })).toString()
  assert({
    given: 'no tableName',
    should,
    actual: actual.substring(actual.indexOf('"')),
    expected: '"tableName" is required'
  })

  actual = Try(() => new Table('test-base', 'test-table')).toString()
  assert({
    given: 'invalid base',
    should,
    actual: actual.substring(actual.indexOf('"')),
    expected: '"base" must be a Base instance'
  })

  let given = 'valid table'
  actual = Try(() => new Table({ query: {} }, 'test-table'))
  assert({
    given,
    should: 'have no enumerable keys',
    actual: Object.keys(actual),
    expected: []
  })

  assert({
    given,
    should: 'have base key',
    actual: actual.base,
    expected: undefined
  })

  assert({
    given,
    should: 'have tableName key',
    actual: actual.tableName,
    expected: undefined
  })
})

describe('Table.query', async assert => {
  let query = { _: 'query' }
  let base = { query: stub().returns(query) }
  let table = Try(() => new Table(base, 'test-table'))

  assert({
    given: 'valid params',
    should: 'call base.query',
    actual: (Try(() => table.query({ name: 'test' })),
    base.query.firstCall.args),
    expected: ['test-table', { name: 'test' }]
  })

  assert({
    given: 'valid params',
    should: 'return query',
    actual: Try(() => table.query({ name: 'test' })),
    expected: query
  })
})

describe('Table.get', async assert => {
  let method = { _: 'method' }
  let base = { query: {}, get: stub().resolves(method) }
  let table = new Table(base, 'test-table')

  let actual = await Try(() => table.get(9))
  assert({
    given: 'valid params',
    should: 'call base.get',
    actual: base.get.firstCall.args,
    expected: ['test-table', 9]
  })

  assert({
    given: 'valid params',
    should: 'return get',
    actual,
    expected: method
  })
})

describe('Table.create', async assert => {
  let method = { _: 'method' }
  let base = { query: {}, create: stub().resolves(method) }
  let table = new Table(base, 'test-table')

  let actual = await Try(() => table.create({ name: 'test' }))
  assert({
    given: 'valid params',
    should: 'call base.create',
    actual: base.create.firstCall.args,
    expected: ['test-table', { name: 'test' }]
  })

  assert({
    given: 'valid params',
    should: 'return create',
    actual,
    expected: method
  })
})

describe('Table.update', async assert => {
  let method = { _: 'method' }
  let base = { query: {}, update: stub().resolves(method) }
  let table = new Table(base, 'test-table')

  let actual = await Try(() => table.update({ name: 'test' }, { merge: true }))
  assert({
    given: 'valid params',
    should: 'call base.update',
    actual: base.update.firstCall.args,
    expected: ['test-table', { name: 'test' }, { merge: true }]
  })

  assert({
    given: 'valid params',
    should: 'return update',
    actual,
    expected: method
  })

  actual = await Try(() => table.update({ name: 'test' }))
  assert({
    given: 'no optional params',
    should: 'call base.update',
    actual: base.update.secondCall.args,
    expected: ['test-table', { name: 'test' }, undefined]
  })

  assert({
    given: 'no optional params',
    should: 'return update',
    actual,
    expected: method
  })
})

describe('Table.delete', async assert => {
  let method = { _: 'method' }
  let base = { query: {}, delete: stub().resolves(method) }
  let table = new Table(base, 'test-table')

  let actual = await Try(() => table.delete(9))
  assert({
    given: 'valid params',
    should: 'call base.delete',
    actual: base.delete.firstCall.args,
    expected: ['test-table', 9]
  })

  assert({
    given: 'valid params',
    should: 'return delete',
    actual,
    expected: method
  })
})
