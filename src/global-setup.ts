import type { Config } from "@jest/types"
import { getConfig } from "./configuration"
import runner from "./single-instance-runner"

/**
 * Function to use as Jest's global setup.
 */
export default async function globalSetup(
  globalConfig: Config.GlobalConfig,
): Promise<void> {
  const config = await getConfig(globalConfig.rootDir)
  await runner.setup({
    parallelCount: globalConfig.maxWorkers,
    version: config?.version,
  })
}
