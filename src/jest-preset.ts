import { resolve } from "node:path"

/**
 * Configures Jest to manage an in-memory MongoDB server while running tests.
 */
export default {
  globalSetup: resolve(__dirname, "setup.js"),
  globalTeardown: resolve(__dirname, "teardown.js"),
  testEnvironment: resolve(__dirname, "environment.js"),
}
