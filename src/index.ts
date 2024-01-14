import type { Config } from "@jest/types"
import { resolve } from "node:path"

export * from "./globals"

/**
 * Configures Jest to manage an in-memory MongoDB server while running tests.
 */
const preset: Config.InitialOptions = {
  globalSetup: resolve(__dirname, "./global-setup.js"),
  globalTeardown: resolve(__dirname, "./global-teardown.js"),
  testEnvironment: resolve(__dirname, "./test-environment.js"),
}

export default preset
