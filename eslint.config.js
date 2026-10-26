// @ts-check
import { fixupPluginRules } from "@eslint/compat";
import js from "@eslint/js";
import eslintReact from "@eslint-react/eslint-plugin";
import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginRouter from "@tanstack/eslint-plugin-router";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import boundaries from "eslint-plugin-boundaries";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

// jsx-a11y doesn't declare ESLint 10 support yet; fixupPluginRules shims removed context APIs.
const jsxA11yStrict = {
  ...jsxA11y.flatConfigs.strict,
  plugins: { "jsx-a11y": fixupPluginRules(jsxA11y) },
};

export default defineConfig([
  globalIgnores(["dist", "coverage", ".tanstack", "src/routeTree.gen.ts"]),

  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [
      eslintReact.configs["recommended-type-checked"],
      reactHooks.configs.flat["recommended-latest"],
      reactRefresh.configs.vite,
      jsxA11yStrict,
      pluginQuery.configs["flat/recommended"],
      pluginRouter.configs["flat/recommended"],
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // eslint-plugin-react-hooks is the source of truth for hooks + React Compiler rules;
      // turn off @eslint-react's re-implementations so each issue is reported once.
      "@eslint-react/rules-of-hooks": "off",
      "@eslint-react/exhaustive-deps": "off",
      "@eslint-react/error-boundaries": "off",
      "@eslint-react/purity": "off",
      "@eslint-react/set-state-in-effect": "off",
      "@eslint-react/set-state-in-render": "off",
      "@eslint-react/static-components": "off",
      "@eslint-react/unsupported-syntax": "off",
      "@eslint-react/use-memo": "off",
    },
  },

  {
    files: ["*.{js,ts}"],
    languageOptions: {
      globals: globals.node,
    },
  },

  {
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },

  // Module boundaries — see docs/adr/0007-module-boundaries.md
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      "import/resolver": {
        typescript: { project: "./tsconfig.app.json" },
      },
      "boundaries/elements": [
        { type: "app", pattern: "src/routes" },
        {
          type: "feature",
          pattern: "src/features/*",
          capture: ["featureName"],
        },
        { type: "ui", pattern: "src/components/ui" },
        { type: "components", pattern: "src/components" },
        { type: "hooks", pattern: "src/hooks" },
        { type: "lib", pattern: "src/lib" },
      ],
      // main.tsx is the composition root and may import anything.
      "boundaries/ignore": ["src/main.tsx", "src/routeTree.gen.ts"],
    },
    rules: {
      "boundaries/no-unknown-files": "error",
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          policies: [
            {
              from: { element: { type: "app" } },
              allow: {
                to: {
                  element: {
                    types: {
                      anyOf: [
                        "app",
                        "feature",
                        "components",
                        "ui",
                        "hooks",
                        "lib",
                      ],
                    },
                  },
                },
              },
            },
            {
              from: { element: { type: "feature" } },
              allow: [
                {
                  to: {
                    element: {
                      type: "feature",
                      captured: {
                        featureName: "{{ from.element.captured.featureName }}",
                      },
                    },
                  },
                },
                {
                  to: {
                    element: {
                      types: { anyOf: ["components", "ui", "hooks", "lib"] },
                    },
                  },
                },
              ],
            },
            {
              from: { element: { type: "components" } },
              allow: {
                to: {
                  element: {
                    types: { anyOf: ["components", "ui", "hooks", "lib"] },
                  },
                },
              },
            },
            {
              from: { element: { type: "ui" } },
              allow: {
                to: { element: { types: { anyOf: ["ui", "lib"] } } },
              },
            },
            {
              from: { element: { type: "hooks" } },
              allow: {
                to: { element: { types: { anyOf: ["hooks", "lib"] } } },
              },
            },
            {
              from: { element: { type: "lib" } },
              allow: { to: { element: { type: "lib" } } },
            },
          ],
        },
      ],
    },
  },

  {
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true },
      ],
      // TanStack Router's beforeLoad/loader throw redirect() and notFound() by design.
      "@typescript-eslint/only-throw-error": [
        "error",
        {
          allow: [
            {
              from: "package",
              package: "@tanstack/router-core",
              name: ["Redirect", "NotFoundError"],
            },
          ],
        },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },

  // shadcn components export variants next to components; route files export `Route`.
  {
    files: ["src/components/ui/**", "src/routes/**"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },

  {
    files: ["**/*.js"],
    extends: [tseslint.configs.disableTypeChecked],
  },

  eslintConfigPrettier,
]);
