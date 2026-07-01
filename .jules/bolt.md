
## 2024-05-18 - Prevent ReactMarkdown Component Remounting
**Learning:** Defining inline component mapping objects (like the `components` prop in `react-markdown`) inside the React render function causes the object reference to change on every render. This forces `react-markdown` to completely unmount and remount all custom components, severely degrading chat performance, especially with long message histories. Micro-benchmarks confirmed recreating a large object on every render takes ~15ms per 1M iterations vs ~2ms for a static reference.
**Action:** Always extract static object definitions (like `components` mapping for markdown or similar config objects) outside of the React component body to preserve reference equality.
