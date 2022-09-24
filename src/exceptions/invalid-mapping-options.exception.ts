export class InvalidMappingOptionsExceptionMapper extends Error {
  private static readonly MESSAGE = `Invalid mapping options provided for the method {} of the mapper {}: {}`

  constructor(mapperClass: string, methodName: string, error: string) {
    const message = InvalidMappingOptionsExceptionMapper.MESSAGE.replace(
      '{}',
      methodName
    )
      .replace('{}', mapperClass)
      .replace('{}', error)
    super(message)
  }
}
