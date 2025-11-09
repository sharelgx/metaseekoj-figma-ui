const BACKEND_ORIGIN = (import.meta.env.VITE_BACKEND_ORIGIN || '').replace(/\/$/, '')
const DEFAULT_AVATAR_PATH = '/public/avatar/default.png'

type AvatarOptions = {
  bustCache?: boolean
  cacheKey?: string | number
}

const cacheBusterMap = new Map<string, string>()

const resolveBase = () => (BACKEND_ORIGIN ? BACKEND_ORIGIN : '')

const ensureLeadingSlash = (value: string) => (value.startsWith('/') ? value : `/${value}`)

const normalizeAvatarPath = (value: string) => {
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:image/')) {
    return value
  }

  if (value.startsWith('/api/public/')) {
    return value.replace('/api', '')
  }

  if (value.startsWith('/public/')) {
    return value
  }

  if (value.startsWith('public/')) {
    return `/${value}`
  }

  return `/public/avatar/${value}`
}

const appendCacheBuster = (url: string, options: AvatarOptions) => {
  if (options.bustCache === false) {
    return url
  }

  if (url.includes('default.png')) {
    return url
  }

  const separator = url.includes('?') ? '&' : '?'

  if (options.cacheKey !== undefined && options.cacheKey !== null) {
    return `${url}${separator}t=${options.cacheKey}`
  }

  let cacheTag = cacheBusterMap.get(url)
  if (!cacheTag) {
    cacheTag = `${Date.now()}`
    cacheBusterMap.set(url, cacheTag)
  }

  return `${url}${separator}t=${cacheTag}`
}

export const getAvatarUrl = (avatarPath?: string | null, _username?: string | null, options: AvatarOptions = {}): string => {
  if (!avatarPath || avatarPath === 'null' || avatarPath === 'undefined') {
    const normalizedDefault = `${resolveBase()}${DEFAULT_AVATAR_PATH}`
    return appendCacheBuster(normalizedDefault, { bustCache: false })
  }

  if (BACKEND_ORIGIN && avatarPath.startsWith(BACKEND_ORIGIN)) {
    return appendCacheBuster(avatarPath, options)
  }

  const normalizedPath = normalizeAvatarPath(avatarPath)

  if (normalizedPath.startsWith('http://') || normalizedPath.startsWith('https://') || normalizedPath.startsWith('data:image/')) {
    return appendCacheBuster(normalizedPath, options)
  }

  const url = `${resolveBase()}${ensureLeadingSlash(normalizedPath)}`
  return appendCacheBuster(url, options)
}

export const invalidateAvatarCache = (avatarPath?: string | null) => {
  if (!avatarPath) {
    return
  }

  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://') || avatarPath.startsWith('data:image/')) {
    return
  }

  const normalizedPath = normalizeAvatarPath(avatarPath)
  const url = `${resolveBase()}${ensureLeadingSlash(normalizedPath)}`
  cacheBusterMap.delete(url)
}

export const DEFAULT_AVATAR_URL = getAvatarUrl(DEFAULT_AVATAR_PATH, null, { bustCache: false })
