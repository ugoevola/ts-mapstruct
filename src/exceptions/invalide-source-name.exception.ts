import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidSourceNameExceptionMapper extends HttpException {
  private static PART1 = 'The source "';
  private static PART2 = '" does not correspond to any argument in the mapping function.';
  constructor(sourceName: string) { 
    const message =
      InvalidSourceNameExceptionMapper.PART1 +
      sourceName +
      InvalidSourceNameExceptionMapper.PART2;
    super(message, HttpStatus.INTERNAL_SERVER_ERROR) }
}