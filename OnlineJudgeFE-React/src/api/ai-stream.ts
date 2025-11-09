/**
 * AI流式输出API
 * 使用SSE（Server-Sent Events）实现实时流式响应
 */

interface StreamMessage {
  type: 'chunk' | 'done' | 'error';
  content?: string;
  full_content?: string;
}

interface StreamOptions {
  course_id: number;
  message: string;
  conversation?: any[];
  onChunk?: (chunk: string) => void;
  onDone?: (fullContent: string) => void;
  onError?: (error: string) => void;
}

/**
 * AI对话流式输出
 * @param options 流式配置
 */
export async function aiChatStream(options: StreamOptions): Promise<void> {
  const { course_id, message, conversation = [], onChunk, onDone, onError } = options;
  
  try {
    const response = await fetch('/api/classroom/ai/chat/stream/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        course_id,
        message,
        conversation,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      onError?.(errorData.error || '流式请求失败');
      return;
    }
    
    if (!response.body) {
      onError?.('响应体为空');
      return;
    }
    
    // 读取流式数据
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      // 解码数据
      buffer += decoder.decode(value, { stream: true });
      
      // 处理SSE格式的数据（data: {...}\n\n）
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || ''; // 保留不完整的行
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const jsonStr = line.substring(6); // 移除 "data: "
            const data: StreamMessage = JSON.parse(jsonStr);
            
            if (data.type === 'chunk' && data.content) {
              onChunk?.(data.content);
            } else if (data.type === 'done' && data.full_content) {
              onDone?.(data.full_content);
            } else if (data.type === 'error' && data.content) {
              onError?.(data.content);
            }
          } catch (parseError) {
            console.error('解析SSE数据失败:', parseError, line);
          }
        }
      }
    }
  } catch (error: any) {
    console.error('SSE流式输出错误:', error);
    onError?.(error.message || '流式输出失败');
  }
}

/**
 * AI课件生成流式输出（待实现）
 */
export async function aiGenerateStream(options: StreamOptions): Promise<void> {
  // TODO: 类似实现
}

