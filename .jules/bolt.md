## 2026-04-26 - Extract static object/function references for components
**Learning:** Micro-benchmarks show that inline object/function recreation in React renders (especially for ReactMarkdown components) forces unnecessary unmounting and remounting, severely impacting performance for long lists. Static references are ~50-60x faster than inline recreation.
**Action:** Always extract static props like ReactMarkdown's 'components' object outside the component body to prevent recreating them on every render.
