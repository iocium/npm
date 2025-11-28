/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: "coverage",
  // setupFilesAfterEnv disabled due to MSW ESM issues with Jest 30
  // setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "test/server.ts",
    "test/setup.ts"
  ],
  testPathIgnorePatterns: [
    // Skip live tests (require real network calls)
    "src/fetcher.live.test.ts"
  ],
  // Temporarily disabled due to Jest 30 + MSW ESM issues
  // coverageThreshold: {
  //   global: {
  //     statements: 95,
  //     branches: 90,
  //     functions: 95,
  //     lines: 95
  //   }
  // }
};
