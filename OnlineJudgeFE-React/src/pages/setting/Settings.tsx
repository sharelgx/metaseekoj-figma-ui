import { useState, useEffect, useCallback, ChangeEvent } from 'react'
import { HeaderPerfect as Header } from '@/components/HeaderPerfect'
import { User, Lock, Settings as SettingsIcon, Upload, RotateCcw, RotateCw, X } from 'lucide-react'
import Cropper from 'react-easy-crop'
import 'react-easy-crop/react-easy-crop.css'
import { toast } from 'sonner'
import { userAPI } from '@/api/user'
import { getAvatarUrl, DEFAULT_AVATAR_URL, invalidateAvatarCache } from '@/utils/avatar'

interface UserProfile {
  username: string
  real_name: string
  email: string
  avatar: string
  school?: string
  mood?: string
  github?: string
  blog?: string
}

interface CroppedAreaPixels {
  width: number
  height: number
  x: number
  y: number
}

const createImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })
}

const getRadianAngle = (degreeValue: number) => (degreeValue * Math.PI) / 180

const rotateSize = (width: number, height: number, rotation: number) => {
  const rotRad = getRadianAngle(rotation)

  return {
    width: Math.abs(Math.cos(rotRad)) * width + Math.abs(Math.sin(rotRad)) * height,
    height: Math.abs(Math.sin(rotRad)) * width + Math.abs(Math.cos(rotRad)) * height
  }
}

const getExtensionFromMime = (mimeType: string) => {
  if (!mimeType) return '.png'
  const match = mimeType.split('/')
  if (match.length === 2) {
    if (match[1] === 'jpeg') return '.jpg'
    return `.${match[1]}`
  }
  return '.png'
}

