## 2024-05-24 - Extract static props for list rendering
**Learning:** Defining the `components` prop for `ReactMarkdown` inline within a mapped list of messages causes new function references on every render, triggering full unmounts/remounts of all markdown nodes.
**Action:** Always define static config objects like ReactMarkdown `components` outside the component body to preserve reference equality across renders.
