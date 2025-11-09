import { ReactNode } from 'react';

interface FigmaContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * 精确复刻8080的.figma-container样式
 * 带响应式max-width断点
 * 
 * 断点:
 * - < 640px: 100%
 * - 640px+: 640px
 * - 768px+: 768px
 * - 1024px+: 1024px
 * - 1280px+: 1280px
 * - 1536px+: 1536px
 */
export function FigmaContainer({ children, className = '' }: FigmaContainerProps) {
  return (
    <div 
      className={`max-w-[640px] sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px] 2xl:max-w-[1536px] mx-auto ${className}`}
      style={{
        width: '100%',
        padding: '0 24px', // px-6 = 1.5rem
      }}
    >
      {children}
    </div>
  );
}

