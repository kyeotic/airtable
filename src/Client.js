/**
 * module description
 * @module Client
 */
'use strict'

const join = require('url-join')
const HttpError = require('standard-http-error')
const { Base } = require('./Base')
const { createQuery } = require('./query')
const { fetch, invariant } = require('./lib')

const apiDefault = 'https://api.airtable.com/v0'
const _apiKey = Symbol('_apiKey')
const _baseUrl = Symbol('_baseUrl')
const _typecast = Symbol('_typecast')

/**
 * @typedef {import('./Base').Base} Base
 * @typedef {import('./query').Query} Query
 * @typedef {import('./query').QueryParams} QueryParams
 */

/**
 * An AsyncIterator for Airtable records
 * @typedef {Object.<{string,any}>} Record
 * @property {string} id unique Id of the Record
 * @property {Object.<{string,any}>} fields Record properties
 * @property {string|Datetime} createdTime created datetime of Record
 */

/**
 * Options for Update()
 * @typedef {object} UpdateOptions
 * @property {boolean} [merge=false] if "true" object will be destructively overrwitten (missing properties removed). Default: fase
 */

/**
 * Airtable Client
 * @class Client
 */
class Client {
  /**
   * New Airtable Client
   * @constructor
   * @param {object} options
   * @param {string} options.apiKey API Key for all airtable requests
   * @param {string} [options.baseUrl=apiDefault] Airtable API url
   * @param {boolean} [options.typecast=false] Use Airtable typecasting
   */
  constructor({ apiKey, baseUrl = apiDefault, typecast = false }) {
    invariant(apiKey, '"apiKey" option is required')
    this[_apiKey] = apiKey
    this[_baseUrl] = baseUrl
    this[_typecast] = typecast
  }

  /**
   * Create a new Base reference
   * @param {string} baseId Airtable Base Id
   * @returns {Base}
   * @memberof Client
   */
  base(baseId) {
    return new Base(this, baseId)
  }

  /**
   * Create a query
   * @param {string} baseId Airtable Base Id
   * @param {string} tableName Name or Id of table
   * @param {QueryParams} [params] Query Parameters
   * @returns {Query}
   * @memberof Client
   */
  query(baseId, tableName, params) {
    return createQuery(
      this,
      join(baseId, encodeURIComponent(tableName)),
      params
    )
  }

  /**
   * Fetch a Record
   * @param {string} baseId Airtable Base Id
   * @param {string} tableName Name or Id of table
   * @param {string} recordId Id of record
   * @returns {Promise.<Record>}
   * @memberof Client
   */
  async get(baseId, tableName, recordId) {
    try {
      return await this.request({
        url: join(baseId, tableName, recordId)
      })
    } catch (e) {
      if (e.statusCode === 404) return null
      throw e
    }
  }

  /**
   * Create new Record
   * @param {string} baseId Airtable Base Id
   * @param {string} tableName Name or Id of table
   * @param {{}} fields record to create
   * @returns {Promise.<Record>}
   * @memberof Client
   */
  async create(baseId, tableName, fields) {
    return await this.request({
      method: 'POST',
      url: join(baseId, tableName),
      body: { fields, typecast: this[_typecast] }
    })
  }

  /**
   * Update existing Record
   * @param {string} baseId Airtable Base Id
   * @param {string} tableName Name or Id of table
   * @param {{ id: string, fields: {}}} record Record to update
   * @param {UpdateOptions} [options] update options
   * @returns {Promise.<Record>}
   * @memberof Client
   */
  async update(baseId, tableName, record, { merge = false } = {}) {
    return await this.request({
      method: merge ? 'PATCH' : 'PUT',
      url: join(baseId, tableName, record.id),
      body: { fields: record.fields, typecast: this[_typecast] }
    })
  }

  /**
   * Fetch a Record
   * @param {string} baseId Airtable Base Id
   * @param {string} tableName Name or Id of table
   * @param {string} recordId Id of record
   * @returns {Promise.<undefined>}
   * @memberof Client
   */
  async delete(baseId, tableName, recordId) {
    return await this.request({
      method: 'DELETE',
      url: join(baseId, tableName, recordId)
    })
  }

  /**
   * Make an authorized request
   * @param {object} params
   * @param {string} params.url URL to join with client.baseUrl
   * @param {string} [params.method=GET] HTTP Method
   * @param {object} [params.body] Body to serialize
   * @param {object} [params.headers={}] headers Headers to merge in
   * @returns {Promise<any>}
   * @memberof Client
   */
  async request({ url, method = 'GET', body, headers = {} }) {
    let response = await fetch(join(this[_baseUrl], url), {
      method,
      credentials: 'omit',
      headers: {
        Authorization: `Bearer ${this[_apiKey]}`,
        'Content-Type': 'application/json',
        ...headers
      },
      body: body && JSON.stringify(body)
    })
    if (response.ok) {
      return await response.json()
    }
    let detail = await response.text()
    throw new HttpError(response.status, response.statusText, { detail })
  }
}

exports.Client = Client
