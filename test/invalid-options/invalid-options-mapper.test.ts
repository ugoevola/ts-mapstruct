import { InvalidMappingOptionsExceptionMapper } from '../../src/exceptions/invalid-mapping-options.exception'

describe('InvalidOptionsMapperTest', () => {
  it('test InvalidMappingOptionsExceptionMapper', () => {
    expect(() => require('./invalid-options.mapper'))
      .toThrow(InvalidMappingOptionsExceptionMapper)
  })
})
