## 2024-04-14 - [Static ReactMarkdown Components]
**Learning:** Defining `react-markdown` custom components inline within a render function causes unnecessary unmounting and remounting of every element inside the markdown on every single render. This is a significant performance anti-pattern.
**Action:** Always extract static configuration objects, specifically `react-markdown` `components` props, outside the component body.
