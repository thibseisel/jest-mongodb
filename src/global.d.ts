import type { MongoMemoryServer } from "mongodb-memory-server"

/* eslint-disable no-var */
declare global {
  var __MONGO_INSTANCES__: ReadonlyArray<MongoMemoryServer>
  var __WORKER_CONFIG_FILE__: string
}
