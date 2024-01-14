import runner from "./single-instance-runner"

/**
 * Function to use as Jest global teardown.
 */
export default async function globalTeardown(): Promise<void> {
  await runner.teardown()
}
