import React from 'react';
import ReactMarkdown from 'react-markdown';

// Define components statically to prevent re-creation on every render
const markdownComponents = {
  p: ({node, ...props}: any) => <p className="mb-4 last:mb-0 leading-relaxed text-purple-50/90" {...props} />,
  strong: ({node, ...props}: any) => <strong className="font-bold text-purple-200 drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]" {...props} />,
  em: ({node, ...props}: any) => <em className="italic text-amber-100/80 font-serif tracking-wide" {...props} />,
  h1: ({node, ...props}: any) => <h1 className="text-2xl font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-amber-100 mb-4 mt-6 border-b border-purple-500/30 pb-2" {...props} />,
  h2: ({node, ...props}: any) => <h2 className="text-xl font-cinzel text-purple-200 mb-3 mt-5" {...props} />,
  h3: ({node, ...props}: any) => <h3 className="text-lg font-cinzel text-purple-300 mb-2 mt-4" {...props} />,
  code: ({node, className, ...props}: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const isInline = !match && !String(props.children).includes('\n');
    return isInline
      ? <code className="font-mono text-xs bg-purple-900/30 px-1.5 py-0.5 rounded text-green-300 border border-green-500/20" {...props} />
      : <code className="block font-mono text-xs text-green-300" {...props} />
  },
  pre: ({node, ...props}: any) => <pre className="font-mono text-xs bg-black/60 p-4 rounded-lg overflow-x-auto mb-4 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)] backdrop-blur-sm" {...props} />,
  blockquote: ({node, ...props}: any) => <blockquote className="border-l-2 border-amber-500/50 pl-4 italic text-slate-400 my-4 bg-amber-500/5 py-2 pr-2 rounded-r" {...props} />,
  ul: ({node, ...props}: any) => <ul className="list-disc pl-5 mb-4 space-y-1 text-purple-100/80" {...props} />,
  ol: ({node, ...props}: any) => <ol className="list-decimal pl-5 mb-4 space-y-1 text-purple-100/80" {...props} />,
  a: ({node, ...props}: any) => <a className="text-cyan-300 hover:text-cyan-100 underline underline-offset-2 decoration-cyan-500/50 hover:decoration-cyan-300 transition-colors" {...props} />,
};

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown components={markdownComponents}>
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
