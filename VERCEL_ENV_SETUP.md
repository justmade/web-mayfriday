# Vercel 环境变量配置指南

在 Vercel 部署时，需要配置以下环境变量才能使视频播放功能正常工作。

## 📋 需要配置的环境变量

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `OSS_ACCESS_KEY_ID` | `LTAI5t******************` | 阿里云RAM用户AccessKeyId（见.env.local） |
| `OSS_ACCESS_KEY_SECRET` | `**************************` | 阿里云RAM用户AccessKeySecret（见.env.local） |
| `OSS_BUCKET` | `web-mayfriday-videos` | OSS Bucket名称 |
| `OSS_REGION` | `oss-cn-beijing` | OSS地域 |

**重要提示：** 实际的AccessKey值请查看项目根目录的 `.env.local` 文件（该文件不会提交到Git）。

## 🔧 配置步骤

### 1. 进入Vercel项目设置

访问：https://vercel.com/项目名/settings/environment-variables

或者：
1. 登录 Vercel Dashboard
2. 选择您的项目 `web-mayfriday`
3. 点击顶部 **Settings** 标签
4. 左侧菜单选择 **Environment Variables**

### 2. 添加环境变量

对每个变量执行以下操作：

1. 点击 **Add New**
2. **Name:** 填入变量名（如 `OSS_ACCESS_KEY_ID`）
3. **Value:** 填入对应的值
4. **Environments:** 勾选所有环境（Production, Preview, Development）
5. 点击 **Save**

### 3. 重新部署

添加所有环境变量后：
1. 进入项目 **Deployments** 页面
2. 找到最新的部署
3. 点击右侧 **⋯** 菜单
4. 选择 **Redeploy**

或者直接推送新的commit到GitHub，自动触发部署。

## ✅ 验证配置

部署完成后，访问任意包含视频的文章页面（如 `/resources/3`），视频应该能够正常播放。

如果遇到问题，检查：
1. Vercel部署日志是否有错误
2. 浏览器控制台是否有API错误
3. 环境变量是否正确配置

## 🔒 安全提示

- ✅ 环境变量只在服务端使用，不会暴露到前端
- ✅ AccessKey已添加到 `.gitignore`，不会提交到Git
- ⚠️ 定期轮换 AccessKey 以提高安全性
