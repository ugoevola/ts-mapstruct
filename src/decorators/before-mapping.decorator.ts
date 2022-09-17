import { BEFORE_MAPPING, VALUE } from '../utils/constants'

export const BeforeMapping = () => (
  mapperClass: any,
  methodName: string,
  descriptor: PropertyDescriptor
) => {
  const existingBeforeMappingFn = Reflect.getOwnMetadata(BEFORE_MAPPING, mapperClass) || []
  existingBeforeMappingFn.push(methodName)
  Reflect.defineMetadata(BEFORE_MAPPING, existingBeforeMappingFn, mapperClass)
  Reflect.defineMetadata(VALUE, descriptor.value, mapperClass, methodName)
}
