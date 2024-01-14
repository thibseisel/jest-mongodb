import debug from "debug"
import { MongoMemoryServer } from "mongodb-memory-server-core"
import { MongoMemoryServerStates } from "mongodb-memory-server-core/lib/MongoMemoryServer"
import { randomUUID } from "node:crypto"
import { rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { resolve } from "node:path"

const log = debug("jest-mongodb:global")

interface SetupOptions {
  /**
   * Maximum number of specs that may run in parallel.
   */
  parallelCount: number
  /**
   * Version of the MongoDB binary to use.
   */
  version?: string
}

/**
 * Manages a single MongoDB server shared between all test specs.
 * This can safely be used when running multiple test specs in parallel, as
 * a different database name is used by each worker.
 */
class SingleInstanceRunner {
  private readonly configPath = resolve(tmpdir(), ".jest-mongodb-config.json")
  private server: MongoMemoryServer | null = null

  /**
   * Starts the MongoDB server.
   * @param parallelCount Maximum number of specs that may run in parallel.
   */
  async setup(options: SetupOptions): Promise<void> {
    await this.startMongoServer(options.version)
    await this.writeConfigurationFile(options.parallelCount)
  }

  private async writeConfigurationFile(parallelCount: number) {
    const server = this.server
    if (!server) {
      throw new Error("MongoDB server should be running")
    }

    log("Writing config file at %s", this.configPath)
    const mongoUriPerWorker: Record<string, string> = Object.fromEntries(
      Array.from({ length: parallelCount }, (_, index) => [
        index + 1,
        server.getUri(randomUUID()),
      ]),
    )
    await writeFile(
      this.configPath,
      JSON.stringify(mongoUriPerWorker, undefined, 2),
    )
  }

  private async startMongoServer(version?: string) {
    if (!this.server) {
      this.server = new MongoMemoryServer({
        binary: {
          version,
          checkMD5: false,
        },
      })
    }
    if (this.server.state === MongoMemoryServerStates.running) {
      log("MongoDB server is already running.")
    } else {
      log("Starting MongoDB server")
      await this.server.start()
      log("Started MongoDB server on %s", this.server.getUri())
    }
  }

  /**
   * Stops the MongoDB server.
   */
  async teardown(): Promise<void> {
    await this.stopMongoServer()
    await this.deleteWorkersConfig()
  }

  private async stopMongoServer() {
    if (!this.server) {
      log("MongoDB server is already stopped.")
      return
    }
    log("Stopping MongoDB server")
    await this.server.stop()
    this.server = null
    log("Stopped MongoDB server")
  }

  private async deleteWorkersConfig() {
    log("Deleting config file at %s", this.configPath)
    await rm(this.configPath, { force: true })
  }
}

export default new SingleInstanceRunner()
