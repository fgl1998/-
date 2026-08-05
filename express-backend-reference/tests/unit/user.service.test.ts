import { describe, expect, it } from 'vitest'
import { AppError } from '../../src/shared/errors/app-error.js'
import type { User } from '../../src/modules/user/user.entity.js'
import { UserService } from '../../src/modules/user/user.service.js'
import { FakeUserRepository } from '../helpers/fake-user.repository.js'

const seed: User[] = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    createdAt: new Date('2026-08-01T08:00:00.000Z')
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    createdAt: new Date('2026-08-02T08:00:00.000Z')
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    createdAt: new Date('2026-08-03T08:00:00.000Z')
  }
]

async function expectAppError(
  action: () => Promise<unknown>,
  code: string,
  statusCode: number
) {
  try {
    await action()
    throw new Error('Expected action to throw AppError')
  } catch (error) {
    expect(error).toBeInstanceOf(AppError)
    expect(error).toMatchObject({ code, statusCode })
  }
}

describe('UserService', () => {
  it('calculates offset and pagination metadata', async () => {
    const repository = new FakeUserRepository(seed)
    const service = new UserService(repository)

    const result = await service.list({ page: 2, pageSize: 2 })

    expect(repository.lastPageInput).toEqual({ offset: 2, limit: 2 })
    expect(result.data.map((user) => user.id)).toEqual([1])
    expect(result.meta).toEqual({
      page: 2,
      pageSize: 2,
      total: 3,
      totalPages: 2
    })
  })

  it('returns a mapped user by ID', async () => {
    const service = new UserService(new FakeUserRepository(seed))

    await expect(service.getById(1)).resolves.toEqual({
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com',
      createdAt: '2026-08-01T08:00:00.000Z'
    })
  })

  it('raises USER_NOT_FOUND for an unknown ID', async () => {
    const service = new UserService(new FakeUserRepository())

    await expectAppError(() => service.getById(999), 'USER_NOT_FOUND', 404)
  })

  it('creates and maps a new user', async () => {
    const service = new UserService(new FakeUserRepository())

    await expect(
      service.create({ name: '赵六', email: 'zhaoliu@example.com' })
    ).resolves.toEqual({
      id: 1,
      name: '赵六',
      email: 'zhaoliu@example.com',
      createdAt: '2026-08-03T08:00:00.000Z'
    })
  })

  it('rejects an email that already exists', async () => {
    const service = new UserService(new FakeUserRepository(seed))

    await expectAppError(
      () =>
        service.create({
          name: '另一个张三',
          email: 'zhangsan@example.com'
        }),
      'EMAIL_ALREADY_EXISTS',
      409
    )
  })

  it('converts a duplicate-key race into a business conflict', async () => {
    const repository = new FakeUserRepository()
    repository.failNextCreateWithDuplicate = true
    const service = new UserService(repository)

    await expectAppError(
      () =>
        service.create({
          name: '并发用户',
          email: 'race@example.com'
        }),
      'EMAIL_ALREADY_EXISTS',
      409
    )
  })

  it('removes an existing user', async () => {
    const repository = new FakeUserRepository(seed)
    const service = new UserService(repository)

    await expect(service.remove(1)).resolves.toBeUndefined()
    await expect(repository.findById(1)).resolves.toBeNull()
  })

  it('raises USER_NOT_FOUND when removal affects no row', async () => {
    const service = new UserService(new FakeUserRepository())

    await expectAppError(() => service.remove(999), 'USER_NOT_FOUND', 404)
  })
})
