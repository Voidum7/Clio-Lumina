## 2025-02-20 - [ReactMarkdown Components Re-render]
**Learning:** ReactMarkdown's `components` prop can be a major source of unnecessary re-renders if passed an inline object (e.g. `components={{ p: ... }}`). Because the inline object creates a new reference on every render, React unmounts and remounts all the DOM nodes returned by these custom components, slowing down performance.
**Action:** Always extract static components objects and functions for libraries like `react-markdown` out of the component body to maintain a stable reference across renders.
