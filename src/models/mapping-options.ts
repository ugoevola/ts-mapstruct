import { ValidateIf, IsNotEmpty } from 'class-validator';

export class MappingOptions {
  @IsNotEmpty() target: string;
  
  @ValidateIf(o => o.value == undefined && o.expression == undefined)
  source?: string;
  
  @ValidateIf(o => o.source == undefined && o.expression == undefined)
  value?: any;

  @ValidateIf(o => o.source == undefined && o.value == undefined)
  expression?: string
};