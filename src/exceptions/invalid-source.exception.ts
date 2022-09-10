import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidSourceExceptionMapper extends HttpException {
  private static PART1 = 'MapStructException: The source "';
  private static PART2 = '" is invalid. Make sure that the argument name matches, and if it is a deep source, that the source object have the targeted property.';
  constructor(sourceName: string) { 
    const message =
      InvalidSourceExceptionMapper.PART1 +
      sourceName +
      InvalidSourceExceptionMapper.PART2;
    super(message, HttpStatus.INTERNAL_SERVER_ERROR) }
}