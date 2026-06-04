## 2024-06-04 - [React Markdown Optimization]
**Learning:** Inline component mapping objects like `components={{...}}` in libraries such as `react-markdown` cause serious performance issues due to recreating functions on every render cycle, leading to unnecessary unmounting and remounting. Micro-benchmarks show ~14ms vs ~55ms improvement for static references.
**Action:** Always extract static props (especially objects with function properties like React components) outside of the React component body to preserve memory addresses across renders.
