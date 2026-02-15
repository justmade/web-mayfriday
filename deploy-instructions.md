# 部署到 Vercel 的完整步骤

## 方法：GitHub + Vercel（推荐）

### 步骤 1：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名称：`web-mayfriday`（或其他名称）
3. 选择 **Public**（公开）或 **Private**（私有）
4. **不要** 勾选 "Initialize with README"
5. 点击 "Create repository"

### 步骤 2：推送代码到 GitHub

在终端执行以下命令（替换 YOUR_USERNAME 为你的 GitHub 用户名）：

```bash
git remote add origin https://github.com/YOUR_USERNAME/web-mayfriday.git
git branch -M main
git push -u origin main
```

如果需要登录，输入你的 GitHub 用户名和密码（或 Personal Access Token）。

### 步骤 3：部署到 Vercel

1. 访问 https://vercel.com
2. 点击 "Sign Up" 或 "Log In"
3. 选择 "Continue with GitHub" 使用 GitHub 账号登录
4. 登录后，点击 "Add New..." → "Project"
5. 选择 "Import Git Repository"
6. 找到你的 `web-mayfriday` 仓库，点击 "Import"
7. 配置项目：
   - Framework Preset: **Vite**（会自动检测到）
   - Build Command: `npm run build`（自动填充）
   - Output Directory: `dist`（自动填充）
8. 点击 "Deploy"

### 步骤 4：等待部署完成

- Vercel 会自动：
  1. 克隆你的代码
  2. 安装依赖（npm install）
  3. 构建项目（npm run build）
  4. 部署到全球 CDN
  
- 通常需要 2-5 分钟

### 步骤 5：访问你的网站

部署完成后，你会得到一个类似这样的网址：
```
https://web-mayfriday-xxxx.vercel.app
```

你可以：
- 点击链接立即访问
- 在 Vercel 设置中绑定自定义域名

---

## 快速命令（已完成）

代码已经提交到 Git，现在只需要：
1. 在 GitHub 创建仓库
2. 推送代码
3. 在 Vercel 导入并部署

## 优势

✅ 完全免费
✅ 自动 HTTPS
✅ 全球 CDN 加速
✅ 自动部署（每次 git push 都会自动更新）
✅ 无需服务器维护

## 需要帮助？

如果遇到问题，随时问我！
