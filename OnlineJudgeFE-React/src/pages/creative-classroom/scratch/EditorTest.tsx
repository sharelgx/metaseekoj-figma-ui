/**
 * Scratch 编辑器测试页面
 * 用于验证 iframe 嵌入是否正常工作
 */

export default function ScratchEditorTest() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 bg-white border-b">
        <h1 className="text-2xl font-bold">Scratch 编辑器测试</h1>
        <p className="text-gray-600">
          如果下方能看到 Scratch 编辑器，说明嵌入成功
        </p>
      </div>
      
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
          <iframe
            src="http://localhost:8601"
            className="w-full h-full border-0"
            title="Scratch Editor"
            allow="camera; microphone"
          />
        </div>
      </div>

      <div className="p-4 bg-yellow-50 border-t border-yellow-200">
        <h2 className="font-semibold text-yellow-800 mb-2">📝 说明</h2>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>✅ 如果能看到完整的 Scratch 编辑器 → iframe 嵌入成功</li>
          <li>✅ 如果能拖拽积木块 → 编辑器功能正常</li>
          <li>✅ 如果能点击绿旗运行 → 编辑器完全正常</li>
          <li>⚠️ 如果看到空白或错误 → 检查 http://localhost:8601 是否可访问</li>
        </ul>
      </div>
    </div>
  )
}

