## 2024-05-01 - [Extract react-markdown components statically]
**Learning:** Micro-benchmarks show that inline recreation of components prop in ReactMarkdown is a significant performance anti-pattern. Static object/function references are ~50-60x faster than inline recreation.
**Action:** Always define `react-markdown` custom components statically outside the component body.
