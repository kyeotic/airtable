'use strict'

import ponyfill from 'fetch-ponyfill'
import invariant from 'tiny-invariant'
export { invariant }

const { fetch, Request, Response, Headers } = ponyfill()
export { fetch, Request, Response, Headers }
