import antfu from '@antfu/eslint-config'
import tailwind from 'eslint-plugin-tailwindcss'

export default antfu(
  {
    formatters: true,
    react: true,
    ignores: [
      'src/api/types.ts',
      'src/**/*.gen.ts',
    ],
    plugins: [],
  },
  ...tailwind.configs['flat/recommended'],
)
