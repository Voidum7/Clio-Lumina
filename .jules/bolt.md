## 2024-05-29 - [Extract ReactMarkdown components statically]
**Learning:** Defining custom `components` inline for `ReactMarkdown` is a performance anti-pattern. It creates new function references on every render, causing React to completely unmount and remount those DOM elements instead of updating them. This leads to high DOM churn and memory usage, particularly noticeable with long chat histories.
**Action:** Always extract custom components to a static object outside the component block. For `react-markdown`, ensure to import and apply the `Components` type to maintain proper typing.
