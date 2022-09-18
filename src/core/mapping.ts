import { getArgumentNames, instanciate, getSourceArguments, control, retrieveMappingTarget } from '../utils/utils'
import { SupplierDescriptor } from '../models/supplier-descriptor'
import { getOptionsMapping } from './get-options-mappings'
import { ArgumentDescriptor } from '../models/argument-descriptor'
import { mapImplicitProperties } from './mapping-for-implicit'
import { MappingOptions } from '../models/mapping-options'
import { getBeforeSuppliers } from './get-before-suppliers'
import { getAfterSuppliers } from './get-after-suppliers'

export const mapping = <T> (
  mapperClass: any,
  mappingMethodName: string,
  descriptor: PropertyDescriptor,
  mappingOptions: MappingOptions[]
): void => {
  control(mapperClass, mappingMethodName, ...mappingOptions)
  let targetedObject: T = instanciate(descriptor.value.call())
  const sourceNames: string[] = getArgumentNames(descriptor.value.toString())
  const sourceArgs: ArgumentDescriptor[] = getSourceArguments(mapperClass, mappingMethodName, sourceNames)
  const beforeSuppliers: SupplierDescriptor[] = getBeforeSuppliers(mapperClass, sourceArgs)
  const afterSuppliers: SupplierDescriptor[] = getAfterSuppliers(mapperClass, sourceArgs, targetedObject)
  const optionsMappingFunctions: Array<[MappingOptions, Function]> = getOptionsMapping(mappingOptions)
  mapperClass.constructor.prototype[mappingMethodName] = (...sourceValues: any[]): T => {
    sourceArgs.forEach((arg, index) => { arg.value = sourceValues[index] })
    targetedObject = retrieveMappingTarget(sourceArgs, targetedObject)
    beforeSuppliers.forEach(supplier => {
      supplier.computeArgumentsValue(sourceArgs, targetedObject)
      supplier.fn(...supplier.args.map(arg => arg.value))
    })
    mapImplicitProperties(sourceValues, targetedObject)
    optionsMappingFunctions.forEach(([options, fn]) => {
      fn(targetedObject, mapperClass, sourceArgs, options)
    })
    afterSuppliers.forEach(supplier => {
      supplier.computeArgumentsValue(sourceArgs, targetedObject)
      supplier.fn(...supplier.args.map(arg => arg.value))
    })
    return targetedObject
  }
}
