  import type { ArticleOutput } from '../article/article.dto.js'
  import { articleRepository } from '../article/article.repository.js'
  import type { CreateArticleInput,CreateArticleData } from '../article/article.schema.js'
  import {ArticleNotFoundError} from './article.error.js'
  import { generateSlug } from '../../utils/article.util.js'
  import {ForbiddenError} from '../../errors/common.error.js'
  
  
  export interface ArticleService {
    create(userId:number,input:CreateArticleInput):Promise<ArticleOutput>
    getArticleById(id:number):Promise<ArticleOutput>
    deleteBySlug(userId:number,slug:string):Promise<boolean>
  }
  export const articleService:ArticleService = {
    async create(userId,input:CreateArticleInput):Promise<ArticleOutput>{
      const inputWithSlug:CreateArticleData = {
        ...input,
        authorId:userId,
        slug:generateSlug(input.title)
      }
      const article = await articleRepository.create(inputWithSlug)
      return {
        id:article.id,
        title:article.title,
        description:article.description,
        body:article.body,
        slug:article.slug,
        author:article.author,
        tags:article.tags,
        createdAt:article.createdAt.toISOString(),
        updatedAt:article.updatedAt.toISOString(),
      }
    },
    async getArticleById(id:number):Promise<ArticleOutput>{
      const article = await articleRepository.findById(id)
      if(!article){
        throw new ArticleNotFoundError()
      }
      return {
        id:article.id,
        title:article.title,
        description:article.description,
        body:article.body,
        slug:article.slug,
        author:article.author,
        tags:article.tags,
        createdAt:article.createdAt.toISOString(),
        updatedAt:article.updatedAt.toISOString(),
      }
    },
    async deleteBySlug(userId:number,slug:string):Promise<boolean>{
      const article = await articleRepository.findBySlug(slug)
      if(!article){
        throw new ArticleNotFoundError()
      }
      if(article.author_id !== userId){
        throw new ForbiddenError()
      }
      const result = await articleRepository.deleteBySlug(slug)
      if(!result){
        throw new ArticleNotFoundError()
      }
      return result
    }
  }