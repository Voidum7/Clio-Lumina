## 2026-05-04 - [⚡ Bolt: Extract static ReactMarkdown components]
**Learning:** Defining `react-markdown` custom components inline within the component body creates a new `components` object on every render. This forces React to unnecessarily unmount and remount every single Markdown element on every state update, destroying performance (especially when dealing with a constantly updating chat interface).
**Action:** Always define `react-markdown` custom components statically outside the component block, and explicitly type them as `Components` from `react-markdown`.
