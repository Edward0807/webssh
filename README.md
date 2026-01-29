# WebSSH

## 项目简介

WebSSH 是一个基于Go(后端)和Vue2(前端)的Web端SSH连接工具，集成SFTP文件管理
* 连接界面
![photo_2025-08-04_18-36-27](https://github.com/user-attachments/assets/1a0cccf9-ae15-4743-9dfd-f2b7bbfcd2d6)


* 终端和sftp管理页面
![image](https://github.com/user-attachments/assets/c0ee38c2-e336-4ec6-a845-2e527062b20c)


## 功能介绍

- **Web 终端**：通过浏览器直接连接远程服务器，支持一键生成快捷链接。
- **多种认证方式**：支持密码和密钥两种 SSH 登录方式。
- **文件管理**：支持远程文件的上传、下载与浏览。
- **多标签页**：可同时管理多个 SSH 连接会话。
- **主题切换**：支持明暗主题自由切换。
- **初始命令**：支持登录后自动执行指定命令。
- **安全认证**：可选开启 Web 端登录认证。

## 安装与运行方法

### 1. Docker 镜像快速启动

```bash
docker run -d \
  -p 8888:8888 \
  -e USER=youruser     # 可选，Web登录用户名
  -e PASS=yourpass     # 可选，Web登录密码（需与USER同时设置）
  -e PORT=8888         # 可选，服务端口，默认8888
  --name webssh \
  eooce/webssh:latest
```

### 2. Docker Compose 部署

新建 `docker-compose.yml`：

```yaml
version: '3'
services:
  webssh:
    image: eooce/webssh:latest
    container_name: webssh
    ports:
      - "8888:8888"
    environment:
      - USER=      # 可选，Web登录用户名（需与PASS同时设置）
      - PASS=      # 可选，Web登录密码
      - PORT=8888  # 可选，服务端口，默认8888
    restart: unless-stopped
```

启动服务：
```bash
docker-compose up -d
```

---

### 3. 源码构建（前端+后端）

1. **环境要求**：Node.js 14+，Go 1.21+
2. **安装前端依赖**：
   ```bash
   cd webssh/frontend
   npm install
   ```
3. **构建前端**：
   ```bash
   npm run fix && npm run build
   ```
   构建产物在 根目录public
4. **启动后端服务**：
   ```bash
   cd .. && go run main.go
   ```
   - 默认监听端口为 8888，可通过 `-p` 参数指定端口。
   - 可通过 `-a user:pass` 启用 Web 登录认证。

## 鸣谢
[Jrohy](https://github.com/Jrohy)
