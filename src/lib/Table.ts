import { Base } from './Base'
import { Record, RecordFields, UpdateParams } from './Client'
import { invariant } from './lib'
import { Query, QueryParams } from './query'

const _base = Symbol('_base') // tslint:disable-line:variable-name
const _tableName = Symbol('__tableName') // tslint:disable-line:variable-name

/**
 * Airtable Table
 */
export class Table {
  private [_base]: Base
  private [_tableName]: string

  constructor(base: Base, tableName: string) {
    invariant(base, '"base" is required')
    invariant(base instanceof Base, '"base" must be a Base instance')
    invariant(tableName, '"tableName" is required')
    this[_base] = base
    this[_tableName] = tableName
  }

  /**
   * Create a query
   */
  public query(params: QueryParams): Query {
    return this[_base].query(this[_tableName], params)
  }

  /**
   * Fetch a Record
   */
  public async get(recordId: string): Promise<Record> {
    return this[_base].get(this[_tableName], recordId)
  }

  /**
   * Create new Record
   */
  public async create(fields: RecordFields): Promise<Record> {
    return this[_base].create(this[_tableName], fields)
  }

  /**
   * Update existing Record
   */
  public async update(record: Record, options: UpdateParams): Promise<Record> {
    return this[_base].update(this[_tableName], record, options)
  }

  public async delete(recordId: string): Promise<undefined> {
    return this[_base].delete(this[_tableName], recordId)
  }
}
