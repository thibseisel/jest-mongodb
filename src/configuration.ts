import { readFile } from "node:fs/promises"
import { join } from "node:path"

/**
 * Configuration of this package, as specified in the caller's package.json.
 */
export interface JestMongoConfig {
  /**
   * Version of the MongoDB binary to use.
   */
  version?: string
}

/**
 * Reads package configuration from package.json.
 * @param rootDir Path to the running project's root directory.
 * @returns Configuration, as specified in package.json.
 */
export async function getConfig(
  rootDir: string,
): Promise<JestMongoConfig | undefined> {
  const packageJsonPath = join(rootDir, "package.json")
  const definition = await readFile(packageJsonPath, "utf-8").then(
    (content) => JSON.parse(content) as PackageDefinition,
  )
  return definition["@tseisel/jest-mongodb"]
}

interface PackageDefinition {
  "@tseisel/jest-mongodb"?: JestMongoConfig
}
