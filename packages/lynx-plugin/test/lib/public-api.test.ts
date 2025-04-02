import { describe, test, expect } from 'vitest'
import { sentryWebpackPlugin } from '../../src/index.js'

describe('public api', () => {
  test('sentryWebpackPlugin should be a function', () => {
    expect(sentryWebpackPlugin).toBeInstanceOf(Function)
  })
})
