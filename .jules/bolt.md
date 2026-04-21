## 2024-05-24 - [Extract Static Markdown Components]
**Learning:** Micro-benchmarks in this environment demonstrate that static object/function references are ~50-60x faster than inline recreation (33ms vs 1.8s for 10M iterations). Inline `components` object in `ReactMarkdown` causes unmounting and remounting on every render, severely impacting performance for long chats.
**Action:** Always define `react-markdown` custom components statically outside the component body.
