import { describe, test, expect } from 'vitest'
import { init } from '../../src/index.js'

describe('public api', () => {
  test('init should be a function', () => {
    expect(init).toBeInstanceOf(Function)
  })
})
