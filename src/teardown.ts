import { rm } from "node:fs/promises"

export default async function globalTeardown(): Promise<void> {
  await stopMongoInstances()
  await deleteWorkersConfig()
}

async function stopMongoInstances(): Promise<void> {
  const instances = globalThis.__MONGO_INSTANCES__
  await Promise.all(instances.map((instance) => instance.stop()))
}

async function deleteWorkersConfig() {
  const configFile: string = globalThis.__WORKER_CONFIG_FILE__
  await rm(configFile)
}
