## 2024-06-13 - Static Component Definitions for ReactMarkdown
**Learning:** Defining custom component objects inline within the `ReactMarkdown` render prop (e.g., `components={{ p: ... }}`) creates new functional component references on every render. This forces React to unmount and remount these custom components repeatedly, causing significant performance overhead, especially on long chat histories.
**Action:** Extract the `components` object definition for `ReactMarkdown` outside of the main component render body to maintain stable references. Ensure proper typing by importing `Components` from `react-markdown`.

## 2024-06-13 - Caching CanvasGradient
**Learning:** Creating a new `CanvasGradient` within the `requestAnimationFrame` loop of a canvas animation (like in `StarBackground.tsx`) causes excessive garbage collection and performance degradation as a new object is allocated every ~16ms.
**Action:** Move the gradient creation outside the animation loop, caching it during the `resizeCanvas` or initialization phase, and reusing the same gradient reference during rendering.
