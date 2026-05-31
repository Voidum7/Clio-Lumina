## 2026-05-31 - Extract static react-markdown components
**Learning:** ReactMarkdown re-renders and remounts all children if the `components` prop is defined inline during render, creating a significant performance hit. Moving the components prop to a static variable outside the component block prevents unnecessary re-rendering and unmounting.
**Action:** Always extract react-markdown custom components statically outside the component body and apply the `Components` type from `react-markdown` to prevent unnecessary unmounting and remounting.
## 2026-05-31 - Expensive CanvasGradient in animation loop
**Learning:** In canvas animations, creating a gradient using `createLinearGradient` and adding color stops on every frame in `requestAnimationFrame` loop is an expensive and unnecessary operation that degrades performance.
**Action:** Always create and cache expensive canvas resources like `CanvasGradient` during initialization or resize events, outside the `requestAnimationFrame` loop.
