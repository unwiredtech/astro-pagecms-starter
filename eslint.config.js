import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  { ignores: ['dist/', '.astro/', 'node_modules/', 'graphify-out/', '.tokensave/'] },
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
];
