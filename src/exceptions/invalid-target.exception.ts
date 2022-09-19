import { HttpException, HttpStatus } from '@nestjs/common'

export class InvalidTargetExceptionMapper extends HttpException {
  private static readonly MESSAGE = 'InvalidTargetExceptionMapper: The target "{}" does not exist on type "{}".'
  constructor (sourceName: string, object: any) {
    const message = InvalidTargetExceptionMapper.MESSAGE
      .replace('{}', sourceName)
      .replace('{}', object)
    super(message, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
