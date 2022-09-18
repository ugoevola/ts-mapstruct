import { MappingOptions } from './mapping-options'

export class MappingWrap {
  mapperClass: any
  mappingMethodName: string
  descriptor: PropertyDescriptor
  mappingOptions: MappingOptions[]
}
