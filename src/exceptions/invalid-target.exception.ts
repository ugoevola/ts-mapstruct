import { HttpException, HttpStatus } from '@nestjs/common'

export class InvalidTargetExceptionMapper extends HttpException {
  private static readonly MESSAGE = `The target "{}" does not exist on type "{}".`

  constructor(target: string, object: any) {
    const message = InvalidTargetExceptionMapper.MESSAGE.replace(
      '{}',
      target
    ).replace('{}', object)
    super(message, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
