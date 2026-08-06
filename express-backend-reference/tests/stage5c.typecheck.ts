type CreateUserInput = {
  name: string
  email: string
}

type User = {
  id: number
  name: string
  email: string
  createdAt: Date
}

type UserRepository = {
  findByEmail(email: string): Promise<User | null>
  create(input: CreateUserInput): Promise<User>
}

class UserService {
  constructor(private readonly repository: UserRepository) {}
}

const users: User[] = []
let nextUserId = 1

// 5C 的学习实现：先用明确满足契约的内存 Repository，
// 到 5D 再学习 mysql2 的 RowDataPacket 和 ResultSetHeader。
const userRepository: UserRepository = {
  async findByEmail(email) {
    return users.find((user) => user.email === email) ?? null
  },

  async create(input) {
    const user: User = {
      id: nextUserId,
      ...input,
      createdAt: new Date()
    }

    nextUserId += 1
    users.push(user)
    return user
  }
}

const userService = new UserService(userRepository)

void userService

export {}
