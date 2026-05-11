
## 2024-05-11 - Cache CanvasGradient to prevent per-frame recreation
**Learning:** The application has a background canvas animation where `ctx.createLinearGradient` was previously being called inside the `requestAnimationFrame` loop on every single frame. This is a severe anti-pattern for Canvas animations, as generating complex objects like gradients every frame puts heavy pressure on the garbage collector and consumes significant CPU cycles.
**Action:** When implementing Canvas animations, always create expensive resources (like `CanvasGradient`, complex paths, or offscreen canvas layers) during initialization or resize events and cache them in variables outside the animation loop.
