import { HttpException, HttpStatus } from '@nestjs/common'

export class BadExpressionExceptionMapper extends HttpException {
  private static readonly MESSAGE =
    'An error occurred during the evalution of the expression'

  constructor() {
    super(BadExpressionExceptionMapper.MESSAGE, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
