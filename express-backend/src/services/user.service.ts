export interface User {
  id: number
  name: string
  email: string
}

export interface CreateUserInput {
  name: string
  email: string
}

const users: User[] = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com'
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com'
  }
]

let nextId = 3

export const userService = {
  findAll(): User[] {
    return users
  },

  findById(id: number): User | undefined {
    return users.find((user) => user.id === id)
  },

  create(input: CreateUserInput): User {
    const user: User = {
      id: nextId++,
      ...input
    }

    users.push(user)

    return user
  },

  remove(id: number): boolean {
    const index = users.findIndex((user) => user.id === id)

    if (index === -1) {
      return false
    }

    users.splice(index, 1)

    return true
  }
}