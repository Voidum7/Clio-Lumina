## 2024-05-24 - Extracted static objects out of render loop
**Learning:** ReactMarkdown `components` prop causes massive unnecessary re-renders when defined inline within a React functional component.
**Action:** Always extract static configuration objects, components maps, and helper functions completely out of the React component body or wrap them in useMemo.
