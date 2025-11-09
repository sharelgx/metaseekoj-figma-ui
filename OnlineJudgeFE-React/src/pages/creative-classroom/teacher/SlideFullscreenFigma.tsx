import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PresentationLayout } from '@/components/classroom/presentation/PresentationLayout';
import { HeroSlide } from '@/components/classroom/presentation/slides/HeroSlide';
import { SectionSlide } from '@/components/classroom/presentation/slides/SectionSlide';
import { ContentSlide } from '@/components/classroom/presentation/slides/ContentSlide';
import { CodeSlide } from '@/components/classroom/presentation/slides/CodeSlide';
import { QuizSlide } from '@/components/classroom/presentation/slides/QuizSlide';
import { ImageSlide } from '@/components/classroom/presentation/slides/ImageSlide';
import { FlashcardSlide } from '@/components/classroom/presentation/slides/FlashcardSlide';
import { getDocument } from '@/api/classroom';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import '@/styles/formula-display.css';
import '@/styles/code-display.css';

interface SlideData {
  type: 'hero' | 'section' | 'content' | 'code' | 'quiz' | 'image' | 'flashcard';
  title: string;
  props: any;
}

/**
 * 课件演示幻灯片 - Figma设计规范版
 * 按照 slide-design-requirements.md 规范实现
 */
