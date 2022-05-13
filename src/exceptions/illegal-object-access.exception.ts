import { HttpException, HttpStatus } from "@nestjs/common";

export class IllegalObjectAccessExceptionMapper extends HttpException {
  private static PART1 = 'Illegal access to the object "';
  private static PART2 = '" for setting value ';
  constructor(object: object, value: string) { 
    const message =
      IllegalObjectAccessExceptionMapper.PART1 +
      object.constructor.name +
      IllegalObjectAccessExceptionMapper.PART2 +
      value;
    super(message, HttpStatus.INTERNAL_SERVER_ERROR) }
}