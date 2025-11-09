/**
 * B站视频处理工具
 */

export interface BilibiliVideoInfo {
  bvid: string
  aid: string
  cid: string
  part: string
  title?: string
  embedUrl: string
  iframeCode: string
}

/**
 * 从B站URL中提取视频信息
 * 支持的格式：
 * - https://www.bilibili.com/video/BV1TpyQBvEFu
 * - https://b23.tv/xxxxx
 * - BV1TpyQBvEFu
 */
export function parseBilibiliUrl(url: string): BilibiliVideoInfo | null {
  // 清理URL
  url = url.trim()
  
  // 提取BV号
  let bvid = ''
  
  // 从完整URL提取
  const bvMatch = url.match(/BV[a-zA-Z0-9]+/)
  if (bvMatch) {
    bvid = bvMatch[0]
  }
  
  // 如果直接是BV号
  if (url.startsWith('BV') && url.length <= 20) {
    bvid = url
  }
  
  if (!bvid) {
    return null
  }
  
  // 提取分P信息（如果有）
  const partMatch = url.match(/[?&]p=(\d+)/)
  const part = partMatch ? partMatch[1] : '1'
  
  // 注意：aid和cid通常需要通过B站API获取
  // 这里返回基本信息，实际嵌入时可能需要用户提供或通过API获取
  const embedUrl = `//player.bilibili.com/player.html?bvid=${bvid}&p=${part}&high_quality=1&danmaku=0`
  
  return {
    bvid,
    aid: '', // 需要API获取
    cid: '', // 需要API获取
    part,
    embedUrl,
    iframeCode: generateBilibiliIframe(embedUrl)
  }
}

/**
 * 从完整的iframe代码中提取视频信息
 */
export function parseIframeCode(iframeCode: string): BilibiliVideoInfo | null {
  // 提取src属性
  const srcMatch = iframeCode.match(/src=["']([^"']+)["']/)
  if (!srcMatch) {
    return null
  }
  
  const src = srcMatch[1]
  
  // 提取参数
  const bvidMatch = src.match(/bvid=([^&"']+)/)
  const aidMatch = src.match(/aid=([^&"']+)/)
  const cidMatch = src.match(/cid=([^&"']+)/)
  const partMatch = src.match(/[?&]p=(\d+)/)
  
  if (!bvidMatch && !aidMatch) {
    return null
  }
  
  const bvid = bvidMatch ? bvidMatch[1] : ''
  const aid = aidMatch ? aidMatch[1] : ''
  const cid = cidMatch ? cidMatch[1] : ''
  const part = partMatch ? partMatch[1] : '1'
  
  return {
    bvid,
    aid,
    cid,
    part,
    embedUrl: src,
    iframeCode
  }
}

/**
 * 生成B站视频iframe代码
 */
export function generateBilibiliIframe(
  embedUrl: string,
  options: {
    width?: string | number
    height?: string | number
    allowFullscreen?: boolean
  } = {}
): string {
  const {
    width = '100%',
    height = '500',
    allowFullscreen = true
  } = options
  
  const widthStr = typeof width === 'number' ? `${width}px` : width
  const heightStr = typeof height === 'number' ? `${height}px` : height
  
  return `<iframe 
  src="${embedUrl}" 
  width="${widthStr}" 
  height="${heightStr}" 
  scrolling="no" 
  border="0" 
  frameborder="no" 
  framespacing="0" 
  ${allowFullscreen ? 'allowfullscreen="true"' : ''}
></iframe>`
}

/**
 * 生成课件中的视频Markdown标记
 */
export function generateVideoMarkdown(videoInfo: BilibiliVideoInfo, title?: string): string {
  const videoTitle = title || videoInfo.title || `B站视频 ${videoInfo.bvid}`
  
  return `
## 📺 视频讲解：${videoTitle}

:::video
bvid: ${videoInfo.bvid}
${videoInfo.aid ? `aid: ${videoInfo.aid}` : ''}
${videoInfo.cid ? `cid: ${videoInfo.cid}` : ''}
part: ${videoInfo.part}
embedUrl: ${videoInfo.embedUrl}
:::

> 💡 **视频说明**：点击播放观看详细讲解
`
}

/**
 * 将Markdown中的视频标记转换为iframe
 */
export function convertVideoMarkdownToIframe(markdown: string): string {
  // 匹配 :::video ... ::: 块
  const videoBlockRegex = /:::video\n([\s\S]*?)\n:::/g
  
  return markdown.replace(videoBlockRegex, (match, content) => {
    // 解析视频信息
    const bvidMatch = content.match(/bvid:\s*([^\n]+)/)
    const aidMatch = content.match(/aid:\s*([^\n]+)/)
    const cidMatch = content.match(/cid:\s*([^\n]+)/)
    const partMatch = content.match(/part:\s*([^\n]+)/)
    const embedUrlMatch = content.match(/embedUrl:\s*([^\n]+)/)
    
    if (!embedUrlMatch) {
      return match // 保持原样
    }
    
    const embedUrl = embedUrlMatch[1].trim()
    
    return `<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin: 20px 0;">
  <iframe 
    src="${embedUrl}" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    scrolling="no" 
    border="0" 
    frameborder="no" 
    framespacing="0" 
    allowfullscreen="true"
  ></iframe>
</div>`
  })
}

/**
 * 验证B站视频URL是否有效
 */
export function isValidBilibiliUrl(url: string): boolean {
  const info = parseBilibiliUrl(url)
  return info !== null
}

