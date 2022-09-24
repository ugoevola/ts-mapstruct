import { MappingOptions } from '../models/mapping-options'
import { MAPPINGS_METHOD } from '../utils/constants'
import { MappingWrap } from '../models/mapping-wrap'

export const Mappings =
  (...mappingOptions: MappingOptions[]) =>
  (mapperClass: any, mappingMethodName: string, descriptor: PropertyDescriptor) => {
    const existingMappingMethods =
      Reflect.getOwnMetadata(MAPPINGS_METHOD, mapperClass.constructor) || []
    const mappingWrap: MappingWrap = {
      mapperClass,
      mappingMethodName,
      descriptor,
      mappingOptions
    }
    existingMappingMethods.push(mappingWrap)
    Reflect.defineMetadata(
      MAPPINGS_METHOD,
      existingMappingMethods,
      mapperClass.constructor
    )
  }
