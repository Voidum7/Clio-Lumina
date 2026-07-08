## 2024-07-08 - Extract static ReactMarkdown components
**Learning:** Defining the `components` object inline in `ReactMarkdown` causes significant performance degradation due to unnecessary remounts of its children on every render.
**Action:** Always define `react-markdown` custom components statically outside the component body to prevent unnecessary unmounting and remounting on every render.
