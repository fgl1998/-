import type{ Tag } from './tag.entity.js'
import type{ResultSetHeader} from 'mysql2/promise'
import  type { TagRow } from './tag.mapper.js'
import { toTag } from './tag.mapper.js'
import {pool} from '../../database/pool.js'
import {TagNotFoundError} from './tag.error.js'

export interface TagRepository {
  create(name: string): Promise<Tag>
  findById(id: number): Promise<Tag | null>
}

export const tagRepository: TagRepository = {
  async create(name: string): Promise<Tag> {
    const [result] = await pool.execute<ResultSetHeader>(
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
  },
  async findById(id: number):Promise<Tag|null>{ 
    const [rows] = await pool.execute<TagRow[]>(
      `
      select * from tags where id = ?
      `,
      [id]
    )
    return rows[0] ? toTag(rows[0]) : null
  }
}