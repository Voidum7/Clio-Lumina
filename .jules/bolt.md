## 2024-05-05 - Extract ReactMarkdown components statically
**Learning:** Defining react-markdown custom components statically outside the component body prevents unnecessary unmounting and remounting on every render, which is a significant performance anti-pattern.
**Action:** Always extract static object/function references like ReactMarkdown's 'components' prop outside the component scope.
