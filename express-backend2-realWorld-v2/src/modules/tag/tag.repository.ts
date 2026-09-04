import type{ Tag } from './tag.entity.js'


export interface TagRepository {
  create(name: string): Promise<Tag>
  findById(id: number): Promise<Tag | null>
  list(): Promise<Tag[]>
}
