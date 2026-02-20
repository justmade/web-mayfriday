#!/bin/bash
# Vercel 环境变量自动配置脚本
# 使用前请先运行: vercel login

set -e

# 设置代理
export https_proxy=http://127.0.0.1:6152
export http_proxy=http://127.0.0.1:6152
export all_proxy=socks5://127.0.0.1:6153

echo "开始配置 Vercel 环境变量..."

# OSS_ACCESS_KEY_ID
echo "YOUR_ALIBABA_CLOUD_ACCESS_KEY_ID" | vercel env add OSS_ACCESS_KEY_ID production
echo "YOUR_ALIBABA_CLOUD_ACCESS_KEY_ID" | vercel env add OSS_ACCESS_KEY_ID preview
echo "YOUR_ALIBABA_CLOUD_ACCESS_KEY_ID" | vercel env add OSS_ACCESS_KEY_ID development

# OSS_ACCESS_KEY_SECRET
echo "YOUR_ALIBABA_CLOUD_ACCESS_KEY_SECRET" | vercel env add OSS_ACCESS_KEY_SECRET production
echo "YOUR_ALIBABA_CLOUD_ACCESS_KEY_SECRET" | vercel env add OSS_ACCESS_KEY_SECRET preview
echo "YOUR_ALIBABA_CLOUD_ACCESS_KEY_SECRET" | vercel env add OSS_ACCESS_KEY_SECRET development

# OSS_BUCKET
echo "web-mayfriday-videos" | vercel env add OSS_BUCKET production
echo "web-mayfriday-videos" | vercel env add OSS_BUCKET preview
echo "web-mayfriday-videos" | vercel env add OSS_BUCKET development

# OSS_REGION
echo "oss-cn-beijing" | vercel env add OSS_REGION production
echo "oss-cn-beijing" | vercel env add OSS_REGION preview
echo "oss-cn-beijing" | vercel env add OSS_REGION development

echo "✅ 环境变量配置完成！"
echo "现在可以运行: vercel --prod"
