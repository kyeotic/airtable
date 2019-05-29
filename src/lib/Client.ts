import HttpError from 'standard-http-error'
import join from 'url-join'
import { Base } from './Base'
import { fetch, invariant } from './lib'
import { createQuery, QueryParams } from './query'

const apiDefault = 'https://api.airtable.com/v0'
const _apiKey = Symbol('_apiKey') // tslint:disable-line:variable-name
const _baseUrl = Symbol('_baseUrl') // tslint:disable-line:variable-name
const _typecast = Symbol('_typecast') // tslint:disable-line:variable-name

/**
 * Airtable Client
 */
export class Client {
  private [_apiKey]: string
  private [_baseUrl]: string
  private [_typecast]: boolean

  constructor({
    apiKey,
    baseUrl = apiDefault,
    typecast = false
  }: ClientParams) {
    invariant(apiKey, '"apiKey" option is required')
    this[_apiKey] = apiKey
    this[_baseUrl] = baseUrl
    this[_typecast] = typecast
  }

  /**
   * Create a new Base reference
   */
  public base(baseId: string) {
    return new Base(this, baseId)
  }

  /**
   * Create a query
   */
  public query(baseId: string, tableName: string, params: QueryParams) {
    return createQuery(
      this,
      join(baseId, encodeURIComponent(tableName)),
      params
    )
  }

  /**
   * Fetch a Record
   */
  public async get(
    baseId: string,
    tableName: string,
    recordId: string
  ): Promise<Record | null> {
    try {
      return await this.request({
        url: join(baseId, tableName, recordId)
      })
    } catch (e) {
      if ((<HttpError>e).statusCode === 404) {
        return null
      }
      throw e
    }
  }

  /**
   * Create new Record
   */
  public async create(
    baseId: string,
    tableName: string,
    fields: RecordFields
  ): Promise<Record> {
    return this.request({
      method: 'POST',
      url: join(baseId, tableName),
      body: { fields, typecast: this[_typecast] }
    })
  }

  /**
   * Update existing Record
   */
  public async update(
    baseId: string,
    tableName: string,
    record: Record,
    { merge = false }: UpdateParams = {}
  ): Promise<Record> {
    return this.request({
      method: merge ? 'PATCH' : 'PUT',
      url: join(baseId, tableName, record.id),
      body: { fields: record.fields, typecast: this[_typecast] }
    })
  }

  /**
   * Delete a Record
   */
  public async delete(
    baseId: string,
    tableName: string,
    recordId: string
  ): Promise<undefined> {
    return this.request({
      method: 'DELETE',
      url: join(baseId, tableName, recordId)
    })
  }

  /**
   * Make an authorized request
   */
  public async request<T>({
    url,
    method = 'GET',
    body,
    headers = {}
  }: {
    url: string
    method?: string
    body?: object | string
    headers?: object
  }): Promise<T> {
    const response = await fetch(join(this[_baseUrl], url), {
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
      return response.json()
    }
    const detail = await response.text()
    throw new HttpError(response.status, response.statusText, { detail })
  }
}

export interface RecordFields {
  // tslint:disable-next-line:no-any
  [key: string]: any
}

export interface Record {
  id: string
  fields: RecordFields
  createdOn: Date
}

export interface ClientParams {
  apiKey: string
  baseUrl?: string
  typecast?: boolean
}

export interface UpdateParams {
  merge?: boolean
}
