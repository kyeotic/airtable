import { Client, Record, RecordFields, UpdateParams } from './Client'
import { invariant } from './lib'
import { Query, QueryParams } from './query'
import { Table } from './Table'

const _client = Symbol('_client') // tslint:disable-line:variable-name
const _baseId = Symbol('_baseId') // tslint:disable-line:variable-name

/**
 * Airtable Base
 */
export class Base {
  private [_client]: Client
  private [_baseId]: string
  constructor(client: Client, baseId: string) {
    invariant(client, '"client" is required')
    invariant(client instanceof Client, '"client" must be a Client instance')
    invariant(baseId, '"baseId" is required')
    this[_client] = client
    this[_baseId] = baseId
  }

  /**
   * Create a new Table reference
   */
  public table(tableName: string): Table {
    return new Table(this, tableName)
  }

  /**
   * Create a query
   */
  public query(tableName: string, params: QueryParams): Query {
    return this[_client].query(this[_baseId], tableName, params)
  }

  /**
   * Fetch a Record
   */
  public async get(
    tableName: string,
    recordId: string
  ): Promise<Record | null> {
    return this[_client].get(this[_baseId], tableName, recordId)
  }

  /**
   * Create new Record
   */
  public async create(
    tableName: string,
    fields: RecordFields
  ): Promise<Record> {
    return this[_client].create(this[_baseId], tableName, fields)
  }

  /**
   * Update existing Record
   */
  public async update(
    tableName: string,
    record: Record,
    options: UpdateParams
  ): Promise<Record> {
    return this[_client].update(this[_baseId], tableName, record, options)
  }
  /**
   * Delete a Record
   */
  public async delete(tableName: string, recordId: string): Promise<undefined> {
    return this[_client].delete(this[_baseId], tableName, recordId)
  }
}
