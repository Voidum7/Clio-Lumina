
## 2024-05-18 - Caching CanvasGradient in requestAnimationFrame
**Learning:** In React components that manage Canvas animations via `useEffect`, creating a `CanvasGradient` (or similar complex objects like paths/images) inside the `requestAnimationFrame` loop is a significant performance anti-pattern. It forces the browser to create and garbage collect these objects ~60 times a second, leading to micro-stutters and increased CPU usage.
**Action:** Always extract and cache expensive Canvas resources (like gradients) outside the animation loop. Initialize them once during component mount or inside event listeners like window resize where dimensions are calculated.
