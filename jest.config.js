module.exports = {
  testMatch: ["**/test/**/*.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "esbuild-jest",
  },
  testEnvironment: "miniflare",
  moduleNameMapper: {
    __STATIC_CONTENT_MANIFEST: "<rootDir>/src/manifest.ts",
  },
};
