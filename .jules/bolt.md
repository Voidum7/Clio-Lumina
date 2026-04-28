## 2024-04-28 - Extract Static ReactMarkdown Components
**Learning:** Defining inline custom components (e.g., `components={{ p: () => ... }}`) directly inside `<ReactMarkdown>` causes React to unmount and remount every custom component on every render, because the component reference changes. This causes major performance degradation in a chat interface where many messages are rendered.
**Action:** Always extract static configurations like `react-markdown` components into a static constant defined *outside* the React component, ensuring stable references across renders.
