import { HttpException, HttpStatus } from "@nestjs/common";

export class EmptySourceNameExceptionMapper extends HttpException {
  private static MESSAGE = 'Be careful to specify the source for each property when there are several sources.';
  constructor() { super(EmptySourceNameExceptionMapper.MESSAGE, HttpStatus.INTERNAL_SERVER_ERROR) }
}