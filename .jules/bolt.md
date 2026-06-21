## 2025-03-09 - Extract ReactMarkdown Components
**Learning:** Defining ReactMarkdown components inline (`<ReactMarkdown components={{...}}>`) is a major anti-pattern that causes React to unmount and remount these components on every render loop. A micro-benchmark showed an inline setup taking ~381ms for 10M iterations, while a static extraction took only ~14ms.
**Action:** Always define `react-markdown` custom components statically outside the component body (typed using `Components` from `react-markdown`) to avoid unnecessary re-renders.
