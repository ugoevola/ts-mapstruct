import { getArgumentNames } from '../utils/utils'
import { ArgumentDescriptor } from './argument-descriptor'

export class SupplierDescriptor {
  name: string
  args: ArgumentDescriptor[]
  fn: Function

  constructor (name: string, fn: Function, mapperClass: any) {
    this.name = name
    this.fn = fn
    this.args = getArgumentNames(this.fn.toString())
      .map((argName, index) => new ArgumentDescriptor(argName, mapperClass, this.name, index))
  }

  computeArgumentsValue = <T> (
    sourceArgs: ArgumentDescriptor[],
    targetedObject: T
  ): void => {
    this.args.forEach((supplierArg: ArgumentDescriptor) => {
      if (!supplierArg.isMappingTarget) {
        const value = sourceArgs.find(sourceArg => sourceArg.sameNameAs(supplierArg)).value
        supplierArg.value = value
      } else {
        supplierArg.value = targetedObject
      }
    })
  }
}
