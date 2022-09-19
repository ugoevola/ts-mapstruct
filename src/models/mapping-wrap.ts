import { MappingOptions } from './mapping-options'

export type MappingWrap = {
  mapperClass: any
  mappingMethodName: string
  descriptor: PropertyDescriptor
  mappingOptions: MappingOptions[]
}
