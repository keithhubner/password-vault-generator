import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      // Warn rather than fail for findings that are new with this config, not
      // regressions: `next lint` only linted app/, components/ and lib/, so
      // hooks/, utils/ and tailwind.config.ts were never checked, and
      // set-state-in-effect arrived with eslint-plugin-react-hooks 7. Promote
      // these to errors once the existing hits are fixed.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
