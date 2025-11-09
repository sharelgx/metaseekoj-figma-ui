import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  History, 
  Check, 
  RotateCcw, 
  Clock, 
  FileText,
  AlertCircle 
} from 'lucide-react';
import { 
  getDocumentVersions, 
  getDocumentVersion, 
  revertToVersion,
  type DocumentVersion 
} from '@/api/classroom';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface VersionHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: number;
  currentVersion: number;
  onVersionRestored?: () => void;
}

export function VersionHistoryDialog({
  open,
  onOpenChange,
  documentId,
  currentVersion,
  onVersionRestored
}: VersionHistoryDialogProps) {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (open && documentId) {
      loadVersions();
    }
  }, [open, documentId]);

  const loadVersions = async () => {
    try {
      setLoading(true);
      const data = await getDocumentVersions(documentId);
      setVersions(data.versions);
      console.log('📋 版本列表加载成功:', data);
    } catch (error) {
      console.error('❌ 加载版本列表失败:', error);
      toast.error('加载版本历史失败');
    } finally {
      setLoading(false);
    }
  };

  const handleViewVersion = async (versionNumber: number) => {
    try {
      setLoading(true);
      const versionData = await getDocumentVersion(documentId, versionNumber);
      setSelectedVersion(versionData);
      setPreviewMode(true);
      console.log('👀 查看版本:', versionData);
    } catch (error) {
      console.error('❌ 获取版本内容失败:', error);
      toast.error('获取版本内容失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRevertVersion = async (versionNumber: number) => {
    if (!confirm(`确定要恢复到 V${versionNumber} 吗？\n当前内容将被覆盖（会自动保存为新版本）`)) {
      return;
    }

    try {
      setLoading(true);
      const result = await revertToVersion(documentId, versionNumber);
      toast.success(result.message || `已成功恢复到 V${versionNumber}`);
      
      // 重新加载版本列表
      await loadVersions();
      setPreviewMode(false);
      setSelectedVersion(null);
      
      // 通知父组件刷新文档
      if (onVersionRestored) {
        onVersionRestored();
      }
    } catch (error: any) {
      console.error('❌ 恢复版本失败:', error);
      toast.error(error.response?.data?.error || '恢复版本失败');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'yyyy-MM-dd HH:mm:ss', { locale: zhCN });
    } catch {
      return dateStr;
    }
  };

  const formatContentLength = (length: number) => {
    if (length > 1000) {
      return `${(length / 1000).toFixed(1)}K`;
    }
    return `${length}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            版本历史
          </DialogTitle>
          <DialogDescription>
            当前版本: <span className="font-bold text-blue-600">V{currentVersion}</span> | 共 {versions.length} 个历史版本
          </DialogDescription>
        </DialogHeader>

        {!previewMode ? (
          // 版本列表视图
          <ScrollArea className="h-[500px] pr-4">
            {loading && versions.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3">加载中...</span>
              </div>
            ) : versions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <AlertCircle className="w-12 h-12 mb-2" />
                <p>暂无版本历史</p>
              </div>
            ) : (
              <div className="space-y-3">
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                      version.version_number === currentVersion
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            variant={version.version_number === currentVersion ? 'default' : 'outline'}
                            className="font-bold"
                          >
                            V{version.version_number}
                          </Badge>
                          {version.version_number === currentVersion && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              当前版本
                            </Badge>
                          )}
                        </div>

                        <h4 className="font-medium text-gray-900 mb-1">
                          {version.title}
                        </h4>

                        {version.change_description && (
                          <p className="text-sm text-gray-600 mb-2">
                            📝 {version.change_description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(version.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {formatContentLength(version.content_length || 0)} 字符
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewVersion(version.version_number)}
                          disabled={loading}
                        >
                          查看
                        </Button>
                        {version.version_number !== currentVersion && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleRevertVersion(version.version_number)}
                            disabled={loading}
                            className="flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            恢复
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        ) : (
          // 版本预览视图
          <div className="h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-bold">
                  V{selectedVersion?.version_number}
                </Badge>
                <span className="font-medium">{selectedVersion?.title}</span>
              </div>
              <div className="flex gap-2">
                {selectedVersion && selectedVersion.version_number !== currentVersion && (
                  <Button
                    size="sm"
                    onClick={() => handleRevertVersion(selectedVersion.version_number)}
                    disabled={loading}
                    className="flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    恢复到此版本
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setPreviewMode(false);
                    setSelectedVersion(null);
                  }}
                >
                  返回列表
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              {selectedVersion && (
                <div className="prose prose-sm max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ __html: selectedVersion.content_html }}
                    className="p-4"
                  />
                </div>
              )}
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

