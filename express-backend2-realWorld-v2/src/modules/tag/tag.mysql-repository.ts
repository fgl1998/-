import type{ Tag } from './tag.entity.js'
import type{ResultSetHeader} from 'mysql2/promise'
import  type { TagRow } from './tag.mapper.js'
import { toTag } from './tag.mapper.js'
import {TagNotFoundError} from './tag.error.js'
import type { Pool } from 'mysql2/promise'
import type { TagRepository } from './tag.repository.js'

export class MysqlTagRepository implements TagRepository {
  constructor(private readonly pool: Pool) {}

  async create(name: string): Promise<Tag> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      `
      insert into tags(name) values(?)
      `,
      [name]
    )
    const tag = await this.findById(result.insertId)
    if(!tag){
      throw new TagNotFoundError()
    }
    return tag
  }

  async findById(id: number):Promise<Tag|null>{ 
    const [rows] = await this.pool.execute<TagRow[]>(
      `
      select * from tags where id = ?
      `,
      [id]
    )
    return rows[0] ? toTag(rows[0]) : null
  }

  async list(): Promise<Tag[]> { 
    const [rows] = await this.pool.execute<TagRow[]>(
      `
      select id ,name ,created_at ,updated_at from tags
      `
    )
    return rows.map(toTag)
  }

}
