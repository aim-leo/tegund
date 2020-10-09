module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // add your custom rules here
  rules: {
    // Always require curly brackets.
    curly: 'error',

    // Require the use of `===` and `!==`.
    eqeqeq: 'error',
    // Disallow the use of `eval()`.
    'no-eval': 'error',
    // Every `async` function should have `await`.
    'require-await': 'error',
    // Yoda style, do not do, we, here.
    yoda: 'error',
    // Disallow variable declarations from shadowing variables
    // declared in the outer scope.
    'no-shadow': 'error',
    // Require initialization in variable declaration.
    'init-declarations': ['error', 'always'],
    // Disallow unused variables.
    // "no-unused-vars": "error",
    // Require constructor names to begin with a capital letter.
    'new-cap': [
      'error',
      {
        newIsCap: true,
        capIsNew: false
      }
    ],
    // Require parentheses when invoking a constructor with no
    // arguments.
    'new-parens': 'error',
    // Disallow trailing white space at the end of lines.
    'no-trailing-spaces': 'error',
    // Enforce consistent spacing before and after the arrow in arrow
    // functions.
    'arrow-spacing': 'error',
    // Disallow reassigning `const` variables.
    'no-const-assign': 'error',
    // Disallow unecessary constructors.
    'no-useless-constructor': 'error',
    // Require `let` or `const` instead of `var`.
    'no-var': 'error',
    // Require `const` declaration for variables taht are never
    // reassigned after declared.
    'prefer-const': 'error',
    indent: [2, 2],
    'space-before-function-paren': ['error', 'never'],
    'comma-dangle': [2, 'never']
  }
}
