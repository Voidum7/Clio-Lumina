## 2024-05-24 - Cache CanvasGradient in animations
**Learning:** In Canvas animations, expensive resources like CanvasGradient should be created once (e.g., during initialization or resize) and cached within the scope (e.g., inside useEffect but outside requestAnimationFrame loop), rather than being recreated on every frame.
**Action:** Declare CanvasGradient variable outside the animation loop, assign it on initialization/resize, and reuse it inside the render loop.
