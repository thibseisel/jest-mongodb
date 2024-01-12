import { EnvironmentContext, JestEnvironmentConfig } from "@jest/environment"
import { TestEnvironment as NodeEnvironment } from "jest-environment-node"
import { readFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

export default class MongoEnvironment extends NodeEnvironment {
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context)
  }

  override async setup(): Promise<void> {
    await super.setup()
    const workerId = this._getCurrentWorkerId()
    this.global.__MONGO_URI__ = await this._getDatabaseUri(workerId)
  }

  override async teardown(): Promise<void> {
    this.global.__MONGO_URI__ = undefined
    await super.teardown()
  }

  private _getCurrentWorkerId(): string {
    const workerId = process.env.JEST_WORKER_ID
    if (!workerId) {
      throw Error('Environment variable "JEST_WORKER_ID" should be defined')
    }
    return workerId
  }

  private async _getDatabaseUri(workerId: string): Promise<string> {
    const configFile = join(tmpdir(), ".jest-mongodb-config.json")
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const config: Record<string, string> = JSON.parse(
      await readFile(configFile, "utf8"),
    )
    const workerConfig = config[workerId]
    if (!workerConfig) {
      throw Error(`Expected a mongodb config for worker ${workerId}`)
    }
    return workerConfig
  }
}
