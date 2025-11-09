/**
 * 代码编辑器组件 - 复刻8080的CodeMirror组件
 * 使用Monaco Editor (VS Code编辑器内核)
 */

import { useEffect, useRef, useMemo, useId } from 'react'
import Editor, { Monaco } from '@monaco-editor/react'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RefreshCw, UploadCloud } from 'lucide-react'
import './CodeEditor.css'

interface CodeEditorProps {
  value: string
  language: string
  theme: string
  languages: string[]
  onChange: (value: string) => void
  onChangeLang: (lang: string) => void
  onChangeTheme: (theme: string) => void
  onReset: () => void
}

// 语言映射 (iView显示名称 -> Monaco编辑器名称)
const LANGUAGE_MAP: Record<string, string> = {
  'C++': 'cpp',
  'C': 'c',
  'Java': 'java',
  'Python3': 'python',
  'Python2': 'python',
  'JavaScript': 'javascript',
  'Go': 'go',
  'Rust': 'rust'
}

// 主题列表（对齐8080）
const THEME_OPTIONS = [
  { value: 'monokai', label: '物界', monaco: 'vs-dark' },
  { value: 'solarized', label: '日光灯', monaco: 'vs' },
  { value: 'material', label: '材料', monaco: 'vs-dark' }
]

export function CodeEditor({
  value,
  language,
  theme,
  languages,
  onChange,
  onChangeLang,
  onChangeTheme,
  onReset
}: CodeEditorProps) {
  const editorRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()

  const activeTheme = useMemo(() => {
    return THEME_OPTIONS.find((item) => item.value === theme) ?? THEME_OPTIONS[1]
  }, [theme])

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor
    
    // 设置编辑器选项
    editor.updateOptions({
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 4,
      wordWrap: 'on',
      cursorBlinking: 'smooth'
    })
  }

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '')
  }

  // 获取Monaco编辑器的语言名称
  const getMonacoLanguage = (lang: string) => {
    return LANGUAGE_MAP[lang] || lang.toLowerCase()
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      editorRef.current?.setValue(text)
      onChange(text)
    } catch (error) {
      console.error('读取文件失败:', error)
    } finally {
      event.target.value = ''
    }
  }

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        language: getMonacoLanguage(language)
      })
    }
  }, [language])

  return (
    <div className="oj-code-editor">
      <div className="oj-editor-toolbar">
        <div className="oj-toolbar-left">
          <span className="oj-toolbar-label">语言:</span>
          <Select value={language} onValueChange={onChangeLang}>
            <SelectTrigger className="oj-select-trigger">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <input
            id={inputId}
            ref={fileInputRef}
            type="file"
            accept=".txt,.c,.cpp,.cc,.java,.py,.js,.go,.rs,.zip"
            className="oj-file-input"
            onChange={handleFileSelected}
          />

          <Button
            variant="outline"
            size="icon"
            className="oj-toolbar-button"
            type="button"
            title="重置为默认代码"
            onClick={onReset}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="oj-toolbar-button"
            type="button"
            title="上传代码文件"
            onClick={handleUploadClick}
          >
            <UploadCloud className="h-4 w-4" />
          </Button>
        </div>

        <div className="oj-toolbar-right">
          <span className="oj-toolbar-label">主题:</span>
          <Select value={activeTheme.value} onValueChange={onChangeTheme}>
            <SelectTrigger className="oj-select-trigger">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {THEME_OPTIONS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 编辑器 */}
      <div className="oj-editor-surface">
        <Editor
          height="400px"
          language={getMonacoLanguage(language)}
          theme={activeTheme.monaco}
          value={value}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on',
            lineNumbers: 'on',
            roundedSelection: false,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible'
            }
          }}
        />
      </div>

      <div className="oj-editor-footer">快捷键: Ctrl+S 保存 | Ctrl+F 查找 | Ctrl+H 替换</div>
    </div>
  )
}

