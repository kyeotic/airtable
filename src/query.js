'use strict'

/**
 * module description
 * @module query
 */

const { stringify } = require('querystringify')

/**
 * An AsyncIterator for Airtable records
 * @typedef {Object|AsyncIterableIterator} Query
 * @property {Function} all fetch all pages
 * @property {Function} age The age of the person.
 * @property {Function} eachPage Run function on every page serially
 */

/**
 * Query Parameters.
 * @typedef {Object<string, any>} QueryParams
 * @property {string[]} [fields] field whitelist for response
 * @property {string} [filterByFormula] filter formula for records
 * @property {number} [maxRecords] max total records, can exceed page size
 * @property {number} [pageSize=100] items per page. Max: 100
 * @property {Object[]} [sort] Array of sort objects. See docs
 * @property {string} [view] Name or Id of view
 * @property {('json'|'string')} [cellFormat=json] Output format for values.
 * @property {string} [timeZone] Timezone for cellFormat="string". Required when cellFormat="string"
 * @property {string} [userLocale] Locale for cellFormat="string". Required when cellFormat="string"
 */

/**
 * @typedef {import('./Client').Client} Client
 */

module.exports = {
  createQuery
}

/**
 * create a query that allows iterating or retrieving records
 *
 * @param {Client} client Airtable client
 * @param {string} url url, before querystring
 * @param {QueryParams} [params] Query parameters. See

 * @returns Query
 */
function createQuery(client, url, params = {}) {
  // Clone params
  params = {
    ...params,
    fields: params.fields && [...params.fields],
    sort: params.sort && [...params.sort]
  }
  /**
   * @type {Query} query
   */
  let query = async function*() {
    let page = {}
    do {
      page = await client.request({
        url: url + stringify(params, true)
      })
      yield page
    } while (page.offset)
  }

  /**
   * Fetch all pages
   * @typedef {Function} all
   */
  query.all = async () => {
    let items = []
    for await (let page of query()) items.push(...page.records)
    return items
  }
  /**
   * Run on each page
   * @typedef {Function} eachPage
   * @param {function} pageFn async function to be awaited on each poage
   */
  query.eachPage = async pageFn => {
    for await (let page of query()) {
      await pageFn(page)
    }
  }
  return query
}
