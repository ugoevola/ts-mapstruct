import { HttpException, HttpStatus } from '@nestjs/common'

export class InvalidSourceExceptionMapper extends HttpException {
  private static readonly MESSAGE = `The source "{}" is invalid.`

  constructor(sourceName: string) {
    const message = InvalidSourceExceptionMapper.MESSAGE.replace('{}', sourceName)
    super(message, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
