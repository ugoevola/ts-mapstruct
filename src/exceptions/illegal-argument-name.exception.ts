import { HttpException, HttpStatus } from '@nestjs/common'

export class IllegalArgumentNameExceptionMapper extends HttpException {
  private static readonly PART1 = 'IllegalArgumentNameExceptionMapper: Illegal property key passing to the expression : "'
  private static readonly PART2 = '". This is a property reserved for supplied mapping functions.'
  constructor (value: string) {
    const message =
      IllegalArgumentNameExceptionMapper.PART1 +
      value +
      IllegalArgumentNameExceptionMapper.PART2
    super(message, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
