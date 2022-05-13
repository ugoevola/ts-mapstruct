import { HttpException, HttpStatus } from "@nestjs/common";

export class IllegalPropertyValueExceptionMapper extends HttpException{
  static PART1 = 'The value passed for the property ';
  static PART2 = ` is not valid.`
  constructor(propName: string) {
    const message =
      IllegalPropertyValueExceptionMapper.PART1 +
      propName +
      IllegalPropertyValueExceptionMapper.PART2;
    super(message + propName, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}