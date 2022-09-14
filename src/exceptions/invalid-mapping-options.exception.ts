import { HttpException, HttpStatus } from '@nestjs/common'

export class InvalidMappingOptionsExceptionMapper extends HttpException {
  private static readonly MESSAGE = 'MapStructException: bad mapping otpion provided in @Mapping annotation. You must pass at most on of thos several parameters: source, expression, value.'
  constructor () {
    super(InvalidMappingOptionsExceptionMapper.MESSAGE, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
