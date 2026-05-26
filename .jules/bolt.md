
## 2024-05-26 - Extract Static ReactMarkdown Components
**Learning:** Defining the `components` prop object inline within a `<ReactMarkdown>` instantiation inside a map loop causes new object references to be created on every render. This forces React to unnecessarily re-render all markdown elements for every chat message, degrading performance as chat history grows.
**Action:** Always extract static configuration objects, such as `react-markdown` custom components, to static variables outside the component body (e.g., `const markdownComponents: Components = { ... }`) to ensure a stable reference across renders.
