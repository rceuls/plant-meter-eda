module.exports = {
  plugins: [
      "@typescript-eslint",
      "jest",
  ],
  extends: [
      'airbnb-typescript/base',     
      'plugin:@typescript-eslint/recommended',
      'prettier'
  ],
  env: {
      node: true,
      jest: true
  },
  parserOptions: {
        project: './tsconfig.json',
  },
  rules: {
      "import/no-extraneous-dependencies": false
  }
};