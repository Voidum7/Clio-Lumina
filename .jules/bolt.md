## 2024-05-24 - Extracting ReactMarkdown static components
**Learning:** Re-creating the `components` prop object inline on every render of `<ReactMarkdown>` is a significant performance anti-pattern. This causes React to re-mount the inner components unnessarily. Micro-benchmarks indicate static object/function references are substantially faster than inline recreation.
**Action:** Always extract static props like `components` for `ReactMarkdown` outside the component scope, and explicitly type them using the `Components` type from `react-markdown`.
