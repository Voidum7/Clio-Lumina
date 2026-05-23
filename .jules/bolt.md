## 2025-05-23 - [ReactMarkdown Static Component References]
**Learning:** Defining the `components` object inline inside `ReactMarkdown` causes a new reference on every render, triggering unnecessary unmounting and remounting of all markdown custom components. Micro-benchmarks show static object references (~14ms for 10M iterations) are much faster than inline recreation (~55ms for 10M iterations).
**Action:** Extract custom `components` object statically outside the render body when using `ReactMarkdown`.
