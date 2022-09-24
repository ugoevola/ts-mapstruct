import { ArgumentDescriptor } from '../models/argument-descriptor'
import { SupplierDescriptor } from '../models/supplier-descriptor'
import { BEFORE_MAPPING, VALUE } from '../utils/constants'

export const getBeforeSuppliers = (
  mapperClass: any,
  sourceArgs: ArgumentDescriptor[]
): SupplierDescriptor[] => {
  return (Reflect.getOwnMetadata(BEFORE_MAPPING, mapperClass) || [])
    ?.map(
      (fnName: string) =>
        new SupplierDescriptor(
          fnName,
          Reflect.getOwnMetadata(VALUE, mapperClass, fnName),
          mapperClass
        )
    )
    ?.filter((supplier: SupplierDescriptor) =>
      checkForInvocationForBefore(supplier.args, sourceArgs)
    )
}

const checkForInvocationForBefore = (
  supplierArgs: ArgumentDescriptor[],
  sourceArgs: ArgumentDescriptor[]
): boolean => {
  return (
    supplierArgs.filter(
      (supplierArg: ArgumentDescriptor) =>
        !(
          (!supplierArg.isMappingTarget &&
            sourceArgs.some(sourceArg => sourceArg.sameNameAs(supplierArg))) ||
          sourceArgs.find(sourceArg => sourceArg.sameNameAs(supplierArg))
            ?.isMappingTarget
        )
    ).length === 0
  )
}
