import { HttpException, HttpStatus } from '@nestjs/common'

export class InvalidSourceExceptionMapper extends HttpException {
  private static readonly MESSAGE = `InvalidSourceExceptionMapper: The source "{}" is invalid.
  Make sure that the argument name matches, and if it is a deep source,
  that the source object have the targeted property.`
  constructor (sourceName: string) {
    const message = InvalidSourceExceptionMapper.MESSAGE.replace('{}', sourceName)
    super(message, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
