import { HttpException, HttpStatus } from "@nestjs/common";

export class IllegalMappingOptionsExceptionMapper extends HttpException {
  private static MESSAGE = 'You must provide exactly one of the non required properties in the @Mappings decorator"';
  constructor() { 
    super(IllegalMappingOptionsExceptionMapper.MESSAGE, HttpStatus.INTERNAL_SERVER_ERROR) }
}