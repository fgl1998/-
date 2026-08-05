# 6 文件 User 模块简化教程设计

## 目标

新增一篇面向初学者的教程，用 6 个 User 模块文件完成 `POST /api/v1/users`，让读者先掌握 Route → Controller → Service → Repository → MySQL 主流程，再理解生产版为什么继续拆分。

## 范围

- 只新增 `doc/production-backend-tutorial/07-create-user-api-simple-version.md`。
- 不修改 README 和第 01～06 章。
- 继续使用 TypeScript、Express、Zod、mysql2 和手写参数化 SQL。
- 继续保持 Controller 负责 HTTP、Service 负责业务、Repository 负责数据库。
- 不加入列表、修改、删除、鉴权、日志和分页。

## 6 个 User 文件

1. `user.types.ts`：集中放 Entity、输出类型、Repository 契约和数据层重复错误。
2. `user.schema.ts`：校验并清洗请求，同时推导请求 DTO。
3. `user.repository.ts`：包含 MySQL Repository 和行数据转换，不再单独创建 Mapper 文件。
4. `user.service.ts`：处理邮箱重复业务规则，生成公开输出。
5. `user.controller.ts`：读取合法参数、调用 Service、返回 HTTP 201。
6. `user.route.ts`：声明 POST 路由和校验顺序。

依赖组装放在现有 `server.ts` 中，因此不创建 `user.module.ts`。

## 教学顺序

1. 先用一句话描述每个文件，不展示代码。
2. 展示一次请求的运行路线，并标明每次跳转的原因。
3. 给出“只打开 4 个核心文件”的第一次阅读方法。
4. 按依赖顺序手写 6 个文件的完整代码。
5. 展示 `server.ts` 中 4 行依赖组装代码。
6. 用手工请求和最小测试验证接口。
7. 最后展示 6 文件到生产版 10 文件的逐步拆分映射，并明确什么时候值得拆。

## 成功标准

- 读者始终能回答“我现在在哪一层、下一步为什么跳到另一个文件”。
- 所有 User 文件均提供完整代码，不出现省略号、伪代码或待补内容。
- 简化结构可以正常实现参数校验、重复邮箱判断、唯一索引兜底和 HTTP 错误响应。
- 教程明确说明简化结构是学习起点，不是要求所有项目永远保持 6 个文件。