export default function SlideFullscreenFigma() {
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get('document_id');
  
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (documentId) {
      loadDocument();
    }
  }, [documentId]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      const doc = await getDocument(parseInt(documentId!));
      
      // 解析文档内容，转换为幻灯片数据
      const slidesData = parseDocumentToSlides(doc);
      setSlides(slidesData);
      
      console.log(`✅ 成功生成 ${slidesData.length} 张幻灯片`);
    } catch (error: any) {
      console.error('❌ 加载文档失败:', error);
      toast.error('加载文档失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * ===========================================================================
   * 主解析函数：将文档内容解析为幻灯片数据
   * 按照设计规范，生成标准的幻灯片类型
   * ===========================================================================
   */
  const parseDocumentToSlides = (doc: any): SlideData[] => {
    const result: SlideData[] = [];
    
    // 1. 获取原始内容
    let content = doc.content_markdown || doc.content_html || '';
    const isHTML = !doc.content_markdown && doc.content_html;
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📄 开始解析文档');
    console.log(`📄 文档ID: ${doc.id}`);
    console.log(`📄 原始内容长度: ${content.length}字符`);
    console.log(`📄 内容格式: ${isHTML ? 'HTML' : 'Markdown'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // 2. 如果是HTML，提取纯文本
    if (isHTML) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      content = tempDiv.textContent || tempDiv.innerText || '';
      console.log(`✅ HTML转文本完成: ${content.length}字符`);
    }
    
    // 3. 移除包裹YAML的代码块标记（如果有）
    content = content.replace(/^```yaml\n(---\n[\s\S]*?\n---)\n```/m, '$1');
    
    // 4. 提取YAML元数据
    const metadata = extractMetadata(content);
    content = removeYAMLFrontmatter(content);
    
    // 4. 提取课程标题（避免使用prompt）
    const slideTitle = extractCourseTitle(content, doc.title, metadata);
    console.log(`📌 课程标题: "${slideTitle}"`);
    
    // 5. 提取课程标签
    const tags = extractTags(metadata);
    console.log(`🏷️ 课程标签: [${tags.join(', ')}]`);
    
    // 6. 生成封面页 (Hero Slide)
    result.push(createHeroSlide(slideTitle, metadata, tags));
    console.log('✅ 生成封面页');
    
    // 7. 按## 分割章节
    const sections = content.split(/^##\s+/m).filter((s: string) => s.trim());
    console.log(`📑 找到 ${sections.length} 个章节`);
    
    // 8. 处理每个章节
    let chapterNumber = 0;
    for (const section of sections) {
      if (!section.trim()) continue;
      
      const firstLineEnd = section.indexOf('\n');
      const sectionTitle = section.substring(0, firstLineEnd > 0 ? firstLineEnd : section.length).trim();
      const sectionBody = section.substring(firstLineEnd + 1).trim();
      
      // 过滤掉无效的章节标题（包含代码块标记、YAML标记等）
      if (!sectionTitle || 
          sectionTitle.includes('```') || 
          sectionTitle.includes('---') ||
          sectionTitle.length < 2 ||
          sectionTitle === 'yaml' ||
          sectionTitle === 'python' ||
          sectionTitle === 'cpp') {
        console.log(`  ⚠️ 跳过无效章节标题: "${sectionTitle}"`);
        continue;
      }
      
      // 提取章节编号
      const chapterMatch = sectionTitle.match(/^第(\d+)[章节]/);
      if (chapterMatch) {
        chapterNumber = parseInt(chapterMatch[1]);
      } else {
        chapterNumber++;
      }
      
      console.log('');
      console.log(`━━━━ 章节 ${chapterNumber}: ${sectionTitle} ━━━━`);
      
      // 生成章节分隔页 (Section Slide)
      result.push(createSectionSlide(sectionTitle, chapterNumber));
      console.log(`  ✅ 生成章节分隔页`);
      
      // 解析章节内容，按### 小节分割
      const subsectionSlides = parseSectionContent(sectionBody, sectionTitle);
      result.push(...subsectionSlides);
      console.log(`  ✅ 生成 ${subsectionSlides.length} 张内容页`);
    }
    
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ 解析完成！共生成 ${result.length} 张幻灯片`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return result;
  };

  /**
   * ===========================================================================
   * 解析章节内容，按### 小节分割
   * 根据设计规范，每个小节生成独立的幻灯片
   * ===========================================================================
   */
  const parseSectionContent = (content: string, sectionTitle: string): SlideData[] => {
    const result: SlideData[] = [];
    
    // 按### 分割小节
    const parts = content.split(/^###\s+/m);
    
    if (parts.length > 1) {
      console.log(`  📑 找到 ${parts.length - 1} 个小节 (###)`);
      
      // 第一部分（### 之前的内容）
      if (parts[0].trim().length > 50) {
        const contentSlides = parseContentBlock(parts[0].trim(), sectionTitle);
        result.push(...contentSlides);
      }
      
      // 处理每个### 小节
      for (let i = 1; i < parts.length; i++) {
        const subsection = parts[i];
        const firstLineEnd = subsection.indexOf('\n');
        const subsectionTitle = subsection.substring(0, firstLineEnd > 0 ? firstLineEnd : subsection.length).trim();
        const subsectionBody = subsection.substring(firstLineEnd + 1).trim();
        
        console.log(`    📝 小节: "${subsectionTitle}"`);
        
        if (subsectionBody.length > 20) {
          const contentSlides = parseContentBlock(subsectionBody, subsectionTitle);
          result.push(...contentSlides);
        }
      }
    } else {
      // 没有### 小节，直接解析整个内容
      const contentSlides = parseContentBlock(content, sectionTitle);
      result.push(...contentSlides);
    }
    
    return result;
  };

  /**
   * ===========================================================================
   * 解析内容块，识别并提取：
   * - 代码块 → CodeSlide
   * - 选择题 → QuizSlide
   * - 图片 → ImageSlide
   * - 普通文本 → ContentSlide (自动分页)
   * ===========================================================================
   */
  const parseContentBlock = (content: string, title: string): SlideData[] => {
    const result: SlideData[] = [];
    let remainingContent = content;
    
    // 1. 提取所有闪卡（优先处理，因为章节可能就是闪卡章节）
    const flashcards = extractFlashcards(remainingContent);
    if (flashcards.length > 0) {
      console.log(`      🃏 找到 ${flashcards.length} 个闪卡`);
      flashcards.forEach((card) => {
        result.push(createFlashcardSlide(card.question, card.answer, card.title || title));
        // 移除已处理的闪卡
        remainingContent = remainingContent.replace(card.raw, '');
      });
    }
    
    // 2. 提取所有代码块
    const codeBlocks = extractCodeBlocks(remainingContent);
    if (codeBlocks.length > 0) {
      console.log(`      💻 找到 ${codeBlocks.length} 个代码块`);
      codeBlocks.forEach((block) => {
        result.push(createCodeSlide(block.title || title, block.code, block.language));
        // 移除已处理的代码块
        remainingContent = remainingContent.replace(block.raw, '');
      });
    }
    
    // 3. 提取所有选择题
    const questions = extractQuestions(remainingContent);
    if (questions.length > 0) {
      console.log(`      ❓ 找到 ${questions.length} 个选择题`);
      questions.forEach((question) => {
        result.push(createQuizSlide(question));
        // 移除已处理的题目
        remainingContent = remainingContent.replace(question.raw, '');
      });
    }
    
    // 4. 提取所有图片
    const images = extractImages(remainingContent);
    if (images.length > 0) {
      console.log(`      🖼️ 找到 ${images.length} 张图片`);
      images.forEach((image) => {
        result.push(createImageSlide(image.title || title, image.url, image.caption));
        // 移除已处理的图片
        remainingContent = remainingContent.replace(image.raw, '');
      });
    }
    
    // 5. 处理剩余的文本内容
    remainingContent = cleanContent(remainingContent);
    
    if (remainingContent.length > 50) {
      // 按照设计规范，长内容自动分页（每页最多1500字符）
      const contentSlides = createContentSlides(remainingContent, title);
      result.push(...contentSlides);
      console.log(`      📄 生成 ${contentSlides.length} 张内容页 (${remainingContent.length}字符)`);
    }
    
    return result;
  };

  /**
   * ===========================================================================
   * 辅助函数：内容提取和清理
   * ===========================================================================
   */
  
  /** 提取YAML元数据 */
  const extractMetadata = (content: string): any => {
    const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
    const metadata: any = {};
    
    if (yamlMatch) {
      const yamlStr = yamlMatch[1];
      yamlStr.split('\n').forEach((line: string) => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          metadata[key.trim()] = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
        }
      });
      console.log('📋 YAML元数据:', metadata);
    }
    
    return metadata;
  };
  
  /** 移除YAML frontmatter */
  const removeYAMLFrontmatter = (content: string): string => {
    // 移除YAML frontmatter和其后可能出现的代码块标记
    let cleaned = content.replace(/^---\n[\s\S]*?\n---\n*/m, '').trim();
    // 移除可能残留的代码块标记（```yaml 等）
    cleaned = cleaned.replace(/^```\w*\n/m, '').replace(/\n```$/m, '');
    return cleaned.trim();
  };
  
  /** 提取课程标题 */
  const extractCourseTitle = (content: string, docTitle: string, metadata: any): string => {
    // 优先级：YAML > H1 > H2（去前缀） > doc.title（过滤prompt）
    let title = metadata.title || '';
    
    if (!title) {
      const h1Match = content.match(/^#\s+(.+)$/m);
      if (h1Match) {
        title = h1Match[1].trim();
      }
    }
    
    if (!title) {
      const h2Match = content.match(/^##\s+(?:第\d+[章节][:：]?\s*)?(.+)$/m);
      if (h2Match) {
        title = h2Match[1].trim();
      }
    }
    
    if (!title) {
      // 过滤掉看起来像prompt的标题
      if (!/^(生成|帮我|制作|创建|写|请)/.test(docTitle) && docTitle.length < 50) {
        title = docTitle;
      } else {
        title = '智能课件';
        console.warn(`⚠️ doc.title看起来是prompt，已忽略: "${docTitle}"`);
      }
    }
    
    return title;
  };
  
  /** 提取课程标签 */
  const extractTags = (metadata: any): string[] => {
    const tags: string[] = [];
    
    // 难度等级
    const difficultyMap: { [key: string]: string } = {
      'beginner': '入门',
      'intermediate': '进阶',
      'advanced': '高级'
    };
    if (metadata.difficulty_level) {
      tags.push(difficultyMap[metadata.difficulty_level] || metadata.difficulty_level);
    }
    
    // 课程类型
    const typeMap: { [key: string]: string } = {
      'cpp': 'C++',
      'python': 'Python',
      'java': 'Java',
      'javascript': 'JavaScript'
    };
    if (metadata.course_type) {
      tags.push(typeMap[metadata.course_type.toLowerCase()] || metadata.course_type);
    }
    
    // 作者
    if (metadata.author) {
      tags.push(metadata.author);
    }
    
    return tags;
  };
  
  /** 提取闪卡 */
  const extractFlashcards = (content: string): Array<{ raw: string; question: string; answer: string; title: string }> => {
    const flashcards: Array<{ raw: string; question: string; answer: string; title: string }> = [];
    
    // 格式1：<!-- flashcard --> **Q**: xxx **A**: yyy <!-- /flashcard -->
    const regex1 = /<!--\s*flashcard\s*-->([\s\S]*?)<!--\s*\/flashcard\s*-->/g;
    let match1;
    
    while ((match1 = regex1.exec(content)) !== null) {
      const cardContent = match1[1];
      const qMatch = cardContent.match(/\*\*Q\*\*[：:]\s*(.+?)(?=\n|$)/s);
      const aMatch = cardContent.match(/\*\*A\*\*[：:]\s*(.+?)(?=\n|$)/s);
      
      if (qMatch && aMatch) {
        flashcards.push({
          raw: match1[0],
          question: qMatch[1].trim(),
          answer: aMatch[1].trim(),
          title: '知识闪卡'
        });
      }
    }
    
    // 格式2（旧格式兼容）：**问题**：xxx **答案**：yyy
    const regex2 = /\*\*问题\*\*[：:]\s*(.+?)\s*\*\*答案\*\*[：:]\s*(.+?)(?=\n\n|###|$)/gs;
    let match2;
    
    while ((match2 = regex2.exec(content)) !== null) {
      const beforeCard = content.substring(0, match2.index);
      const titleMatch = beforeCard.match(/###\s+闪卡\d*[：:]?\s*(.+?)$/m);
      const title = titleMatch ? titleMatch[1].trim() : '知识闪卡';
      
      flashcards.push({
        raw: match2[0],
        question: match2[1].trim(),
        answer: match2[2].trim(),
        title: title
      });
    }
    
    return flashcards;
  };
  
  /** 语言标识符映射（统一Markdown和SyntaxHighlighter的语言标识） */
  const normalizeLanguage = (lang: string): string => {
    const langMap: Record<string, string> = {
      'cpp': 'cpp',
      'c++': 'cpp',
      'py': 'python',
      'js': 'javascript',
      'ts': 'typescript',
      'md': 'markdown',
      'sh': 'bash',
      'shell': 'bash',
      'yml': 'yaml'
    };
    const normalized = lang.toLowerCase();
    return langMap[normalized] || normalized;
  };
  
  /** 提取代码块 */
  const extractCodeBlocks = (content: string): Array<{ raw: string; language: string; code: string; title: string }> => {
    const blocks: Array<{ raw: string; language: string; code: string; title: string }> = [];
    const regex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      // 查找代码块前的标题（支持有#和无#的格式）
      const beforeCode = content.substring(0, match.index);
      // 先尝试匹配带#的标题
      let titleMatch = beforeCode.match(/###?\s+(.+?)$/m);
      // 如果没有#，尝试匹配纯文本标题（第X章、X.Y等格式）
      if (!titleMatch) {
        titleMatch = beforeCode.match(/^([\d一二三四五六七八九十]+[\.、]?[\s\S]{0,30}?)$/m);
      }
      // 如果还是没有，尝试匹配更宽泛的标题格式
      if (!titleMatch) {
        const lines = beforeCode.split('\n').reverse();
        for (const line of lines.slice(0, 5)) {
          const trimmed = line.trim();
          // 匹配类似"1.1 算术运算符"这样的格式
          if (trimmed && /^[\d一二三四五六七八九十]+[\.、]\s*[\u4e00-\u9fa5a-zA-Z]/.test(trimmed)) {
            titleMatch = [null, trimmed];
            break;
          }
        }
      }
      const title = titleMatch ? titleMatch[1].trim() : '代码示例';
      const rawLang = match[1] || 'text';
      
      blocks.push({
        raw: match[0],
        language: normalizeLanguage(rawLang),
        code: match[2].trim(),
        title: title
      });
    }
    
    return blocks;
  };
  
  /** 提取选择题 */
  const extractQuestions = (content: string): Array<{ raw: string; question: string; options: string[]; answer: number; explanation?: string }> => {
    const questions: Array<{ raw: string; question: string; options: string[]; answer: number; explanation?: string }> = [];
    
    // 匹配选择题标记
    const regex = /<!--\s*question:choice\s*-->([\s\S]*?)<!--\s*\/question:choice\s*-->/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      const questionText = match[1];
      
      // 提取题目（支持多种格式）
      let questionMatch = questionText.match(/\*\*(?:\d+\.\s*)?(.+?)\*\*/);
      if (!questionMatch) {
        questionMatch = questionText.match(/题目[:：]\s*(.+?)(?=\n|$)/);
      }
      if (!questionMatch) continue;
      
      // 提取选项
      const optionsMatch = questionText.match(/[A-D][.、:：]\s*(.+?)(?=\n[A-D][.、:：]|\n\n|\*\*答案|$)/gs);
      if (!optionsMatch) continue;
      
      const options = optionsMatch.map((opt: string) => opt.replace(/^[A-D][.、:：]\s*/, '').trim());
      
      // 提取答案
      const answerMatch = questionText.match(/\*\*答案\*\*[：:]\s*([A-D])/);
      const answer = answerMatch ? answerMatch[1].charCodeAt(0) - 65 : 0;
      
      // 提取解析
      const explanationMatch = questionText.match(/\*\*解析\*\*[：:]\s*([\s\S]+?)$/);
      const explanation = explanationMatch ? explanationMatch[1].trim() : undefined;
      
      questions.push({
        raw: match[0],
        question: questionMatch[1].trim(),
        options: options,
        answer: answer,
        explanation: explanation
      });
    }
    
    return questions;
  };
  
  /** 提取图片 */
  const extractImages = (content: string): Array<{ raw: string; url: string; title: string; caption: string }> => {
    const images: Array<{ raw: string; url: string; title: string; caption: string }> = [];
    const regex = /!\[(.*?)\]\((.*?)\)/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      images.push({
        raw: match[0],
        title: match[1] || '',
        url: match[2],
        caption: match[1] || ''
      });
    }
    
    return images;
  };
  
  /** 清理内容 */
  const cleanContent = (content: string): string => {
    return content
      .replace(/<!-- .*? -->/gs, '') // 移除HTML注释
      .replace(/^---\n[\s\S]*?\n---\n*/gm, '') // 移除可能残留的YAML
      .replace(/^```\w*\n?$/gm, '') // 移除单独的代码块标记行
      .replace(/^#+\s+.*$/gm, '')    // 移除标题（已作为幻灯片标题）
      .replace(/\n{3,}/g, '\n\n')    // 合并多余空行
      .trim();
  };

  /**
   * ===========================================================================
   * 幻灯片创建函数
   * ===========================================================================
   */
  
  /** 创建封面页 (Hero Slide) */
  const createHeroSlide = (title: string, metadata: any, tags: string[]): SlideData => {
    return {
      type: 'hero',
      title: title,
      props: {
        title: title,
        subtitle: metadata.subtitle || metadata.description || '',
        author: metadata.author || '',
        date: new Date().toLocaleDateString('zh-CN'),
        tags: tags,
        background: 'gradient'
      }
    };
  };
  
  /** 创建章节分隔页 (Section Slide) */
  const createSectionSlide = (title: string, number: number): SlideData => {
    // 移除"第X章:"前缀
    const cleanTitle = title.replace(/^第\d+[章节][:：]?\s*/, '');
    
    return {
      type: 'section',
      title: cleanTitle,
      props: {
        title: cleanTitle,
        subtitle: '',
        number: number,
        color: ['blue', 'purple', 'green', 'orange'][number % 4] as any
      }
    };
  };
  
  /** 创建闪卡幻灯片 (Flashcard Slide) */
  const createFlashcardSlide = (question: string, answer: string, title: string): SlideData => {
    return {
      type: 'flashcard',
      title: title,
      props: {
        question: question,
        answer: answer,
        title: title,
        category: '知识复习'
      }
    };
  };
  
  /** 创建代码幻灯片 (Code Slide) */
  const createCodeSlide = (title: string, code: string, language: string): SlideData => {
    return {
      type: 'code',
      title: title,
      props: {
        title: title,
        code: code,
        language: language,
        theme: 'vs-dark' as const
      }
    };
  };
  
  /** 创建测验幻灯片 (Quiz Slide) */
  const createQuizSlide = (question: { question: string; options: string[]; answer: number; explanation?: string }): SlideData => {
    return {
      type: 'quiz',
      title: '课堂练习',
      props: {
        question: question.question,
        options: question.options,
        correctAnswer: question.answer,
        explanation: question.explanation || ''
      }
    };
  };
  
  /** 创建图片幻灯片 (Image Slide) */
  const createImageSlide = (title: string, url: string, caption: string): SlideData => {
    return {
      type: 'image',
      title: title,
      props: {
        title: title,
        image: url,
        caption: caption,
        layout: 'contained' as const
      }
    };
  };
  
  /** 创建内容幻灯片 (Content Slide) - 自动分页 */
  const createContentSlides = (content: string, title: string): SlideData[] => {
    const MAX_CHARS_PER_SLIDE = 1500; // 根据设计规范，每页最多1500字符
    const slides: SlideData[] = [];
    
    // 按段落分割
    const paragraphs = content.split(/\n\n+/);
    let currentPage: string[] = [];
    let currentLength = 0;
    let pageNum = 1;
    
    for (const para of paragraphs) {
      if (currentLength + para.length > MAX_CHARS_PER_SLIDE && currentPage.length > 0) {
        // 创建当前页
        slides.push(createSingleContentSlide(currentPage.join('\n\n'), title, pageNum));
        
        // 重置
        currentPage = [para];
        currentLength = para.length;
        pageNum++;
      } else {
        currentPage.push(para);
        currentLength += para.length;
      }
    }
    
    // 创建最后一页
    if (currentPage.length > 0) {
      slides.push(createSingleContentSlide(currentPage.join('\n\n'), title, pageNum));
    }
    
    return slides;
  };
  
  /** 创建单个内容幻灯片 */
  const createSingleContentSlide = (content: string, title: string, pageNum: number): SlideData => {
    const finalTitle = pageNum > 1 ? `${title} (${pageNum})` : title;
    
    // 检测内容长度，少于150字符视为"简短内容"，需要放大显示
    const isShortContent = content.length < 150;
    const contentLines = content.split('\n').filter((line: string) => line.trim()).length;
    const isSingleFormula = content.includes('$$') && contentLines <= 3;
    
    // 根据内容长度调整样式
    const proseSize = isShortContent || isSingleFormula ? 'prose-2xl' : 'prose-lg';
    
    return {
      type: 'content',
      title: finalTitle,
      props: {
        title: finalTitle,
        theme: 'light' as const,
        layout: 'single' as const,
        children: (
          <div className={`prose ${proseSize} max-w-none ${isShortContent || isSingleFormula ? 'flex flex-col items-center justify-center min-h-[400px] w-full' : ''}`}>
            <div className={isShortContent || isSingleFormula ? 'w-full text-center' : ''}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                code(props: any) {
                  const { children, className, node, ...rest } = props;
                  const match = /language-(\w+)/.exec(className || '');
                  const rawLang = match ? match[1] : '';
                  const language = rawLang ? normalizeLanguage(rawLang) : 'text';
                  const isInline = !className;
                  
                  return isInline ? (
                    <code className="bg-slate-100 text-pink-600 px-2 py-1 rounded text-[1.6rem] font-mono font-semibold" {...rest}>
                      {children}
                    </code>
                  ) : (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={language}
                      PreTag="div"
                      className="rounded-xl !mt-6 !mb-6"
                      codeTagProps={{
                        style: {
                          fontSize: '36px',
                          fontWeight: '500',
                          lineHeight: '2.2'
                        }
                      }}
                      customStyle={{
                        fontSize: '36px',
                        lineHeight: '2.2',
                        padding: '40px',
                        borderRadius: '16px',
                        fontWeight: '500'
                      }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  );
                },
                p: ({ children }) => {
                  // 增大字体以适应教学展示
                  const fontSize = isShortContent || isSingleFormula ? 'text-[2.2rem] md:text-[2.5rem] lg:text-[2.8rem]' : 'text-[1.8rem] md:text-[2rem]';
                  return (
                    <p className={`${fontSize} leading-relaxed mb-6 text-slate-800 ${isShortContent || isSingleFormula ? 'text-center' : ''}`}>
                      {children}
                    </p>
                  );
                },
                h1: ({ children }) => (
                  <h1 className="text-[4rem] md:text-[4.5rem] font-extrabold mb-10 bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] bg-clip-text text-transparent">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-[3rem] md:text-[3.5rem] font-bold mb-8 text-slate-700 border-l-4 border-[#3DBAFB] pl-6 mt-10 bg-blue-50/50 py-3">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-[2.4rem] md:text-[2.8rem] font-bold mb-6 text-slate-800 mt-8">{children}</h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-[2rem] md:text-[2.2rem] font-semibold mb-5 text-slate-600 mt-6">{children}</h4>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-4 my-8 pl-8">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="space-y-4 my-8 pl-8 list-decimal">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-[1.8rem] md:text-[2rem] leading-relaxed text-slate-800 marker:text-[#3DBAFB] marker:font-bold">
                    {children}
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-[#3DBAFB]">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-slate-600">{children}</em>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[#3DBAFB] bg-gradient-to-r from-[#3DBAFB]/10 to-[#8ED1A9]/10 pl-6 pr-6 py-4 my-6 rounded-r-xl">
                    <div className="text-[1.3rem] text-slate-700">{children}</div>
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-8">
                    <table className="min-w-full border border-slate-200 rounded-xl overflow-hidden">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-gradient-to-r from-[#3DBAFB] to-[#8ED1A9] text-white">
                    {children}
                  </thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="bg-white divide-y divide-slate-200">{children}</tbody>
                ),
                th: ({ children }) => (
                  <th className="px-6 py-4 text-left text-[1.2rem] font-bold">{children}</th>
                ),
                td: ({ children }) => (
                  <td className="px-6 py-4 text-[1.2rem] text-slate-700">{children}</td>
                ),
                a: ({ children, href }) => (
                  <a 
                    href={href} 
                    className="text-[#3DBAFB] hover:text-[#2196F3] font-medium hover:underline transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
            </div>
          </div>
        )
      }
    };
  };

  /**
   * ===========================================================================
   * 渲染幻灯片
   * ===========================================================================
   */
  const renderSlide = (slide: SlideData, index: number) => {
    switch (slide.type) {
      case 'hero':
        return <HeroSlide key={index} {...slide.props} />;
      case 'section':
        return <SectionSlide key={index} {...slide.props} />;
      case 'content':
        return <ContentSlide key={index} {...slide.props} />;
      case 'code':
        return <CodeSlide key={index} {...slide.props} />;
      case 'quiz':
        return <QuizSlide key={index} {...slide.props} />;
      case 'image':
        return <ImageSlide key={index} {...slide.props} />;
      case 'flashcard':
        return <FlashcardSlide key={index} {...slide.props} />;
      default:
        return <div key={index}></div>;
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-[#667EEA] to-[#764BA2]">
        <div className="text-white text-2xl">加载中...</div>
      </div>
    );
  }

  // 生成幻灯片元数据（用于概览视图）
  const slideMetadata = slides.map((slide) => ({
    title: slide.title,
    thumbnail: undefined
  }));

  return (
    <PresentationLayout
      totalSlides={slides.length}
      currentSlide={currentSlide}
      onNavigate={setCurrentSlide}
      slides={slideMetadata}
    >
      {slides[currentSlide] && renderSlide(slides[currentSlide], currentSlide)}
    </PresentationLayout>
  );
}
