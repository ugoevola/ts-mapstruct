export class InvalidMappingOptionsExceptionMapper extends Error {
  constructor (mapperClass: string, methodName: string) {
    super(`MapStructException: invalid mapping otpions provided for the method ${methodName} of the mapper ${mapperClass}.
    You must pass at most one of these parameters: source, expression, value for each option.`)
  }
}
