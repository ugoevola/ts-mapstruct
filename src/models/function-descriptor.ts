import { getArgumentsDescriptors } from "../shared/utils";
import { ArgumentDescriptor } from "./argument-descriptor";

export class FunctionDescriptor {
  name: string;
  argumentsDescriptors: ArgumentDescriptor[];
  argumentsValues: any[];
  fn: Function;

  constructor(name: string, fn: Function) {
    this.name = name;
    this.fn = fn;
    this.argumentsDescriptors = getArgumentsDescriptors(fn.toString())
  }
}
