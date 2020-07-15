module.exports = {
  env: { browser: true },
  extends: [
    '@fuelrats/eslint-config',
    '@fuelrats/eslint-config-react'
  ],
  rules: {
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-parens': ['error', 'as-needed'],
    'indent': ['warn', 'tab'],
    'max-len': ['off'],
    'new-parens': ['error', 'never'],
    'no-useless-escape': ['off'],
    'semi-style': ['off'],

    // jsx-a11y
    'jsx-a11y/control-has-associated-label': ['off'],
    'jsx-a11y/media-has-caption': ['off'],

    // react
    'react/function-component-definition': ['error', {
      namedComponents: 'arrow-function',
      unnamedComponents: 'arrow-function',
    }],
    'react/jsx-curly-newline': ['error', 'never'],
    'react/jsx-indent': ['warn', 'tab'],
    'react/jsx-indent-props': ['warn', 'tab'],
    'react/jsx-no-bind': ['off'],

    // react-hooks
    'react-hooks/exhaustive-deps': ['off'],

    // import
    'import/order': ['off'],
  },
}
