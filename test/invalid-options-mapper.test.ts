import { InvalidMappingOptionsExceptionMapper } from '../src/exceptions/invalid-mapping-options.exception'

describe('InvalidOptionsMapperTest', () => {
  it('test InvalidMappingOptionsExceptionMapper', () => {
    expect(() => require('./mapper/invalid_options.mapper'))
      .toThrow(InvalidMappingOptionsExceptionMapper)
  })
})
