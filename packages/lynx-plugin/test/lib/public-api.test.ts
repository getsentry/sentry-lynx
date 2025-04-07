import { describe, test, expect } from 'vitest'
import { pluginSentryLynx } from '../../src/index.js'

describe('public api', () => {
  test('pluginSentryLynx should be a function', () => {
    expect(pluginSentryLynx).toBeInstanceOf(Function)
  })
})
