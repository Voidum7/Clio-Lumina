## 2024-05-24 - ReactMarkdown Custom Components Optimization
**Learning:** In this environment, defining `react-markdown` custom components inline within the component body creates new function references on every render. This forces React to unmount and remount all markdown nodes, leading to severe performance degradation during rapid updates like streaming text.
**Action:** Always extract the `components` prop for `ReactMarkdown` to a static object outside the component definition to ensure stable references and avoid unnecessary remounting.
