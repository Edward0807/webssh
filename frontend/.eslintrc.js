module.exports = {
    root: true,
    env: {
      node: true,
      browser: true,
      es6: true
    },
    parserOptions: {
      parser: 'babel-eslint',
      sourceType: 'module'
    },
    extends: [
      'plugin:vue/essential',
      'eslint:recommended'
    ],
    globals: {
      ELEMENT: 'readonly',
      axios: 'readonly',
      Vue: 'readonly',
      Vuex: 'readonly',
      VueI18n: 'readonly'
    },
    rules: {
      'no-console': 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    }
}
