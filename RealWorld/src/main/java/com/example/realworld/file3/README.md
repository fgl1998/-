# file3：先上传图片，再让业务引用 fileId

这个 demo 演示“上传图片”和“保存文章”分成两个请求。
两者运行在同一个 Spring Boot 项目里；上传接口不需要知道图片将用于什么业务。

## 1. 先理解整个过程

```text
第一次请求：上传接口
前端发送图片 → 保存图片到磁盘 + 保存文件记录 → 返回 fileId

第二次请求：业务接口
前端发送 { title, coverFileId } → 保存文章，封面字段只记录 fileId

显示图片：公开图片接口
浏览器请求 /file3/files/{fileId} → 查文件记录 → 读取磁盘文件 → 返回图片字节
```

**上传成功后，图片立即可以访问，不必先保存文章。**
一个已上传的 fileId 也可以被多篇文章引用。

## 2. fileId、磁盘路径、图片地址的区别

假设某次上传返回 `fileId = aabb...`，它是一个 32 位字符串。

| 名称 | 例子 | 谁使用 |
| --- | --- | --- |
| fileId | `aabb...` | 业务表保存它，用来引用图片 |
| 磁盘路径 | `E:/面试项目/RealWorld/uploads/file3/aabb...` | 后端读写文件 |
| 图片地址 | `http://localhost:8080/file3/files/aabb...` | 浏览器、`<img>` 请求它 |

本例约定：**磁盘文件名直接使用 fileId**，因此后端用“保存目录 + fileId”就能找到图片。
文件表不用再存一份完整磁盘路径，业务表也不用知道保存目录。
文件名虽然没有扩展名，但响应头会告诉浏览器图片类型，浏览器仍能显示。

## 3. 先运行起来

1. 在当前项目配置的 MySQL `realworld` 数据库中执行本目录的 `schema.sql`。
2. 确认 MySQL 已启动，然后启动 `RealWorldApplication`。
3. 使用下面的上传、查看图片和保存文章请求。

`schema.sql` 需要手动执行，不会随应用启动自动执行。
两张表只用于这个 demo：

```text
file3_files
    file_id         文件ID
    content_type    例如 image/png
    file_size       文件字节数

file3_articles
    article_id      文章ID
    title           标题
    cover_file_id   封面图片的文件ID
```

已有配置：

```properties
app.file3.upload-dir=uploads/file3
```

它相对于 Java 程序的启动工作目录。如果工作目录是 `E:/面试项目/RealWorld`，
就会保存在 `E:/面试项目/RealWorld/uploads/file3`。
也可以把配置改成固定的绝对路径，之后保持这个目录不变。

文件记录保存在 MySQL，图片保存在磁盘；只要数据库和保存目录保留，重启后仍能读取。

## 4. 第一次请求：上传图片

```text
POST http://localhost:8080/file3/files/upload
Body：form-data
字段名：file
字段类型：File / 文件
字段内容：选择一张 PNG、JPEG、GIF 或 WebP 图片
```

让 Apifox/Postman 自动生成 multipart 的 Content-Type 和 boundary。
上传大小继续使用项目已有的限制：单文件 20MB，整个请求 21MB。

成功返回示例：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "fileId": "aabbccddeeff00112233445566778899",
    "url": "/file3/files/aabbccddeeff00112233445566778899"
  },
  "success": true
}
```

示例中的 ID 只是演示，操作时要复制你真正收到的 fileId。
`url` 是相对于后端站点的地址，完整地址要加上 `http://localhost:8080`。
前端如果运行在另一个端口，也要使用后端的完整地址。

上传过程中，后端依次做这些事：

```java
// 生成文件标识
String fileId = UUID.randomUUID().toString().replace("-", "");

// 把图片内容保存到磁盘
file.transferTo(uploadDirectory.resolve(fileId));

// 把文件信息保存到数据库
fileMapper.insert(new File3Record(fileId, contentType, file.getSize()));
```

