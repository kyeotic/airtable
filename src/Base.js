/**
 * module description
 * @module Base
 */
'use strict'

const { invariant } = require('./lib')

const { Table } = require('./Table')
const _client = Symbol('_client')
const _baseId = Symbol('_baseId')

/**
 * @typedef {import('./Table').Table} Table
 * @typedef {import('./query').Query} Query
 * @typedef {import('./query').QueryParams} QueryParams
 * @typedef {import('./Client').Client} Client
 * @typedef {import('./Client').Record} Record
 * @typedef {import('./Client').UpdateOptions} UpdateOptions
 */

/**
 * Airtable Base
 * @class Base
 */
class Base {
  /**
   *New Base
   * @param {Client} client the client this base belonds to
   * @param {string} baseId name or Id of the base
   * @memberof Base
   */
  constructor(client, baseId) {
    invariant(client, '"client" is required')
    invariant(
      typeof client === 'object' && client.query,
      '"client" must be a Client instance'
    )
    invariant(baseId, '"baseId" is required')
    this[_client] = client
    this[_baseId] = baseId
  }

  /**
   * Create a new Table reference
   * @param {string} tableName Name or Id of rtable
   * @returns {Table}
   * @memberof Base
   */
  table(tableName) {
    return new Table(this, tableName)
  }

  /**
   * Create a query
   * @param {string} tableName Name or Id of table
   * @param {QueryParams} params Query parameters
   * @returns {Query}
   * @memberof Base
   */
  query(tableName, params) {
    return this[_client].query(this[_baseId], tableName, params)
  }

  /**
   * Fetch a Record
   * @param {string} tableName Name or Id of table
   * @param {string} recordId Id of record
   * @returns {Promise.<Record>}
   * @memberof Base
   */
  async get(tableName, recordId) {
    return this[_client].get(this[_baseId], tableName, recordId)
  }

  /**
   * Create new Record
   * @param {string} tableName Name or Id of table
   * @param {{}} fields record to create
   * @returns {Promise.<Record>}
   * @memberof Base
   */
  async create(tableName, fields) {
    return this[_client].create(this[_baseId], tableName, fields)
  }

  /**
   * Update existing Record
   * @param {string} tableName Name or Id of table
   * @param {{ id: string, fields: {}}} record Record to update
   * @param {UpdateOptions} options update options
   * @returns {Promise.<Record>}
   * @memberof Base
   */
  async update(tableName, record, options) {
    return this[_client].update(this[_baseId], tableName, record, options)
  }

  /**
   * Fetch a Record
   * @param {string} tableName Name or Id of table
   * @param {string} recordId Id of record
   * @returns {Promise.<undefined>}
   * @memberof Base
   */
  async delete(tableName, recordId) {
    return this[_client].delete(this[_baseId], tableName, recordId)
  }
}

exports.Base = Base
