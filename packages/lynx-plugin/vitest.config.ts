import { defineProject } from 'vitest/config'
import type { UserWorkspaceConfig } from 'vitest/config'

const config: UserWorkspaceConfig = defineProject({
  test: {
    name: '@sentry/lynx-plugin',
  },
})

export default config
