
## 2024-06-08 - Canvas Animation Performance Optimization
**Learning:** Creating complex Canvas objects like `CanvasGradient` inside `requestAnimationFrame` creates significant garbage collection overhead and can lead to inconsistent frame rates or micro-stutters.
**Action:** Always cache expensive canvas resources (like gradients, paths, or offscreen canvases) outside the render loop (e.g., in a `useEffect` closure or updated via an event like `resize`) instead of recreating them on every frame.
