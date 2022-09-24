export class InvalidMappingOptionsExceptionMapper extends Error {
  private static readonly MESSAGE = `InvalidMappingOptionsExceptionMapper: invalid mapping options
  provided for the method {} of the mapper {}: {}`

  constructor(mapperClass: string, methodName: string, error: string) {
    const message = InvalidMappingOptionsExceptionMapper.MESSAGE.replace(
      '{}',
      mapperClass
    )
      .replace('{}', methodName)
      .replace('{}', error)
    super(message)
  }
}
