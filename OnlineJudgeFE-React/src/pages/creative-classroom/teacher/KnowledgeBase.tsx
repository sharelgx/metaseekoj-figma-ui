/**
 * 知识库管理页面
 * - 上传PDF/Word/PPT等文档
 * - 查看文档列表
 * - 测试检索功能
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Upload,
  Search,
  FileText,
  Database,
  CheckCircle,
  AlertCircle,
  Loader,
  Eye,
  X,
  Filter,
  Tags,
  FolderTree,
  Layers,
  ChevronRight,
  ChevronDown,
  ChevronsUpDown,
  Check,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import axios from 'axios';

interface KnowledgeDocument {
  id: number;
  title: string;
  document_type: string;
  document_type_display: string;
  subject: string;
  tags: string[];
  file_size: number;
  total_chunks: number;
  processing_status: string;
  view_count: number;
  reference_count: number;
  is_public: boolean;
  uploaded_by: string;
  created_at: string;
}

interface SearchResult {
  document_id: number;
  document_title: string;
  chunk_index: number;
  text: string;
  similarity: number;
  page_number?: number;
  document_type: string;
}

interface TagOption {
  id: number;
  name: string;
  tag_type: string;
  color: string;
  description: string;
  question_count: number;
  category?: {
    id: number;
    name: string;
  } | null;
}

interface KnowledgePointNode {
  id: number;
  name: string;
  code: string;
  question_count: number;
  level_id: number;
  level_name: string;
  level_number: number;
  syllabus_id: number | null;
  syllabus_name: string | null;
  parent_id?: number | null;
  order?: number | null;
  full_path?: string;
  children?: KnowledgePointNode[];
}

interface ProblemResult {
  id: number;
  _id?: string;
  title: string;
  difficulty: string;
  tags: string[];
  description: string;
  similarity: number;
}

interface ChoiceQuestionResult {
  id: number;
  _id?: string;
  title: string;
  difficulty: string;
  question_type: string;
  description: string;
  similarity: number;
  tags: string[];
  knowledge_points?: string[];
  knowledge_point_ids?: number[];
  match_reason?: string;
}

type SelectedKnowledgePoint = {
  id: number;
  name: string;
  full_path: string;
  question_count: number;
};

export default function KnowledgeBasePage() {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('cpp');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [problemResults, setProblemResults] = useState<ProblemResult[]>([]);
  const [choiceResults, setChoiceResults] = useState<ChoiceQuestionResult[]>([]);
  const [useHybrid, setUseHybrid] = useState(true);
  const [searching, setSearching] = useState(false);
  const [tagOptions, setTagOptions] = useState<TagOption[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([]);
  const [knowledgePoints, setKnowledgePoints] = useState<KnowledgePointNode[]>([]);
  const [selectedKnowledgePoints, setSelectedKnowledgePoints] = useState<SelectedKnowledgePoint[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Record<number, boolean>>({});
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterError, setFilterError] = useState<string | null>(null);
  
  const [previewDoc, setPreviewDoc] = useState<KnowledgeDocument | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDetail, setPreviewDetail] = useState<any>(null);
  
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const selectedTagNames = useMemo(() => selectedTags.map((tag) => tag.name), [selectedTags]);
  const selectedKnowledgePointIdSet = useMemo(
    () => new Set(selectedKnowledgePoints.map((kp) => kp.id)),
    [selectedKnowledgePoints]
  );
  const hasAnyResult = useHybrid
    ? problemResults.length > 0 || choiceResults.length > 0 || searchResults.length > 0
    : searchResults.length > 0;

  // 加载文档列表
  const loadDocuments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/classroom/knowledge/list/');
      setDocuments(response.data.documents || []);
    } catch (error: any) {
      console.error('加载文档列表失败:', error);
      toast.error('加载文档列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载筛选项
  useEffect(() => {
    const fetchFilters = async () => {
      setFilterLoading(true);
      setFilterError(null);
      try {
        const [tagResponse, kpResponse] = await Promise.all([
          axios.get('/api/classroom/knowledge/tags/?tag_type=knowledge&include_empty=false'),
          axios.get('/api/classroom/knowledge/points/?include_empty=false')
        ]);
        const tagData: TagOption[] = tagResponse.data?.tags || [];
        const kpData: KnowledgePointNode[] = kpResponse.data?.knowledge_points || [];
        setTagOptions(tagData);
        setKnowledgePoints(kpData);
        if (kpData.length > 0) {
          setExpandedNodes((prev) => {
            const next: Record<number, boolean> = { ...prev };
            kpData.forEach((node) => {
              next[node.id] = true;
            });
            return next;
          });
        }
      } catch (error: any) {
        console.error('加载筛选条件失败:', error);
        setFilterError(error.response?.data?.error || '加载筛选条件失败');
        toast.error(error.response?.data?.error || '加载筛选条件失败');
      } finally {
        setFilterLoading(false);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    loadDocuments();
    
    // 清理定时器
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, []);
  
  // 监听处理中的文档，启动轮询
  useEffect(() => {
    const processingDocs = documents.filter(doc => doc.processing_status === 'processing');
    
    if (processingDocs.length > 0) {
      // 启动轮询
      if (!pollingInterval.current) {
        pollingInterval.current = setInterval(() => {
          loadDocuments();
        }, 3000); // 每3秒刷新一次
      }
    } else {
      // 停止轮询
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = null;
      }
    }
  }, [documents]);

  // 上传文档
  const handleUpload = async () => {
    if (!uploadFile) {
      toast.error('请选择文件');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('title', uploadTitle || uploadFile.name);
    formData.append('subject', uploadSubject);
    formData.append('is_public', 'false');

    try {
      const response = await axios.post('/api/classroom/knowledge/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
        }
      });

      setUploadProgress(100);
      toast.success('文档上传成功！正在处理中...');
      setUploadFile(null);
      setUploadTitle('');
      setUploadProgress(0);
      
      // 重新加载列表
      setTimeout(() => {
        loadDocuments();
      }, 1000);
    } catch (error: any) {
      console.error('上传失败:', error);
      toast.error(error.response?.data?.error || '上传失败');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };
  
  // 预览文档
  const handlePreview = async (doc: KnowledgeDocument) => {
    setPreviewDoc(doc);
    setPreviewOpen(true);
    
    try {
      const response = await axios.get(`/api/classroom/knowledge/${doc.id}/`);
      setPreviewDetail(response.data);
    } catch (error: any) {
      console.error('获取文档详情失败:', error);
      toast.error('获取文档详情失败');
    }
  };

  const toggleTagSelection = (tag: TagOption) => {
    setSelectedTags((prev) => {
      const exists = prev.some((item) => item.id === tag.id);
      if (exists) {
        return prev.filter((item) => item.id !== tag.id);
      }
      return [...prev, tag];
    });
  };

  const removeTagSelection = (tagId: number) => {
    setSelectedTags((prev) => prev.filter((tag) => tag.id !== tagId));
  };

  const toggleKnowledgePointSelection = (node: KnowledgePointNode) => {
    setSelectedKnowledgePoints((prev) => {
      const exists = prev.some((item) => item.id === node.id);
      if (exists) {
        return prev.filter((item) => item.id !== node.id);
      }
      const fullPath = node.full_path || node.name;
      return [
        ...prev,
        {
          id: node.id,
          name: node.name,
          full_path: fullPath,
          question_count: node.question_count
        }
      ];
    });
  };

  const removeKnowledgePointSelection = (id: number) => {
    setSelectedKnowledgePoints((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleKnowledgePointExpand = (id: number) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedKnowledgePoints([]);
  };

  // 搜索知识库
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('请输入搜索内容');
      return;
    }

    setSearching(true);
    try {
      const payload: Record<string, any> = {
        query: searchQuery,
        top_k: useHybrid ? 8 : 5,
        hybrid: useHybrid
      };

      if (selectedTagNames.length > 0) {
        payload.tags = selectedTagNames;
      }
      if (selectedKnowledgePoints.length > 0) {
        payload.knowledge_point_ids = selectedKnowledgePoints.map((kp) => kp.id);
      }

      const response = await axios.post('/api/classroom/knowledge/search/', payload);

      const documents: SearchResult[] = response.data?.documents || [];
      setSearchResults(documents);

      if (useHybrid) {
        const problems: ProblemResult[] = response.data?.problems || [];
        const choices: ChoiceQuestionResult[] = response.data?.choice_questions || [];
        setProblemResults(problems);
        setChoiceResults(choices);
        const total = problems.length + choices.length + documents.length;
        toast.success(`检索完成：共命中 ${total} 条内容`);
      } else {
        setProblemResults([]);
        setChoiceResults([]);
        toast.success(`找到 ${documents.length} 个相关结果`);
      }
    } catch (error: any) {
      console.error('搜索失败:', error);
      toast.error(error.response?.data?.error || '搜索失败');
    } finally {
      setSearching(false);
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Database className="w-8 h-8 text-blue-600" />
          知识库管理（RAG Demo）
        </h1>
        <p className="text-slate-600">
          上传PDF、Word、PPT等文档，AI将自动提取内容并向量化，用于增强课件生成效果
        </p>
      </div>

      {/* 上传区域 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            上传文档
          </CardTitle>
          <CardDescription>
            支持PDF、Word、PPT、Markdown、TXT等格式
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">选择文件</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.md,.txt"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="mt-1"
              />
              {uploadFile && (
                <p className="text-sm text-slate-600 mt-1">
                  已选择：{uploadFile.name} ({formatFileSize(uploadFile.size)})
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="title">文档标题（可选）</Label>
              <Input
                id="title"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="留空则使用文件名"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="subject">学科分类</Label>
              <select
                id="subject"
                value={uploadSubject}
                onChange={(e) => setUploadSubject(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md"
              >
                <option value="cpp">C++编程</option>
                <option value="python">Python编程</option>
                <option value="algorithm">算法</option>
                <option value="data_structure">数据结构</option>
                <option value="other">其他</option>
              </select>
            </div>

            <Button
              onClick={handleUpload}
              disabled={!uploadFile || uploading}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  上传并处理中...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  上传文档
                </>
              )}
            </Button>
            
            {uploading && uploadProgress > 0 && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>上传进度</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            智能筛选
          </CardTitle>
          <CardDescription>
            结合标签与知识点，精准控制检索结果范围
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filterLoading ? (
            <div className="flex items-center justify-center py-16 text-slate-500">
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              正在加载筛选条件...
            </div>
          ) : (
            <div className="space-y-6">
              {filterError && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                  {filterError}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  disabled={selectedTags.length === 0 && selectedKnowledgePoints.length === 0}
                  className="flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  清空筛选
                </Button>
                <span className="flex items-center gap-2 text-sm text-slate-500">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  当前已选：标签 {selectedTags.length} 个 · 知识点 {selectedKnowledgePoints.length} 个
                </span>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Tags className="w-5 h-5 text-blue-600" />
                    <h3 className="text-base font-semibold text-slate-800">知识标签</h3>
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-between"
                      >
                        {selectedTags.length > 0
                          ? `已选择 ${selectedTags.length} 个标签`
                          : '选择标签'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-0" side="bottom" align="start">
                      <Command>
                        <CommandInput placeholder="搜索标签..." />
                        <CommandList>
                          <CommandEmpty>未找到标签</CommandEmpty>
                          <CommandGroup heading="知识点标签">
                            {tagOptions.map((tag) => {
                              const isSelected = selectedTags.some((item) => item.id === tag.id);
                              return (
                                <CommandItem
                                  key={tag.id}
                                  value={tag.name}
                                  onSelect={() => toggleTagSelection(tag)}
                                  className="flex items-center gap-2"
                                >
                                  <Check
                                    className={cn(
                                      'h-4 w-4',
                                      isSelected ? 'opacity-100 text-blue-600' : 'opacity-0'
                                    )}
                                  />
                                  <span className="text-sm">{tag.name}</span>
                                  <Badge variant="outline" className="ml-auto text-xs">
                                    {tag.question_count} 题
                                  </Badge>
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                        <CommandSeparator />
                        <div className="px-3 py-2 text-xs text-slate-400">
                          点击条目可切换选择，支持多选
                        </div>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="flex items-center gap-1 border-2"
                          style={{
                            borderColor: tag.color,
                            color: tag.color
                          }}
                        >
                          <span>{tag.name}</span>
                          <button
                            type="button"
                            onClick={() => removeTagSelection(tag.id)}
                            className="ml-1 rounded-full p-0.5 transition-colors hover:bg-slate-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FolderTree className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-base font-semibold text-slate-800">知识点树</h3>
                  </div>

                  <ScrollArea className="h-[320px] overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="p-2">
                      <KnowledgePointTree
                        nodes={knowledgePoints}
                        expanded={expandedNodes}
                        onToggleExpand={toggleKnowledgePointExpand}
                        selectedIds={selectedKnowledgePointIdSet}
                        onToggleSelect={toggleKnowledgePointSelection}
                      />
                    </div>
                  </ScrollArea>

                  {selectedKnowledgePoints.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedKnowledgePoints.map((kp) => (
                        <Badge
                          key={kp.id}
                          variant="secondary"
                          className="flex items-center gap-1 bg-emerald-50 text-emerald-700"
                        >
                          <Layers className="w-3 h-3" />
                          <span className="max-w-[220px] truncate" title={kp.full_path}>
                            {kp.full_path}
                          </span>
                          <span className="text-[11px] text-emerald-600">
                            {kp.question_count} 题
                          </span>
                          <button
                            type="button"
                            onClick={() => removeKnowledgePointSelection(kp.id)}
                            className="ml-1 rounded-full p-0.5 transition-colors hover:bg-emerald-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* 搜索区域 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            测试检索
          </CardTitle>
          <CardDescription>
            输入关键词，测试知识库检索效果（将用于AI课件生成）
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex w-full gap-2 md:max-w-3xl">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="例如：链表 递归 排序"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={searching} className="whitespace-nowrap">
                  {searching ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-1" />
                      开始检索
                    </>
                  )}
                </Button>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2">
                <Switch checked={useHybrid} onCheckedChange={(checked) => setUseHybrid(Boolean(checked))} />
                <div className="leading-tight">
                  <p className="text-sm font-medium text-slate-700">
                    {useHybrid ? '混合检索（题目 + 文档）' : '仅文档检索'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {useHybrid
                      ? '返回编程题、选择题以及知识库片段'
                      : '仅返回知识库文档片段'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {useHybrid && (
              <>
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <h3 className="text-sm font-semibold text-slate-700">编程题命中</h3>
                    </div>
                    <Badge variant="secondary">{problemResults.length}</Badge>
                  </div>
                  {problemResults.length === 0 ? (
                    <p className="text-sm text-slate-500">暂无匹配的编程题</p>
                  ) : (
                    <div className="space-y-3">
                      {problemResults.map((problem) => (
                        <Card key={problem.id} className="border-l-4 border-l-purple-400">
                          <CardContent className="space-y-2 pt-4">
                            <div className="flex items-center justify-between gap-3">
                              <h4 className="text-base font-semibold text-slate-800">
                                {problem.title}
                              </h4>
                              <Badge variant="outline" className="text-xs">
                                {(problem.similarity * 100).toFixed(1)}%
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-3">
                              {problem.description}
                            </p>
                            {problem.tags?.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {problem.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="bg-purple-50 text-purple-700"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderTree className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-sm font-semibold text-slate-700">选择题命中</h3>
                    </div>
                    <Badge variant="secondary">{choiceResults.length}</Badge>
                  </div>
                  {choiceResults.length === 0 ? (
                    <p className="text-sm text-slate-500">暂无匹配的选择题</p>
                  ) : (
                    <div className="space-y-3">
                      {choiceResults.map((question) => (
                        <Card key={question.id} className="border-l-4 border-l-emerald-400">
                          <CardContent className="space-y-2 pt-4">
                            <div className="flex items-center justify-between gap-3">
                              <h4 className="text-base font-semibold text-slate-800">
                                {question.title}
                              </h4>
                              <Badge variant="outline" className="text-xs">
                                {(question.similarity * 100).toFixed(1)}%
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                              <span>题型：{question.question_type}</span>
                              <span>难度：{question.difficulty}</span>
                              {question.match_reason && (
                                <span className="text-emerald-600">来源：{question.match_reason}</span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-3">
                              {question.description}
                            </p>
                            {question.tags?.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {question.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="bg-emerald-50 text-emerald-700"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {question.knowledge_points?.length ? (
                              <div className="flex flex-wrap gap-2">
                                {question.knowledge_points.map((kp) => (
                                  <Badge key={kp} variant="outline" className="text-xs">
                                    {kp}
                                  </Badge>
                                ))}
                              </div>
                            ) : null}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            <div>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-semibold text-slate-700">知识库片段</h3>
                </div>
                <Badge variant="secondary">{searchResults.length}</Badge>
              </div>
              {searchResults.length === 0 ? (
                <p className="text-sm text-slate-500">
                  {hasAnyResult ? '暂无匹配的文档片段' : '执行检索后将在此显示结果'}
                </p>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((result, index) => (
                    <Card key={`${result.document_id}-${index}`} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <h4 className="flex-1 font-semibold text-slate-800">
                            {result.document_title}
                          </h4>
                          <Badge variant="secondary">
                            相似度 {(result.similarity * 100).toFixed(1)}%
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-3">{result.text}</p>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                          <Badge variant="outline">块 #{result.chunk_index}</Badge>
                          {result.page_number && (
                            <Badge variant="outline">第 {result.page_number} 页</Badge>
                          )}
                          <Badge variant="outline">{result.document_type}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* 文档列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            文档列表
          </CardTitle>
          <CardDescription>
            共 {documents.length} 篇文档
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader className="w-8 h-8 animate-spin mx-auto text-blue-600" />
              <p className="text-slate-600 mt-2">加载中...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="text-slate-600">暂无文档，请上传</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-800">
                            {doc.title}
                          </h4>
                          {doc.processing_status === 'completed' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreview(doc)}
                              className="h-6 px-2 text-blue-600 hover:text-blue-700"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              预览
                            </Button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="secondary">{doc.document_type_display}</Badge>
                          {doc.subject && <Badge variant="outline">{doc.subject}</Badge>}
                          {doc.tags.map((tag, i) => (
                            <Badge key={i} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                        <div className="text-xs text-slate-600 space-y-1">
                          <p>大小：{formatFileSize(doc.file_size)} | 分块数：{doc.total_chunks}</p>
                          <p>上传者：{doc.uploaded_by} | 上传时间：{doc.created_at}</p>
                          <p>查看次数：{doc.view_count} | 引用次数：{doc.reference_count}</p>
                        </div>
                        
                        {/* 处理中时显示进度提示 */}
                        {doc.processing_status === 'processing' && (
                          <div className="mt-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Loader className="w-3 h-3 animate-spin text-blue-600" />
                              <span className="text-xs text-blue-600 font-medium">
                                正在处理中...（提取文本 → 分块 → 向量化）
                              </span>
                            </div>
                            <Progress value={60} className="h-1" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex flex-col items-center gap-2">
                        {doc.processing_status === 'completed' ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : doc.processing_status === 'processing' ? (
                          <Loader className="w-6 h-6 text-blue-600 animate-spin" />
                        ) : doc.processing_status === 'failed' ? (
                          <AlertCircle className="w-6 h-6 text-red-600" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-yellow-600" />
                        )}
                        <span className="text-xs text-slate-500">
                          {doc.processing_status === 'completed' ? '已完成' :
                           doc.processing_status === 'processing' ? '处理中' :
                           doc.processing_status === 'failed' ? '失败' : '待处理'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 使用提示 */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 使用说明</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>1. 上传PDF、Word等教学资料到知识库</li>
            <li>2. 系统会自动提取文本、分块、向量化（约1-2分钟）</li>
            <li>3. 在"AI课件生成"时，系统会自动检索知识库，找到相关资料</li>
            <li>4. AI会根据检索到的资料生成更专业、更准确的课件</li>
            <li>5. 测试检索功能可以验证知识库是否正常工作</li>
            <li>6. 点击"预览"按钮可查看文档详细信息和提取的文本内容</li>
          </ul>
        </CardContent>
      </Card>
      
      {/* 文档预览Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {previewDoc?.title}
            </DialogTitle>
            <DialogDescription>
              文档详细信息和内容预览
            </DialogDescription>
          </DialogHeader>
          
          {previewDetail ? (
            <div className="space-y-4">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">文档类型：</span>
                  <Badge variant="secondary" className="ml-2">
                    {previewDetail.document_type_display}
                  </Badge>
                </div>
                <div>
                  <span className="text-slate-600">学科分类：</span>
                  <Badge variant="outline" className="ml-2">
                    {previewDetail.subject || '未分类'}
                  </Badge>
                </div>
                <div>
                  <span className="text-slate-600">文件大小：</span>
                  <span className="ml-2">{formatFileSize(previewDetail.file_size)}</span>
                </div>
                <div>
                  <span className="text-slate-600">总块数：</span>
                  <span className="ml-2">{previewDetail.total_chunks}</span>
                </div>
                <div>
                  <span className="text-slate-600">查看次数：</span>
                  <span className="ml-2">{previewDetail.view_count}</span>
                </div>
                <div>
                  <span className="text-slate-600">引用次数：</span>
                  <span className="ml-2">{previewDetail.reference_count}</span>
                </div>
              </div>
              
              <Separator />
              
              {/* 标签和知识点 */}
              {(previewDetail.tags?.length > 0 || previewDetail.knowledge_points?.length > 0) && (
                <>
                  <div>
                    {previewDetail.tags?.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm text-slate-600 mr-2">标签：</span>
                        {previewDetail.tags.map((tag: string, i: number) => (
                          <Badge key={i} variant="outline" className="mr-1">{tag}</Badge>
                        ))}
                      </div>
                    )}
                    {previewDetail.knowledge_points?.length > 0 && (
                      <div>
                        <span className="text-sm text-slate-600 mr-2">知识点：</span>
                        {previewDetail.knowledge_points.map((point: string, i: number) => (
                          <Badge key={i} variant="default" className="mr-1 bg-blue-600">{point}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Separator />
                </>
              )}
              
              {/* 提取的文本内容 */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">提取的文本内容（前1000字符）</h4>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono">
                    {previewDetail.extracted_text}
                  </pre>
                </div>
              </div>
              
              {/* 元信息 */}
              {(previewDetail.author || previewDetail.source) && (
                <>
                  <Separator />
                  <div className="text-sm space-y-1">
                    {previewDetail.author && (
                      <p><span className="text-slate-600">作者：</span>{previewDetail.author}</p>
                    )}
                    {previewDetail.source && (
                      <p><span className="text-slate-600">来源：</span>{previewDetail.source}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Loader className="w-8 h-8 animate-spin mx-auto text-blue-600" />
              <p className="text-slate-600 mt-2">加载中...</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

type KnowledgePointTreeProps = {
  nodes: KnowledgePointNode[];
  expanded: Record<number, boolean>;
  onToggleExpand: (id: number) => void;
  selectedIds: Set<number>;
  onToggleSelect: (node: KnowledgePointNode) => void;
};

function KnowledgePointTree({
  nodes,
  expanded,
  onToggleExpand,
  selectedIds,
  onToggleSelect
}: KnowledgePointTreeProps) {
  if (!nodes || nodes.length === 0) {
    return <p className="text-sm text-slate-500">暂无知识点数据</p>;
  }

  return (
    <div className="space-y-1">
      {nodes.map((node) => (
        <KnowledgePointTreeNode
          key={node.id}
          node={node}
          level={0}
          expanded={expanded}
          onToggleExpand={onToggleExpand}
          selectedIds={selectedIds}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  );
}

type KnowledgePointTreeNodeProps = {
  node: KnowledgePointNode;
  level: number;
  expanded: Record<number, boolean>;
  onToggleExpand: (id: number) => void;
  selectedIds: Set<number>;
  onToggleSelect: (node: KnowledgePointNode) => void;
};

function KnowledgePointTreeNode({
  node,
  level,
  expanded,
  onToggleExpand,
  selectedIds,
  onToggleSelect
}: KnowledgePointTreeNodeProps) {
  const hasChildren = !!(node.children && node.children.length > 0);
  const isExpanded = !!expanded[node.id];
  const isSelected = selectedIds.has(node.id);
  const paddingLeft = level * 16;

  return (
    <div>
      <div
        className={cn(
          'flex items-start gap-2 rounded-lg px-2 py-1 transition-colors',
          isSelected ? 'bg-blue-50 ring-1 ring-blue-100' : 'hover:bg-slate-50'
        )}
        style={{ marginLeft: paddingLeft }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggleExpand(node.id)}
            className="mt-1 text-slate-500 transition-colors hover:text-slate-700"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        ) : (
          <Layers className="w-4 h-4 mt-1 text-slate-300" />
        )}

        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(node)}
          className="mt-[2px]"
        />

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">{node.name}</span>
            <Badge variant="outline" className="ml-auto text-xs">
              {node.question_count} 题
            </Badge>
          </div>
          <p className="text-xs text-slate-500 leading-snug">
            {node.full_path || node.name}
          </p>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="space-y-1">
          {node.children?.map((child) => (
            <KnowledgePointTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expanded={expanded}
              onToggleExpand={onToggleExpand}
              selectedIds={selectedIds}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

