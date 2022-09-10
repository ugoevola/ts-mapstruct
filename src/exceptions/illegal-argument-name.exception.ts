import { HttpException, HttpStatus } from "@nestjs/common";

export class IllegalArgumentNameExceptionMapper extends HttpException {
  private static PART1 = 'MapStructException: Illegal property key passing to the expression : "';
  private static PART2 = '". This is a property reserved for supplied mapping functions.';
  constructor(value: string) { 
    const message =
      IllegalArgumentNameExceptionMapper.PART1 +
      value +
      IllegalArgumentNameExceptionMapper.PART2;
    super(message, HttpStatus.INTERNAL_SERVER_ERROR) }
}