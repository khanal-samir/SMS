import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { config as baseConfig } from './base.js'

/**
 * NestJS / Node.js ESLint configuration with type-checked TypeScript rules.
 * @param {string} tsconfigRootDir - Absolute path to the directory containing tsconfig.json
 * @returns {import("typescript-eslint").ConfigArray}
 */
export const nestJsConfig = (tsconfigRootDir) =>
  tseslint.config(
    ...baseConfig,
    ...tseslint.configs.recommendedTypeChecked,
    eslintPluginPrettierRecommended,
    {
      languageOptions: {
        globals: { ...globals.node, ...globals.jest },
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
    },
    {
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-floating-promises': 'warn',
        '@typescript-eslint/no-unsafe-argument': 'warn',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
      },
    },
    {
      ignores: ['dist/**'],
    },
  )
