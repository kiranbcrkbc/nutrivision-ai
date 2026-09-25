import tsParser from '@typescript-eslint/parser';
export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { parser: tsParser, parserOptions: { ecmaVersion: 2022, sourceType: 'module', ecmaFeatures: { jsx: true } } },
    rules: {
      'no-unreachable': 'error',
      'no-constant-condition': 'error',
      'no-debugger': 'error',
      'no-dupe-else-if': 'error',
      'no-unsafe-finally': 'error',
      'constructor-super': 'error'
    }
  }
];
