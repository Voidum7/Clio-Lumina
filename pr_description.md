🧪 Add tests for Terminal component

🎯 **What:** This PR addresses the missing test file for the `Terminal` component.
📊 **Coverage:** The new tests in `components/Terminal.test.tsx` cover the following scenarios:
  - Initial rendering of the boot sequence and its progression.
  - Rendering of the input form after the boot sequence completes.
  - Handling of an incorrect activation code and showing "ACCESS DENIED".
  - Handling of resonance keys and showing "RESONANCE KEY ACCEPTED".
  - Handling of the correct activation code, showing "ACCESS GRANTED", and calling the `onUnlock` callback after a delay.
✨ **Result:** Test coverage is improved, ensuring the core functionality of the `Terminal` component works as expected and preventing regressions during future refactoring.
