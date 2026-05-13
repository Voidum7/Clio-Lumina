## 2024-05-13 - CanvasGradient Re-creation Anti-pattern
**Learning:** Recreating `CanvasGradient` using `ctx.createLinearGradient()` on every frame inside a `requestAnimationFrame` loop is an expensive operation that can cause Garbage Collection (GC) pauses and framerate drops.
**Action:** When working with canvas animations, expensive resources like `CanvasGradient` should be created once (e.g., during initialization or resize) and cached in a variable outside the `requestAnimationFrame` loop, rather than being recreated on every frame.
