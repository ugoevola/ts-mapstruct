import { HttpException, HttpStatus } from "@nestjs/common";

export class IllegalPropertyKeyExceptionMapper extends HttpException {
  private static PART1 = 'Illegal property key passing to the expression : "';
  private static PART2 = '". This is a property reserved for supplied mapping functions.';
  constructor(value: string) { 
    const message =
      IllegalPropertyKeyExceptionMapper.PART1 +
      value +
      IllegalPropertyKeyExceptionMapper.PART2;
    super(message, HttpStatus.INTERNAL_SERVER_ERROR) }
}