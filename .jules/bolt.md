## 2024-05-19 - Canvas Animation Optimization
**Learning:** Canvas operations like `createLinearGradient` are computationally expensive and can cause performance hiccups and high garbage collection pressure when called repeatedly inside a `requestAnimationFrame` loop.
**Action:** Extract expensive object creation from the render loop scope and cache them, updating them only when necessary (like during a resize event).
