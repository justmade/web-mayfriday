import { useState, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { useTranslation } from 'react-i18next'
import { HiPlay } from 'react-icons/hi'

function VideoPlayer({ video }) {
  const { i18n } = useTranslation()
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoUrl, setVideoUrl] = useState(video.src)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const title = video.title && (i18n.language === 'zh' ? video.title : (video.titleEn || video.title))

  useEffect(() => {
    // 检查是否是阿里云OSS URL（需要签名）
    const isOSSUrl = video.src && (
      video.src.includes('aliyuncs.com') ||
      video.platform === 'oss'
    )

    if (isOSSUrl) {
      // 从API获取签名URL
      fetchSignedUrl(video.src)
    } else {
      // 直接使用原URL（YouTube, Bilibili等）
      setVideoUrl(video.src)
    }
  }, [video.src])

  const fetchSignedUrl = async (ossUrl) => {
    setIsLoading(true)
    setError(null)

    try {
      // 提取OSS路径（去除域名部分）
      const urlObj = new URL(ossUrl)
      const path = urlObj.pathname.substring(1) // 去掉开头的 /

      // 调用API获取签名URL
      const response = await fetch(`/api/get-video-url?path=${encodeURIComponent(path)}`)

      if (!response.ok) {
        throw new Error('Failed to get signed URL')
      }

      const data = await response.json()
      setVideoUrl(data.url)
    } catch (err) {
      console.error('获取视频签名URL失败:', err)
      setError(err.message)
      // 失败时回退到原始URL
      setVideoUrl(video.src)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="my-8">
      {/* Video Title */}
      {title && (
        <h3 className="text-xl font-bold mb-4 text-gray-900">{title}</h3>
      )}

      {/* Player Container */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
        {isLoading ? (
          // 加载状态
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>{i18n.language === 'zh' ? '加载中...' : 'Loading...'}</p>
            </div>
          </div>
        ) : error ? (
          // 错误状态
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-white text-center px-4">
              <p className="mb-2">{i18n.language === 'zh' ? '视频加载失败' : 'Video load failed'}</p>
              <p className="text-sm text-gray-400">{error}</p>
            </div>
          </div>
        ) : (
          // 视频播放器
          <ReactPlayer
            url={videoUrl}
            width="100%"
            height="100%"
            controls={true}
            playing={isPlaying}
            light={video.thumbnail || true}
            playIcon={
              <button className="w-20 h-20 bg-primary rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all shadow-lg">
                <HiPlay className="text-white text-4xl ml-1" />
              </button>
            }
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload',
                  playsInline: true,
                  preload: 'metadata'
                }
              }
            }}
          />
        )}

        {/* Duration Badge */}
        {video.duration && !isPlaying && !isLoading && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm font-medium pointer-events-none">
            {video.duration}
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoPlayer
