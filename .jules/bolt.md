## 2024-06-19 - Canvas Gradient Optimization
**Learning:** Recreating `CanvasGradient` inside `requestAnimationFrame` loop in `StarBackground.tsx` is an anti-pattern that consumes unnecessary CPU cycles on every frame, since the gradient only depends on canvas height which changes only on resize.
**Action:** Always cache expensive canvas resources (like gradients) outside the animation loop, updating them only when dependent dimensions (like window resize) change.
