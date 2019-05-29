// tslint:disable: no-unsafe-any no-any
import { stringify } from 'querystringify'
import { Client, Record } from './Client'

export interface QueryParams {
  fields?: string[]
  filterByFormula?: string
  maxRecords?: number
  pageSize?: number
  sort?: object[]
  view?: string
  cellFormat?: 'json' | 'string'
  timeZone?: string
  userLocale?: string
}

export interface Page {
  records: Record[]
  offset?: string
}

export interface Query extends AsyncIterableIterator<Page> {
  all(): Promise<Record[]>
  eachPage(pageFn: () => Promise<void>): Promise<void>
}

/**
 * Create AsyncIterator for Airtable records
 */
export function createQuery(
  client: Client,
  url: string,
  params: QueryParams = {
    pageSize: 100,
    cellFormat: 'json'
  }
): Query {
  // Clone params
  params = {
    ...params,
    fields: params.fields && [...params.fields],
    sort: params.sort && [...params.sort]
  }

  let query: any = async function*() {
    let page: Page
    do {
      page = await client.request<Page>({
        url: url + stringify(params, true)
      })
      yield page
    } while (page.offset)
  }

  query.all = async (): Promise<Record[]> => {
    let items = []
    for await (let page of query()) items.push(...page.records)

    return items
  }

  query.eachPage = async (pageFn: (page: Page) => Promise<void>) => {
    for await (let page of query()) {
      await pageFn(page)
    }
  }

  return <Query>query
}
