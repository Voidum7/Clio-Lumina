## 2024-06-15 - ReactMarkdown components prop optimization
**Learning:** Inline object definitions for the `components` prop in ReactMarkdown force unnecessary unmounting/remounting of elements on every render loop, causing significant performance overhead in this environment.
**Action:** Always extract the ReactMarkdown `components` object definition to a statically typed constant (using `Components` from `react-markdown`) outside the React component body to enable proper memoization.
