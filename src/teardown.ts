import debug from "debug"
import { rm } from "node:fs/promises"

const log = debug("jest-mongodb:teardown")

export default async function globalTeardown(): Promise<void> {
  await stopMongoInstances()
  await deleteWorkersConfig()
}

async function stopMongoInstances(): Promise<void> {
  const instances = globalThis.__MONGO_INSTANCES__
  log("Stopping %d MongoDB instances", instances.length)
  await Promise.all(instances.map((instance) => instance.stop()))
  log("Stopped %d MongoDB instances", instances.length)
}

async function deleteWorkersConfig() {
  const configFile: string = globalThis.__WORKER_CONFIG_FILE__
  log("Deleting config file at %s", configFile)
  await rm(configFile, { force: true })
}
