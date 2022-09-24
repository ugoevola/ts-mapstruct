import { SupplierDescriptor } from '../models/supplier-descriptor'
import { ArgumentDescriptor } from '../models/argument-descriptor'
import { AFTER_MAPPING, VALUE } from '../utils/constants'
import { sameType } from '../utils/utils'

export const getAfterSuppliers = <T>(
  mapperClass: any,
  sourceArgs: ArgumentDescriptor[],
  targetedObject: T
): SupplierDescriptor[] => {
  return (Reflect.getOwnMetadata(AFTER_MAPPING, mapperClass) || [])
    ?.map(
      (fnName: string) =>
        new SupplierDescriptor(
          fnName,
          Reflect.getOwnMetadata(VALUE, mapperClass, fnName),
          mapperClass
        )
    )
    ?.filter((supplier: SupplierDescriptor) =>
      checkForInvocationForAfter(supplier.args, sourceArgs, targetedObject)
    )
}

const checkForInvocationForAfter = <T>(
  supplierArgs: ArgumentDescriptor[],
  sourceArgs: ArgumentDescriptor[],
  targetedObject: T
): boolean => {
  const result =
    supplierArgs.filter(
      (supplierArg: ArgumentDescriptor) =>
        !(
          (!supplierArg.isMappingTarget &&
            sourceArgs.some(arg => arg.sameNameAs(supplierArg))) ||
          (supplierArg.isMappingTarget &&
            sameType(supplierArg.type.prototype, targetedObject))
        )
    ).length === 0
  return result
}
