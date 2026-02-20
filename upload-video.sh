#!/bin/bash
# OSS 视频上传脚本
# 用法: ./upload-video.sh <本地视频路径> <文章ID> <视频文件名>
# 例如: ./upload-video.sh ~/Videos/scarf-tutorial.mp4 3 step1-cast-on.mp4

set -e

# 检查参数
if [ $# -lt 3 ]; then
    echo "❌ 用法: ./upload-video.sh <本地视频路径> <文章ID> <视频文件名>"
    echo ""
    echo "示例:"
    echo "  ./upload-video.sh ~/Videos/tutorial.mp4 3 step1-cast-on.mp4"
    echo "  ./upload-video.sh ~/Videos/thumbnail.jpg 3 thumbnail-step1.jpg"
    echo ""
    exit 1
fi

LOCAL_FILE=$1
ARTICLE_ID=$2
REMOTE_NAME=$3

# 检查文件是否存在
if [ ! -f "$LOCAL_FILE" ]; then
    echo "❌ 错误: 文件不存在: $LOCAL_FILE"
    exit 1
fi

# 获取文件大小（MB）
FILE_SIZE=$(du -m "$LOCAL_FILE" | cut -f1)

echo "📤 准备上传视频..."
echo "  本地文件: $LOCAL_FILE"
echo "  文件大小: ${FILE_SIZE}MB"
echo "  目标位置: oss://web-mayfriday-videos/resources/$ARTICLE_ID/$REMOTE_NAME"
echo ""

# 上传到 OSS
OSS_PATH="oss://web-mayfriday-videos/resources/$ARTICLE_ID/$REMOTE_NAME"

./ossutil cp "$LOCAL_FILE" "$OSS_PATH" --config-file .ossutilconfig

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 上传成功！"
    echo ""
    echo "📋 视频访问信息："
    echo "  OSS 路径: resources/$ARTICLE_ID/$REMOTE_NAME"
    echo "  完整 URL: https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/resources/$ARTICLE_ID/$REMOTE_NAME"
    echo ""
    echo "💡 复制以下代码到 src/data/resources.js 中："
    echo ""

    # 判断是视频还是图片
    if [[ "$REMOTE_NAME" == *.mp4 ]] || [[ "$REMOTE_NAME" == *.mov ]]; then
        echo "{"
        echo "  type: \"video\","
        echo "  platform: \"oss\","
        echo "  src: \"https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/resources/$ARTICLE_ID/$REMOTE_NAME\","
        echo "  thumbnail: \"https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/resources/$ARTICLE_ID/thumbnail.jpg\","
        echo "  duration: \"0:00\",  // 请手动修改视频时长"
        echo "  title: \"视频标题\","
        echo "  titleEn: \"Video Title\""
        echo "}"
    else
        echo "图片 URL: https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/resources/$ARTICLE_ID/$REMOTE_NAME"
    fi
    echo ""
else
    echo "❌ 上传失败"
    exit 1
fi