const getCroppedAvatarBlob = async (imageSrc: string, pixelCrop: CroppedAreaPixels, rotation = 0, mimeType = 'image/png') => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('无法获取裁剪画布的上下文')
  }

  const rotRad = getRadianAngle(rotation)
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.naturalWidth, image.naturalHeight, rotation)

  canvas.width = bBoxWidth
  canvas.height = bBoxHeight

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(rotRad)
  ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2)

  const roundedCrop = {
    x: Math.round(pixelCrop.x),
    y: Math.round(pixelCrop.y),
    width: Math.round(pixelCrop.width),
    height: Math.round(pixelCrop.height)
  }

  const data = ctx.getImageData(roundedCrop.x, roundedCrop.y, roundedCrop.width, roundedCrop.height)

  const cropCanvas = document.createElement('canvas')
  cropCanvas.width = roundedCrop.width
  cropCanvas.height = roundedCrop.height

  const cropCtx = cropCanvas.getContext('2d')
  if (!cropCtx) {
    throw new Error('无法获取头像裁剪区域的上下文')
  }

  cropCtx.putImageData(data, 0, 0)

  return new Promise<Blob>((resolve, reject) => {
    cropCanvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('裁剪结果为空'))
        return
      }
      resolve(blob)
    }, mimeType)
  })
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    real_name: '',
    email: '',
    avatar: '',
    school: '',
    mood: '',
    github: '',
    blog: ''
  })
  const [oldPwd, setOldPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null)
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null)
  const [pendingAvatarInfo, setPendingAvatarInfo] = useState<{ type: string; name: string } | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const mapProfile = useCallback((data: any): UserProfile => ({
    username: data?.user?.username || data?.username || '',
    real_name: data?.real_name || data?.user?.real_name || '',
    email: data?.user?.email || data?.email || '',
    avatar: data?.avatar || data?.user?.avatar || '',
    school: data?.school || '',
    mood: data?.mood || '',
    github: data?.github || '',
    blog: data?.blog || ''
  }), [])

  const handleCropComplete = useCallback((_: unknown, pixels: CroppedAreaPixels) => {
    setCroppedAreaPixels(pixels)
  }, [])

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    try {
      const data = await userAPI.getUserInfo()
      if (data) {
        setProfile(mapProfile(data))
      } else {
        toast.warning('未获取到用户信息，请先登录')
      }
    } catch (error) {
      console.error('加载个人资料失败:', error)
      toast.error('加载个人资料失败')
    } finally {
      setLoading(false)
    }
  }, [mapProfile])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleSaveProfile = async () => {
    try {
      const payload = {
        real_name: profile.real_name || '',
        school: profile.school || '',
        mood: profile.mood || '',
        github: profile.github || '',
        blog: profile.blog || ''
      }
      const updated = await userAPI.updateProfile(payload)
      toast.success('个人资料保存成功！')
      if (updated) {
        setProfile(mapProfile(updated))
      }
    } catch (error: any) {
      console.error('保存个人资料失败:', error)
      const errorMsg = error?.response?.data?.data || error?.response?.data?.error || error?.message || '保存失败'
      toast.error(errorMsg)
    }
  }

  const handlePwdChange = async () => {
    if (!oldPwd || !newPwd) {
      toast.error('请输入完整的密码信息')
      return
    }
    if (newPwd !== confirmPwd) {
      toast.error('两次输入的密码不一致')
      return
    }
    try {
      await userAPI.changePwd({
        old_password: oldPwd,
        new_password: newPwd
      })
      toast.success('密码修改成功！')
      setOldPwd('')
      setNewPwd('')
      setConfirmPwd('')
    } catch (error: any) {
      console.error('修改密码失败:', error)
      const errorMsg = error?.response?.data?.data || error?.response?.data?.error || error?.message || '修改密码失败'
      toast.error(errorMsg)
    }
  }

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件')
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setCropImageSrc(reader.result as string)
      setIsCropModalOpen(true)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setRotation(0)
      setCroppedAreaPixels(null)
      setPendingAvatarInfo({
        type: file.type || 'image/png',
        name: file.name || `avatar-${Date.now()}`
      })
    }
    reader.onerror = () => {
      toast.error('读取图片失败，请重试')
    }
    reader.readAsDataURL(file)

    // 允许再次选择同一文件
    e.target.value = ''
  }

  const handleCropCancel = () => {
    setIsCropModalOpen(false)
    setCropImageSrc(null)
    setPendingAvatarInfo(null)
    setCroppedAreaPixels(null)
    setUploadingAvatar(false)
    setZoom(1)
    setRotation(0)
    setCrop({ x: 0, y: 0 })
  }

  const handleCropConfirm = async () => {
    if (!cropImageSrc || !croppedAreaPixels) {
      toast.error('请先选择裁剪区域')
      return
    }

    const mimeType = pendingAvatarInfo?.type || 'image/png'
    const extension = getExtensionFromMime(mimeType)
    const fileNameBase = pendingAvatarInfo?.name?.replace(/\.[^/.]+$/, '') || `avatar-${Date.now()}`

    setUploadingAvatar(true)
    try {
      const blob = await getCroppedAvatarBlob(cropImageSrc, croppedAreaPixels, rotation, mimeType)
      const formData = new FormData()
      formData.append('image', blob, `${fileNameBase}${extension}`)

      await userAPI.uploadAvatar(formData)
      toast.success('头像上传成功！')
      invalidateAvatarCache(profile.avatar)
      handleCropCancel()
      fetchProfile()
    } catch (error: any) {
      console.error('头像裁剪上传失败:', error)
      const errorMsg = error?.response?.data?.data || error?.response?.data?.error || error?.message || '头像上传失败'
      toast.error(errorMsg)
      setUploadingAvatar(false)
    }
  }

  const currentAvatar = getAvatarUrl(profile?.avatar, profile?.username)

  return (
    <>
      <Header />
      <div style={{
        minHeight: '100vh',
        background: '#f5f7fa',
        marginTop: window.innerWidth >= 1200 ? '80px' : '160px',
        padding: '20px 2%'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            {/* 标签页导航 */}
            <div style={{
              display: 'flex',
              borderBottom: '2px solid #e8eaec'
            }}>
              {[
                { key: 'profile', label: '个人资料', icon: User },
                { key: 'security', label: '安全设置', icon: Lock },
                { key: 'account', label: '账号设置', icon: SettingsIcon }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    flex: 1,
                    padding: '16px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: activeTab === tab.key ? '#409eff' : '#606266',
                    borderBottom: activeTab === tab.key ? '2px solid #409eff' : '2px solid transparent',
                    marginBottom: '-2px',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 内容区域 */}
            <div style={{ padding: '32px' }}>
              {/* 个人资料 */}
              {activeTab === 'profile' && (
                <div>
                  <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', color: '#303133' }}>个人资料</h3>
                  
                  {loading ? (
                    <p style={{ color: '#909399', fontSize: '14px' }}>正在加载个人资料...</p>
                  ) : (
                    <>
                    {/* 头像上传 */}
                    <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <img
                        src={currentAvatar}
                        alt="头像"
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid #e8eaec'
                        }}
                      />
                      <label style={{
                        padding: '8px 20px',
                        background: '#409eff',
                        color: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '14px'
                      }}>
                        <Upload size={16} />
                        上传头像
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>

                    {/* 表单字段 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#606266' }}>
                        真实姓名
                      </label>
                      <input
                        type="text"
                        value={profile.real_name}
                        onChange={(e) => setProfile({ ...profile, real_name: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #dcdfe6',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#606266' }}>
                        学校/组织
                      </label>
                      <input
                        type="text"
                        value={profile.school || ''}
                        onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #dcdfe6',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#606266' }}>
                        个性签名
                      </label>
                      <textarea
                        value={profile.mood || ''}
                        onChange={(e) => setProfile({ ...profile, mood: e.target.value })}
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #dcdfe6',
                          borderRadius: '4px',
                          fontSize: '14px',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#606266' }}>
                        GitHub
                      </label>
                      <input
                        type="text"
                        value={profile.github || ''}
                        onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                        placeholder="https://github.com/username"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #dcdfe6',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#606266' }}>
                        Blog
                      </label>
                      <input
                        type="text"
                        value={profile.blog || ''}
                        onChange={(e) => setProfile({ ...profile, blog: e.target.value })}
                        placeholder="https://blog.example.com"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #dcdfe6',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <button
                      onClick={handleSaveProfile}
                      style={{
                        padding: '12px 32px',
                        background: 'linear-gradient(90deg, #2d8cf0, #19be6b)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        alignSelf: 'flex-start'
                      }}
                    >保存</button>
                    </div>
                    </>
                  )}
                </div>
              )}

              {/* 安全设置 */}
              {activeTab === 'security' && (
                <div>
                  <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', color: '#303133' }}>修改密码</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#606266' }}>
                        当前密码
                      </label>
                      <input
                        type="password"
                        value={oldPwd}
                        onChange={(e) => setOldPwd(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #dcdfe6',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#606266' }}>
                        新密码
                      </label>
                      <input
                        type="password"
                        value={newPwd}
                        onChange={(e) => setNewPwd(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #dcdfe6',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#606266' }}>
                        确认新密码
                      </label>
                      <input
                        type="password"
                        value={confirmPwd}
                        onChange={(e) => setConfirmPwd(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #dcdfe6',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <button
                      onClick={handlePwdChange}
                      style={{
                        padding: '12px 32px',
                        background: 'linear-gradient(90deg, #2d8cf0, #19be6b)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        alignSelf: 'flex-start'
                      }}
                    >修改密码</button>
                  </div>
                </div>
              )}

              {/* 账号设置 */}
              {activeTab === 'account' && (
                <div>
                  <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', color: '#303133' }}>账号信息</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{
                      padding: '16px',
                      background: '#f8f8f9',
                      borderRadius: '8px'
                    }}>
                      <div style={{ fontSize: '14px', color: '#909399', marginBottom: '4px' }}>用户名</div>
                      <div style={{ fontSize: '16px', color: '#303133', fontWeight: 600 }}>{profile.username}</div>
                    </div>

                    <div style={{
                      padding: '16px',
                      background: '#f8f8f9',
                      borderRadius: '8px'
                    }}>
                      <div style={{ fontSize: '14px', color: '#909399', marginBottom: '4px' }}>邮箱</div>
                      <div style={{ fontSize: '16px', color: '#303133', fontWeight: 600 }}>{profile.email}</div>
                    </div>

                    <div style={{
                      padding: '16px',
                      background: '#fff7e6',
                      borderRadius: '8px',
                      borderLeft: '4px solid #faad14'
                    }}>
                      <p style={{ margin: 0, fontSize: '14px', color: '#606266' }}>
                        用户名和邮箱不可修改。如需修改，请联系管理员。
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isCropModalOpen && cropImageSrc && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 2000
          }}
        >
          <div
            style={{
              width: 'min(520px, 100%)',
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 20px 60px rgba(15, 23, 42, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#303133' }}>调整头像</h3>
              <button
                onClick={handleCropCancel}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#909399'
                }}
                aria-label="关闭裁剪"
              >
                <X size={18} />
              </button>
            </div>

            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '320px',
                background: '#0f172a',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
            >
              <Cropper
                image={cropImageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
                onRotationChange={setRotation}
              />
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <label style={{ fontSize: '14px', color: '#606266' }}>缩放</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setRotation((prev) => (prev - 90 + 360) % 360)}
                style={{
                  border: '1px solid #dcdfe6',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  background: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#303133'
                }}
              >
                <RotateCcw size={16} />
                向左旋转
              </button>
              <button
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                style={{
                  border: '1px solid #dcdfe6',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  background: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#303133'
                }}
              >
                <RotateCw size={16} />
                向右旋转
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={handleCropCancel}
                style={{
                  border: '1px solid #dcdfe6',
                  background: 'white',
                  color: '#606266',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                取消
              </button>
              <button
                onClick={handleCropConfirm}
                disabled={uploadingAvatar}
                style={{
                  border: 'none',
                  background: uploadingAvatar ? '#8cc5ff' : '#409eff',
                  color: 'white',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  cursor: uploadingAvatar ? 'not-allowed' : 'pointer'
                }}
              >
                {uploadingAvatar ? '上传中...' : '保存' }
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


