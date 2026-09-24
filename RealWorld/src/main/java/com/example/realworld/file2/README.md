# 第一课：最基础的文件上传

先打开同目录下的 `File2Controller.java`，只看 `upload()` 方法。
本课的目标：把一个文件从客户端传给 Java 后端，再保存到后端电脑的文件夹里。

## 1. 文件上传到底在做什么

假设你在 Apifox 里选择了电脑上的 `hello.txt`：

```text
客户端选择 hello.txt
        ↓ 发送 POST /file2/upload，带上文件内容
Spring 接收请求，把上传文件交给 MultipartFile
        ↓ 调用 file.transferTo(target)
后端把内容保存到自己的 uploads/file2 文件夹
        ↓
返回保存位置，方便你检查
```

这里传输的是文件内容。仅发送字符串 `C:/hello.txt`，后端拿到的也只是字符串，
不能据此读取别人电脑上的文件。

开发时，客户端和后端常常在同一台电脑上；部署后，文件会保存在运行 Java 后端的服务器上。

## 2. 接口长什么样

```text
请求方法：POST
请求地址：http://localhost:8080/file2/upload
请求体：multipart/form-data
文件字段名：file
```

当前项目的登录拦截器只拦截 `/api/**`，所以这个 `/file2/upload` 学习接口不用带 Token。
整个 RealWorld 应用仍使用原来的启动配置；本方法本身不操作数据库。

## 3. 按执行顺序读代码

### 第一步：接收文件

```java
@RequestParam(value = "file", required = false) MultipartFile file
```

- `MultipartFile`：Spring 提供的类型，表示本次请求上传的文件。
- `@RequestParam("file")`：从请求里找名字为 `file` 的字段。
- `required = false`：允许没有这个字段时进入方法，由我们自己返回“请选择非空文件”。

前端字段名要和注解里的 `file` 对应；右边的 Java 变量名可以不同。
例如把变量改成 `uploadedFile`，前端字段名仍然是 `file`。

它常用的几个方法：

| 代码 | 含义 | 示例 |
| --- | --- | --- |
| `file.getName()` | 表单字段名 | `file` |
| `file.getOriginalFilename()` | 客户端提供的原始文件名 | `hello.txt` |
| `file.getSize()` | 内容大小，单位是字节 | `12` |
| `file.isEmpty()` | 没有选文件或文件内容为空 | `true` / `false` |
| `file.transferTo(target)` | 将内容保存到指定位置 | 写入磁盘 |

收到 `MultipartFile` 时，文件可能还在内存或临时目录里。
调用保存方法，才把它放到我们指定的长期保存位置。

### 第二步：检查是否真的有内容

```java
if (file == null || file.isEmpty()) {
    return Result.error(400, "请选择非空文件");
}
```

没传 `file` 时，变量是 `null`；选了一个 0 字节的文件时，`isEmpty()` 为 `true`。
本练习把这两种情况都当成上传失败。

### 第三步：准备保存目录

```java
Files.createDirectories(uploadDirectory);
```

`Path` 表示一个磁盘路径；`Files` 提供创建目录、读取文件等操作。
上面这行会创建目录及缺失的父目录；目录已经存在时可以继续使用。

构造方法里这段配置：

```java
@Value("${app.file2.upload-dir:uploads/file2}") String uploadDirectory
```

表示读取 `app.file2.upload-dir` 配置；没有配置时默认使用 `uploads/file2`。
`toAbsolutePath()` 将相对路径转成绝对路径，`normalize()` 整理路径中的 `.` 等部分。
你先理解“这里确定保存目录”就够了。

如果启动时工作目录是 `E:/面试项目/RealWorld`，默认保存目录就是：

```text
E:/面试项目/RealWorld/uploads/file2
```

相对路径是相对于**启动程序的工作目录**，不是相对于这个 Java 源文件。
IDEA 的工作目录可能不同，以接口实际返回的位置为准。
也可以在 `application.properties` 里添加一行固定目录：

```properties
app.file2.upload-dir=E:/面试项目/RealWorld/uploads/file2
```

### 第四步：确定文件名和完整路径

```java
String savedName = UUID.randomUUID().toString();
Path target = uploadDirectory.resolve(savedName);
```

`UUID` 生成随机名称，让多次上传同名文件时几乎不会重名。
`resolve()` 把目录和名称拼成完整路径。

本课直接使用后端生成的名称，不把客户端提供的文件名拼进磁盘路径。
因此保存后的文件没有 `.txt` 等扩展名，但**文件内容没变**，可以用编辑器打开。

### 第五步：真正保存文件

```java
file.transferTo(target);
```

这是最关键的一行：把本次上传的文件内容写到 `target` 指定的位置。
Spring 已经提供了这个方法，我们这一课不用自己写输入流、输出流。

### 第六步：返回结果

```java
return Result.success(target.toString());
```

`Result` 是项目已经有的返回值包装类。这里的 `data` 是磁盘路径，方便学习时检查，
**它不是浏览器下载链接**。

保存时如果发生 `IOException`（例如磁盘目录无法写入），会交给项目已有的全局异常处理。
项目约定 HTTP 状态为 200，业务成功与否要看 JSON 中的 `code` 和 `success`。

## 4. 自己试一次

启动 `RealWorldApplication`，在 Apifox 或 Postman 中：

1. 新建 `POST http://localhost:8080/file2/upload`。
2. Body 选择 **form-data**。
3. 添加字段，Key 填 **file**，类型选择 **File / 文件**，然后选择本目录的 `hello.txt`。
4. 点击发送。让工具自动生成 `Content-Type` 请求头及 boundary，不要手填成 JSON。
5. 找到返回的 `data` 路径，用编辑器打开文件，对比内容。

也可以在 PowerShell 中执行：

```powershell
curl.exe -F "file=@E:/面试项目/RealWorld/src/main/java/com/example/realworld/file2/hello.txt" http://localhost:8080/file2/upload
```

`-F` 表示提交表单字段，`@` 表示读取后面的本地文件并发送内容。

成功响应示意（名称每次不同）：

```json
{
  "code": 200,
  "message": "success",
  "data": "E:\\面试项目\\RealWorld\\uploads\\file2\\582c63f4-e348-4b96-a653-c1c63b38b79d",
  "success": true
}
```

JSON 用 `\\` 表示一个反斜杠；实际 Windows 路径中只有一个。

项目已配置单文件最大 `20MB`、整个请求最大 `21MB`，无需增加依赖或修改限制。
超过限制会在进入本方法之前被上传解析过程拒绝；本课尚未专门处理超限提示，
现有全局兜底可能返回业务码 500。第一遍用小文本文件练习即可。

## 5. 本课的三个练习

1. 上传 `hello.txt`，查看保存后的内容，理解“收到文件”和“保存文件”是两步。
2. 再上传同一个文件，观察出现两个随机命名的文件。
3. 将表单字段名改成 `photo` 再发送，观察返回 `code: 400`，理解字段名匹配。

本课完成的标志：你能解释 `MultipartFile`、`resolve()` 和 `transferTo()` 各负责哪一步。

参考：[Spring 的 Multipart 请求说明](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/multipart-forms.html)、[MultipartFile API](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/multipart/MultipartFile.html)。
