## 2024-06-11 - Static ReactMarkdown components
**Learning:** Defining custom component maps for `ReactMarkdown` inline inside the render cycle causes a new object to be created on every render, leading to unnecessary unmounting and remounting of all markdown elements. This adds significant React reconciliation overhead.
**Action:** Always extract the `components` map to a static variable outside the component block when defining custom rendering rules for `react-markdown`.
