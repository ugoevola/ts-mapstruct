import { IsOptional, IsString } from "class-validator";
import { RelatedWith } from "../validators/related-with";

export class MappingOptions {
  @IsString()
  target: string;

  @IsString()
  @IsOptional()
  @RelatedWith(['value', 'expression'])
  source?: string;
  
  @IsOptional()
  @RelatedWith(['source', 'expression'])
  value?: any;

  @IsString()
  @IsOptional()
  @RelatedWith(['source', 'value'])
  expression?: string
};