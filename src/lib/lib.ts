'use strict'

import ponyfill from 'fetch-ponyfill'
export { default as invariant } from 'tiny-invariant'

const { fetch, Request, Response, Headers } = ponyfill()
export { fetch, Request, Response, Headers }
