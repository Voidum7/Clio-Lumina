## 2024-05-18 - Cache CanvasGradient for requestAnimationFrame
**Learning:** In Canvas animations, recreating expensive objects like `CanvasGradient` on every frame inside `requestAnimationFrame` creates unnecessary GC (Garbage Collection) churn and CPU overhead, especially since the gradient only changes when the canvas is resized.
**Action:** Always extract and cache expensive Canvas resources (like gradients, static images, or patterns) during initialization or inside the resize handler, avoiding recreating them in the main render loop.
