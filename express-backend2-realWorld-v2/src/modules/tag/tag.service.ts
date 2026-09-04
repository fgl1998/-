import  type{ TagOutput} from './tag.dto.js'
import type { MysqlTagRepository } from "./tag.mysql-repository.js";



export class TagService{
  private tagRepository:MysqlTagRepository
  constructor(tagRepository:MysqlTagRepository){
    this.tagRepository = tagRepository
  }

   async create(name: string): Promise<TagOutput> {
    const tag = await this.tagRepository.create(name)
    return {
      ...tag,
      createdAt: tag.createdAt.toISOString(),
      updatedAt: tag.updatedAt.toISOString()
    }
  }

  async list(): Promise<TagOutput[]> {
    const tags = await this.tagRepository.list()
    return tags.map(tag=>{
      return {
        ...tag,
        createdAt:tag.createdAt.toISOString(),
        updatedAt:tag.updatedAt.toISOString()
      }
    })
  }
}