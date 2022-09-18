import { isNil } from 'lodash'
import { MAPPING_TARGET, MAPPING_TARGET_TYPE } from '../utils/constants'
import { getArgumentNames } from '../utils/utils'
import { ArgumentDescriptor } from './argument-descriptor'

export class SupplierDescriptor {
  name: string
  args: ArgumentDescriptor[]
  fn: Function

  constructor (name: string, fn: Function, mapperClass: any) {
    this.name = name
    this.fn = fn
    this.args = getArgumentNames(this.fn.toString()).map((argName, index) => {
      const mappingTargetIndex = Reflect.getOwnMetadata(MAPPING_TARGET, mapperClass, this.name)
      const isMappingTarget = !isNil(mappingTargetIndex) && index === mappingTargetIndex
      const type = isMappingTarget ? Reflect.getOwnMetadata(MAPPING_TARGET_TYPE, mapperClass, this.name) : undefined
      return new ArgumentDescriptor(argName, isMappingTarget, type)
    })
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
