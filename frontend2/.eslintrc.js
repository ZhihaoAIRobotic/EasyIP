module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    'import/order': [
      'error',
      {
        groups: ['type', 'external', 'internal'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
}
