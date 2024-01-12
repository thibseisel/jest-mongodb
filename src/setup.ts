import type { Config } from "@jest/types"
import { MongoMemoryServer } from "mongodb-memory-server"
import { writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

export default async function globalSetup(
  globalConfig: Config.GlobalConfig,
): Promise<void> {
  const instances = await Promise.all(
    Array.from({ length: globalConfig.maxWorkers }, async () => {
      return MongoMemoryServer.create({
        binary: {
          version: "4.4.1",
          checkMD5: false,
        },
      })
    }),
  )

  const configFile = join(tmpdir(), ".jest-mongodb-config.json")
  await writeWorkersConfig(configFile, instances)

  globalThis.__MONGO_INSTANCES__ = instances
  globalThis.__WORKER_CONFIG_FILE__ = configFile
}

async function writeWorkersConfig(
  filepath: string,
  instances: ReadonlyArray<MongoMemoryServer>,
): Promise<void> {
  const mongoUriPerWorker: Record<string, string> = Object.fromEntries(
    instances.map((instance, index) => [index + 1, instance.getUri()]),
  )
  await writeFile(filepath, JSON.stringify(mongoUriPerWorker, undefined, 2))
}
