import { HttpException, HttpStatus } from '@nestjs/common'

export class IllegalArgumentNameExceptionMapper extends HttpException {
  private static readonly MESSAGE = `Illegal property key passing to the expression : "{}". This is a property reserved for supplied mapping functions.`

  constructor(value: string) {
    const message = IllegalArgumentNameExceptionMapper.MESSAGE.replace('{}', value)
    super(message, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
