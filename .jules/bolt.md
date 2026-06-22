## 2024-05-20 - Inline ReactMarkdown components prop causes unnecessary unmounting
**Learning:** Defining the `components` object inline in `ReactMarkdown` causes React to re-create the object on every render. Because the reference changes, `react-markdown` unmounts and remounts all markdown nodes. Micro-benchmarks show this is significantly slower (~381ms vs ~14ms for 10M iterations).
**Action:** Always extract the `components` prop definition statically outside the React component body and explicitly use the `Components` type from `react-markdown`.
