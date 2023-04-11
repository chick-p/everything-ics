module.exports = {
  testMatch: ["**/test/**/*.test.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "esbuild-jest",
  },
  testEnvironment: "miniflare",
  moduleNameMapper: {
    __STATIC_CONTENT_MANIFEST: "<rootDir>/src/test/manifest.ts",
  },
};
