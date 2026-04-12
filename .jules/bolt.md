## 2024-05-18 - Typescript Compilation with Duplicate Files
**Learning:** The project has duplicated files between the root directory and the components/ and services/ directories (e.g. App.tsx, PersonaMenu.tsx, geminiService.ts). This causes npx tsc to fail with module resolution errors on the duplicates, but pnpm run build with Vite will still succeed.
**Action:** Rely on pnpm run build to verify the build, or configure tsc to ignore the duplicates/run tsc only on specific files if strict type checking is needed.
