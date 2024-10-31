module.exports = {
  transform: {
    '^.+\\.m?js$': 'babel-jest', // Usa babel-jest para transformar archivos .js y .mjs
  },
  testEnvironment: 'node', // Usa el entorno de Node.js para las pruebas
};
