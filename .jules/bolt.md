## 2024-XX-XX - [Title]
**Learning:** [Insight]
**Action:** [How to apply next time]

## 2024-XX-XX - [Extract Static Properties in React Components]
**Learning:** Supplying inline object definitions to libraries like `ReactMarkdown` (e.g., `<ReactMarkdown components={{ p: ... }} />`) causes React to treat every DOM element as a brand new component on every render, leading to full unmounting/remounting of the node instead of reconciliation, causing severe performance degradation.
**Action:** Always extract static objects (especially component maps like `components` prop in ReactMarkdown) to module-level constants or memoize them to preserve reference stability across renders.
