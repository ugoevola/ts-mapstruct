import { InvalidMappingOptionsExceptionMapper } from '../../src/exceptions/invalid-mapping-options.exception'

describe('InvalidOptionsMapperTest', () => {
  it('test InvalidMappingOptionsExceptionMapper', () => {
    expect(() => require('./invalid-options.mapper')).toThrow(
      InvalidMappingOptionsExceptionMapper
    )
  })

  it('test InvalidMappingOptionsExceptionMapper2', () => {
    expect(() => require('./invalid-options-2.mapper')).toThrow(
      InvalidMappingOptionsExceptionMapper
    )
  })

  it('test InvalidMappingOptionsExceptionMapper3', () => {
    expect(() => require('./invalid-options-3.mapper')).not.toThrow(
      InvalidMappingOptionsExceptionMapper
    )
  })
})
