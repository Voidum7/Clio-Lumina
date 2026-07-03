
## 2024-07-03 - Extract Static ReactMarkdown Components
**Learning:** In React applications using `react-markdown` (especially inside mapped arrays like chat history), defining the `components` mapping object inline causes React to treat every sub-component as new on every render. This forces full unmounting and remounting of all markdown elements, heavily degrading performance.
**Action:** Always extract static configuration objects, such as `react-markdown`'s `components` prop, outside the React component body or memoize them securely.
