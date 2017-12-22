module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: 'airbnb-base',
  env: {
    browser: true
  },
  rules: {
    // FIXME: #TFW-13
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0,
    'import/extensions': 0,
    'func-names': 0,
    'no-underscore-dangle': 0,
  },
};
