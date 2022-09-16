import { MappingOptions } from '../models/mapping-options'
import { getArgumentNames, instanciate } from '../utils/utils'
import { mapping } from '../core/mappings/mappings'

export const Mappings = (...options: MappingOptions[]) => (
  mapperClass: any,
  mappingMethodName: string,
  descriptor: PropertyDescriptor
) => {
  const sourceNames = getArgumentNames(descriptor.value.toString())
  let targetedObject = instanciate(descriptor.value.call())
  descriptor.value = (...sourceValues: any[]): any => {
    return mapping(mapperClass, mappingMethodName, sourceNames, sourceValues, options, targetedObject)
  }
}
