## 2024-05-15 - Extract ReactMarkdown components
**Learning:** Defining react-markdown custom components statically outside the component body prevents unnecessary unmounting and remounting on every render, which is a significant performance anti-pattern.
**Action:** Extract static props like ReactMarkdown's 'components' and type it using `Components` from `react-markdown`.
