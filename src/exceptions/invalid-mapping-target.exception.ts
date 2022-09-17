import { HttpException, HttpStatus } from '@nestjs/common'

export class InvalidMappingTargetExceptionMapper extends HttpException {
  private static readonly MESSAGE = 'MapStructException: The provided mapping target object does not have the expected returned type.'
  constructor () {
    super(InvalidMappingTargetExceptionMapper.MESSAGE, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
