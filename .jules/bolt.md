
## 2024-05-18 - Extracted ReactMarkdown Components Mapping
**Learning:** ReactMarkdown recreates its inline `components` map object and every associated inline function (e.g., `p: ({node, ...props}) => ...`) on every single component render when passed inline. This is a massive performance anti-pattern in React that forces unnecessary unmounting and remounting of all markdown elements on every chat message update, drastically slowing down render times for large text blocks and creating severe garbage collection overhead.
**Action:** Always extract static mapping objects and config objects out of React components (into global/module scope) when they do not depend on component state or props, to maintain referential equality across renders.
