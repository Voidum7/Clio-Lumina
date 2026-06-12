## 2024-05-24 - Cache Canvas Gradient in StarBackground
**Learning:** Recreating CanvasGradient inside a requestAnimationFrame loop is an expensive operation that runs 60 times per second, causing unnecessary GC pressure and CPU overhead.
**Action:** Cache the gradient object in the component scope or update it only on resize events rather than per frame.
