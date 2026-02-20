#!/bin/bash
# OSS 批量上传文件夹脚本
# 用法: ./upload-folder.sh <本地文件夹路径> <文章ID>
# 例如: ./upload-folder.sh ~/Videos/article-3/ 3

set -e

# 检查参数
if [ $# -lt 2 ]; then
    echo "❌ 用法: ./upload-folder.sh <本地文件夹路径> <文章ID>"
    echo ""
    echo "示例:"
    echo "  ./upload-folder.sh ~/Videos/article-3/ 3"
    echo ""
    echo "这会上传文件夹中的所有视频和图片到："
    echo "  oss://web-mayfriday-videos/resources/<文章ID>/"
    exit 1
fi

LOCAL_FOLDER=$1
ARTICLE_ID=$2

# 检查文件夹是否存在
if [ ! -d "$LOCAL_FOLDER" ]; then
    echo "❌ 错误: 文件夹不存在: $LOCAL_FOLDER"
    exit 1
fi

# 移除路径末尾的斜杠
LOCAL_FOLDER=${LOCAL_FOLDER%/}

echo "📤 准备批量上传文件夹..."
echo "  本地文件夹: $LOCAL_FOLDER"
echo "  目标位置: oss://web-mayfriday-videos/resources/$ARTICLE_ID/"
echo ""

# 列出要上传的文件
echo "📁 文件列表："
find "$LOCAL_FOLDER" -type f \( -iname "*.mp4" -o -iname "*.mov" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) -exec basename {} \; | while read -r filename; do
    echo "  - $filename"
done
echo ""

# 询问确认
read -p "确认上传这些文件？(y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 已取消上传"
    exit 1
fi

# 上传文件
OSS_PATH="oss://web-mayfriday-videos/resources/$ARTICLE_ID/"

echo ""
echo "🚀 开始上传..."
echo ""

./ossutil cp -r "$LOCAL_FOLDER/" "$OSS_PATH" \
    --config-file .ossutilconfig \
    --include "*.mp4" \
    --include "*.mov" \
    --include "*.jpg" \
    --include "*.jpeg" \
    --include "*.png"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 批量上传成功！"
    echo ""
    echo "📋 查看已上传的文件："
    ./ossutil ls "$OSS_PATH" --config-file .ossutilconfig
    echo ""
    echo "💡 现在可以在 src/data/resources.js 中添加视频块了"
else
    echo "❌ 上传失败"
    exit 1
fi
