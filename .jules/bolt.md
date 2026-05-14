
## 2024-05-18 - ReactMarkdown Components Creation Anti-Pattern
**Learning:** Defining inline components for `react-markdown` inside the component body is an egregious performance anti-pattern. React considers the components new on every render, causing the DOM structure to completely unmount and remount.
**Action:** Always define `react-markdown` custom components in a static `Components` object outside the parent render loop to avoid remounting.
