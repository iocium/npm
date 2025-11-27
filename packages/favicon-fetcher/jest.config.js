/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: "coverage",
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "test/server.ts",
    "test/setup.ts"
  ],
  coverageThreshold: {
    global: {
      statements: 95,
      branches: 90,
      functions: 95,
      lines: 95
    }
  }  
};
