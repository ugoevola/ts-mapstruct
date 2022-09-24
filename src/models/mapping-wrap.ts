import { MappingOptions } from './mapping-options'

export interface MappingWrap {
  mapperClass: any
  mappingMethodName: string
  descriptor: PropertyDescriptor
  mappingOptions: MappingOptions[]
}
