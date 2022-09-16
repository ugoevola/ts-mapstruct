import { FunctionDescriptor } from '../../models/function-descriptor'
import { ArgumentDescriptor } from '../../models/argument-descriptor'
import { AFTER_MAPPING, BEFORE_MAPPING, VALUE } from '../../utils/constants'
import { sameType } from '../../utils/utils'

export const checkForSurroudingMapping = (
  surroundingMappingType: string,
  mapperClass: any,
  sourceArgs: ArgumentDescriptor[],
  targetedObject: any
): void => {
  Reflect.getOwnMetadata(surroundingMappingType, mapperClass)
    ?.map((fnName: string) => new FunctionDescriptor(fnName, Reflect.getOwnMetadata(VALUE, mapperClass, fnName), mapperClass))
    ?.filter((supplier: FunctionDescriptor) => checkForInvocation(surroundingMappingType, supplier.args, sourceArgs, targetedObject))
    ?.map((supplier: FunctionDescriptor) => computeArgumentsValue(supplier, sourceArgs, targetedObject))
    ?.forEach((supplier: FunctionDescriptor) => supplier.fn(...supplier.args.map(supplierArg => supplierArg.value)))
}

const checkForInvocation = (
  surroundingMappingType: string,
  supplierArgs: ArgumentDescriptor[],
  sourceArgsDescriptors: ArgumentDescriptor[],
  targetedObject: any
): boolean => {
  if (surroundingMappingType === BEFORE_MAPPING) return checkForInvocationForBefore(supplierArgs, sourceArgsDescriptors)
  if (surroundingMappingType === AFTER_MAPPING) return checkForInvocationForAfter(supplierArgs, sourceArgsDescriptors, targetedObject)
  return false
}

const checkForInvocationForBefore = (
  supplierArgs: ArgumentDescriptor[],
  sourceArgs: ArgumentDescriptor[]
): boolean => {
  return supplierArgs.filter((supplierArg: ArgumentDescriptor) => !(
      !supplierArg.isMappingTarget && sourceArgs.some(sourceArg => sourceArg.sameNameAs(supplierArg)) ||
      sourceArgs.find(sourceArg => sourceArg.sameNameAs(supplierArg))?.isMappingTarget ))
      .length === 0
}

const checkForInvocationForAfter = (
  supplierArgs: ArgumentDescriptor[],
  sourceArgsDescriptors: ArgumentDescriptor[],
  targetedObject: any
): boolean => {
  return supplierArgs.filter((supplierArg: ArgumentDescriptor) => !(
      !supplierArg.isMappingTarget && sourceArgsDescriptors.some(arg => arg.sameNameAs(supplierArg)) ||
      supplierArg.isMappingTarget && sameType(supplierArg.type, targetedObject)))
      .length === 0
}

const computeArgumentsValue = (
  supplier: FunctionDescriptor,
  sourceArgs: ArgumentDescriptor[],
  targetedObject: any,
): FunctionDescriptor => {
  supplier.args.forEach((supplierArg: ArgumentDescriptor) => {
    if (!supplierArg.isMappingTarget) {
      const value = sourceArgs.find(sourceArg => sourceArg.sameNameAs(supplierArg)).value
      supplierArg.value = value
    } else {
      supplierArg.value = targetedObject
    }
  })
  return supplier
}
