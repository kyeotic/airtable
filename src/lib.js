'use strict'

module.exports = {
  ...require('fetch-ponyfill')(),
  /**
   * @type {any} assertion
   */
  invariant: require('tiny-invariant')
}
