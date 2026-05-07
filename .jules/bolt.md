## 2024-05-19 - Extracted ReactMarkdown custom components
**Learning:** ReactMarkdown in `App.tsx` recreates its `components` object on every render. Micro-benchmarks indicate static object/function references are substantially faster than inline recreation, and memory guidelines explicitly suggest defining them statically outside the component block.
**Action:** Always define `react-markdown` custom components statically outside the component block, and explicitly import and apply the `Components` type from `react-markdown` to ensure proper typing and avoid using `any`.
