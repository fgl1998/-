import { tagRepository } from "./tag.repository.js";
import  type{ TagOutput} from './tag.dto.js'

interface TagService {
  create(name: string): Promise<TagOutput>
  list(): Promise<TagOutput[]>
}

export const tagService: TagService = {
  async create(name: string): Promise<TagOutput> {
    const tag = await tagRepository.create(name)
    return {
      ...tag,
      createdAt: tag.createdAt.toISOString(),
      updatedAt: tag.updatedAt.toISOString()
    }
  },
  async list(): Promise<TagOutput[]> {
    
    const tags = await tagRepository.list()
    // console.log(22222,tags);

    return tags.map(tag=>{
      return {
        ...tag,
        createdAt:tag.createdAt.toISOString(),
        updatedAt:tag.updatedAt.toISOString()
      }
    })
  }
}