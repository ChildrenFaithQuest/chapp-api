const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.*\\.(test|spec|e2e\\.test)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: ['src/**/*.(t|j)s', '!dist/**', '!**/migrations/**'],
  coverageReporters: ['json-summary', 'json', 'lcov', 'text', 'clover'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
};
