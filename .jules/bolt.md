## 2025-03-08 - Extract ReactMarkdown components to static object
**Learning:** Defining the `components` object inline in `ReactMarkdown` causes an anti-pattern performance issue in this codebase, forcing unmounting and remounting on every render, which is expensive.
**Action:** Always define `react-markdown` custom components statically outside the component body (with the `Components` type explicitly imported from `react-markdown`) to prevent unnecessary unmounting and remounting on every render.
