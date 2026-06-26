## 2024-10-24 - CanvasGradient Allocation in requestAnimationFrame
**Learning:** In Canvas animations, expensive resources like CanvasGradient should be created once (e.g., during initialization or resize) and cached within the scope (e.g., inside useEffect but outside requestAnimationFrame loop), rather than being recreated on every frame.
**Action:** Always extract and cache gradient/pattern definitions outside of the render loop (requestAnimationFrame) to prevent excessive memory churn and performance degradation.
