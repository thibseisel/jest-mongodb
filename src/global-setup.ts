import type { Config } from "@jest/types"
import runner from "./single-instance-runner"

/**
 * Function to use as Jest's global setup.
 */
export default async function globalSetup(
  globalConfig: Config.GlobalConfig,
): Promise<void> {
  await runner.setup(globalConfig.maxWorkers)
}
