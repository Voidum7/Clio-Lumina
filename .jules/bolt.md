## 2024-04-20 - [Cache CanvasGradient]
**Learning:** `CanvasGradient` creation and configuration is an expensive operation in 2D canvas `requestAnimationFrame` loops.
**Action:** Always create `CanvasGradient` once (e.g. during resize or initialization) and cache it outside the animation loop, rather than recreating it on every frame.
