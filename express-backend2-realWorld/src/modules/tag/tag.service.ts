import { tagRepository } from "./tag.repository.js";
import  type{ TagOutput} from './tag.dto.js'

interface TagService {
  create(name: string): Promise<TagOutput>
}

export const tagService: TagService = {
  async create(name: string): Promise<TagOutput> {
    const tag = await tagRepository.create(name)
    return tag
  }
}