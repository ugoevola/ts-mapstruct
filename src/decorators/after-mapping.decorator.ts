import { AFTER_MAPPING, VALUE } from "../models/constants";

export const AfterMapping = () => (
  mapperClass: any,
  methodName: string,
  descriptor: PropertyDescriptor
) => {
  let existingBeforeMappingFn = Reflect.getOwnMetadata(AFTER_MAPPING, mapperClass) || [];
  existingBeforeMappingFn.push(methodName);
  Reflect.defineMetadata(AFTER_MAPPING, existingBeforeMappingFn, mapperClass);
  Reflect.defineMetadata(VALUE, descriptor.value, mapperClass, methodName);
};