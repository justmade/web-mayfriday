/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Hls from 'hls.js'
import useAuthStore from '../../store/authStore'

function VideoPlayer({ video }) {
  const { i18n } = useTranslation()
  const token = useAuthStore((state) => state.token)
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoUrl, setVideoUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const videoRef = useRef(null)
  const hlsRef = useRef(null)
  const title = video.title && (i18n.language === 'zh' ? video.title : (video.titleEn || video.title))

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    // 检查是否是 HLS 视频（.m3u8）
    const isHLS = video.src && video.src.includes('.m3u8')

    // 检查是否是阿里云OSS URL（需要签名）
    const isOSSUrl = video.src && (
      video.src.includes('aliyuncs.com') ||
      video.platform === 'oss'
    )

    async function loadVideoUrl() {
      setVideoUrl(null)
      setError(null)

      if (!isOSSUrl) {
        setVideoUrl(video.src)
        return
      }

      let objectPath
      try {
        objectPath = new URL(video.src).pathname.replace(/^\//, '')
      } catch {
        setError(i18n.language === 'zh' ? '视频地址无效' : 'Invalid video URL')
        return
      }

      // Public resource tutorials remain directly readable from OSS.
      if (isHLS && objectPath.startsWith('resources/')) {
        setVideoUrl(video.src)
        return
      }

      setIsLoading(true)
      try {
        let response
        if (isHLS) {
          response = await fetch('/api/video-token', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token || ''}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ path: objectPath }),
            signal: controller.signal,
          })
        } else {
          response = await fetch(`/api/get-video-url?path=${encodeURIComponent(objectPath)}`, {
            headers: { 'Authorization': `Bearer ${token || ''}` },
            signal: controller.signal,
          })
        }

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || (i18n.language === 'zh' ? '没有视频访问权限' : 'Video access denied'))
        }

        if (active) {
          setVideoUrl(isHLS
            ? `/api/hls-playlist?path=${encodeURIComponent(objectPath)}&t=${encodeURIComponent(data.token)}`
            : data.url)
        }
      } catch (err) {
        if (err.name !== 'AbortError' && active) {
          console.error('获取受保护视频失败:', err)
          setError(err.message)
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadVideoUrl()

    // 清理函数
    return () => {
      active = false
      controller.abort()
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [i18n.language, token, video.platform, video.src])

  // 当 videoUrl 更新后，初始化播放器
  useEffect(() => {
    if (!videoUrl || !videoRef.current) return

    const isHLS = videoUrl.includes('.m3u8')

    if (isHLS && Hls.isSupported()) {
      // 使用 HLS.js 播放 HLS 视频
      const hls = new Hls()

      hls.loadSource(videoUrl)
      hls.attachMedia(videoRef.current)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS 播放列表加载成功')
      })

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS 错误:', data)
        if (data.fatal) {
          setError('HLS 播放失败')
        }
      })

      hlsRef.current = hls
    } else if (isHLS && videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // iOS Safari 原生支持 HLS
      videoRef.current.src = videoUrl
    }
    // 普通 MP4 通过 src 属性自动加载
  }, [videoUrl])

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
        ) : videoUrl ? (
          // 使用原生 video 标签（支持 HLS 和普通 MP4）
          <video
            ref={videoRef}
            src={video.src.includes('.m3u8') ? undefined : videoUrl}
            controls
            crossOrigin="anonymous"
            playsInline
            preload="metadata"
            controlsList="nodownload"
            className="w-full h-full"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={(e) => {
              console.error('视频加载错误:', e)
              setError('视频加载失败，请刷新页面重试')
            }}
          />
        ) : null}

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
