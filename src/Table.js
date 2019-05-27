/**
 * module description
 * @module Table
 */
'use strict'

const { invariant } = require('./lib')

const _base = Symbol('_base')
const _tableName = Symbol('__tableName')

/**
 * @typedef {import('./Base').Base} Base
 * @typedef {import('./query').Query} Query
 * @typedef {import('./query').QueryParams} QueryParams
 * @typedef {import('./Client').Record} Record
 * @typedef {import('./Client').UpdateOptions} UpdateOptions
 */

/**
 * Airtable Table
 * @class Table
 */
class Table {
  /**
   *New Table
   * @param {Base} base the Base this table belonds to
   * @param {string} tableName name or Id of the table
   * @memberof Table
   */
  constructor(base, tableName) {
    invariant(base, '"base" is required')
    invariant(
      typeof base === 'object' && base.query,
      '"base" must be a Base instance'
    )
    invariant(tableName, '"tableName" is required')
    this[_base] = base
    this[_tableName] = tableName
  }

  /**
   * Create a query
   * @param {QueryParams} params Query parameters
   * @returns {Query}
   * @memberof Table
   */
  query(params) {
    return this[_base].query(this[_tableName], params)
  }

  /**
   * Fetch a Record
   * @param {string} recordId Id of record
   * @returns {Promise.<Record>}
   * @memberof Table
   */
  async get(recordId) {
    return this[_base].get(this[_tableName], recordId)
  }

  /**
   * Create new Record
   * @param {{}} fields record to create
   * @returns {Promise.<Record>}
   * @memberof Table
   */
  async create(fields) {
    return this[_base].create(this[_tableName], fields)
  }

  /**
   * Update existing Record
   * @param {{ id: string, fields: {}}} record Record to update
   * @param {UpdateOptions} options update options
   * @returns {Promise.<Record>}
   * @memberof Table
   */
  async update(record, options) {
    return this[_base].update(this[_tableName], record, options)
  }

  /**
   * Fetch a Record
   * @param {string} recordId Id of record
   * @returns {Promise.<undefined>}
   * @memberof Table
   */
  async delete(recordId) {
    return this[_base].delete(this[_tableName], recordId)
  }
}

exports.Table = Table
