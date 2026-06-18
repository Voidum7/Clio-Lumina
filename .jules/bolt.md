## 2024-06-18 - Canvas Gradient Allocation in requestAnimationFrame
**Learning:** In Canvas animations, expensive resources like `CanvasGradient` should be created once and cached (e.g., during initialization or resize) rather than being recreated on every frame inside the `requestAnimationFrame` loop, as it negatively impacts performance.
**Action:** Move gradient creation outside of the animate loop to be created on initialization and on resize events.
