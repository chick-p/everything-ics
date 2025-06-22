// eslint-disable-next-line no-undef
module.exports = {
  testMatch: ["**/test/**/*.test.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "@swc/jest",
  },
  testEnvironment: "miniflare",
  moduleNameMapper: {
    __STATIC_CONTENT_MANIFEST: "<rootDir>/src/test/manifest.ts",
  },
};