**图片内容存在磁盘上，数据库存的是图片信息。**

## 5. 直接访问图片

将返回的地址补全后粘贴到浏览器：

```text
GET http://localhost:8080/file3/files/你收到的fileId
```

这个接口成功时返回图片字节，不返回 `Result` 包装的 JSON：

```http
HTTP/1.1 200
Content-Type: image/png
Content-Disposition: inline

这里是图片的二进制内容
```

因此也可以用在 HTML 中：

```html
<img src="http://localhost:8080/file3/files/你收到的fileId" alt="文章封面">
```

不存在的图片、非法 fileId、磁盘上已丢失的图片，返回 HTTP 404。

这里把你刚学过的 Content-Type 分清楚：

| 场景 | Content-Type | 含义 |
| --- | --- | --- |
| 上传整个请求 | `multipart/form-data` | 请求体是包含文件的表单 |
| 表单里图片这一部分 | `image/png` 等 | 上传的图片声明自己的类型 |
| 上传成功的响应 | `application/json` | 返回 fileId 和 url |
| 浏览器读取图片的响应 | `image/png` 等 | 响应体是图片内容 |

## 6. 第二次请求：保存业务

把上传得到的 fileId 放进业务请求。这里用一篇只有标题和封面的文章举例：

```text
POST http://localhost:8080/file3/articles
Content-Type: application/json
```

```json
{
  "title": "我的第一篇图文文章",
  "coverFileId": "aabbccddeeff00112233445566778899"
}
```

这一次只发送 JSON，不再发送图片内容。
后端确认图片存在后，保存文章：

```text
article_id = 新生成的文章ID
title = 我的第一篇图文文章
cover_file_id = aabbccddeeff00112233445566778899
```

成功响应的 `data` 包含 `articleId`、`title`、`coverFileId`。
随后可以查询：

```text
GET http://localhost:8080/file3/articles/你收到的articleId
```

前端根据返回的 `coverFileId` 拼出 `/file3/files/{coverFileId}` 来显示封面。

所有 `/file3/**` 接口都无需 Token：当前项目登录拦截器只匹配 `/api/**`。
业务里检查“图片存在”只是确认引用有效，没有检查上传者或文件归属。

## 7. 建议的读代码顺序

1. `File3Controller.upload()`：接收上传，返回 fileId 和 url。
2. `File3Service.upload()`：文件内容写磁盘，文件信息写数据库。
3. `File3Controller.image()`：根据 fileId 返回图片。
4. `business/DemoArticleController.create()`：JSON 接收业务字段，只保存 coverFileId。
5. 两个 Mapper：看文件表和业务表分别保存了什么。

`record` 可以先理解为“装几个字段的数据类”。
`Resource` 表示供 Spring 读取的资源；`FileSystemResource` 表示磁盘文件。
`ResponseEntity` 用来指定 HTTP 状态、响应头和响应体。
Spring 会把 Resource 的内容写进响应体，浏览器再根据 Content-Type 显示图片。

## 8. 这个基础 demo 的范围

只支持声明为 PNG、JPEG、GIF、WebP 的上传，未做深入的图片内容识别。
沿用现有全局异常处理：JSON 接口主要通过 `code` 和 `success` 表示结果；
图片接口找不到文件时使用真正的 HTTP 404。
超限请求由 multipart 解析器拒绝，现有全局兜底尚未专门定制超限提示。

图片上传成功但文章没有保存时，图片仍保留并公开可访问。
本例没有删除、未引用图片清理、分片上传或多种存储实现，也没有跨磁盘与数据库的事务保证。

针对性测试：

```powershell
mvn -B -Dtest=File3DemoTest test
```

测试执行真实 Controller、文件保存和图片读取，数据库部分使用测试替身；
实际 MySQL 建表和连接仍按第 3 步准备。

参考：[Spring 返回 Resource 文件内容的说明](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/responsebody.html)。
