import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '@/styles/code-display.css';

interface CodeSlideProps {
  title: string;
  code: string;
  language?: string;
  theme?: 'vs-dark' | 'github' | 'monokai';
  explanation?: string;
  highlights?: number[];
}

export function CodeSlide({
  title,
  code,
  language = 'python',
  theme = 'vs-dark',
  explanation,
  highlights = []
}: CodeSlideProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full bg-slate-900 text-white p-4 sm:p-8 md:p-12 lg:p-16 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 md:mb-8"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          {title}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-4 md:gap-6 lg:gap-8 h-auto lg:h-[calc(100%-120px)]">
        {/* Code Block */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
            <span className="text-xs text-slate-400 uppercase tracking-wider">
              {language}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          <div className="rounded-xl md:rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <SyntaxHighlighter
              language={language}
              style={vscDarkPlus}
              showLineNumbers={true}
              wrapLines={true}
              lineProps={(lineNumber) => ({
                style: {
                  backgroundColor: highlights.includes(lineNumber) ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  borderLeft: highlights.includes(lineNumber) ? '4px solid rgb(59, 130, 246)' : 'none',
                  paddingLeft: highlights.includes(lineNumber) ? '12px' : '0',
                  display: 'block',
                  fontSize: '36px !important'
                }
              })}
              codeTagProps={{
                style: {
                  fontSize: '36px',
                  fontWeight: '500',
                  lineHeight: '2.2'
                }
              }}
              customStyle={{
                margin: 0,
                padding: '40px',
                fontSize: '36px',
                lineHeight: '2.2',
                background: '#0f172a',
                fontWeight: '500'
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </motion.div>

        {/* Explanation */}
        {explanation && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-8 border border-blue-500/20 overflow-auto"
          >
            <h3 className="text-2xl font-bold mb-4 text-blue-400">Explanation</h3>
            <div className="text-lg text-slate-300 leading-relaxed space-y-4">
              {explanation}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
