import { HttpException, HttpStatus } from '@nestjs/common'

export class InvalidTargetExceptionMapper extends HttpException {
  private static readonly PART1 = 'MapStructException: The target "'
  private static readonly PART2 = '" does not correspond to any property of the targeted type.'
  constructor (sourceName: string) {
    const message =
      InvalidTargetExceptionMapper.PART1 +
      sourceName +
      InvalidTargetExceptionMapper.PART2
    super(message, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
