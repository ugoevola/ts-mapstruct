import { fillCommonProperties, mapProperty } from "../shared/property-mapping";
import { MappingOptions } from "../models/mapping-options";
import { getArgumentsDescriptors, bindSourceNames, sameType } from "../shared/utils";
import { apply } from "../shared/apply";
import { AFTER_MAPPING, BEFORE_MAPPING, MAPPING_TARGET } from "../models/constants";
import { ClassConstructor, plainToClass } from 'class-transformer';
import { isNil } from "lodash";
import { validateSync } from "class-validator";
import { InvalidMappingOptionsExceptionMapper } from "../exceptions/invalid-mapping-options.exception";

export const Mappings = (...options: MappingOptions[]) => (
  mapperClass: any,
  methodName: string,
  descriptor: PropertyDescriptor
) => {
  const sourceArgsDescriptors = getArgumentsDescriptors(descriptor.value.toString());
  let targetedObject = plainToClass(
    Reflect.getPrototypeOf(descriptor.value.call()).constructor as ClassConstructor<any>,
    {},
    { excludeExtraneousValues: true, enableImplicitConversion: true, strategy: 'exposeAll' });
  descriptor.value = (...sourceObjects: any[]): any => {
    // mappingOptions validation
    validateMappingOptions(...options)
    // retrieve mappingTarget
    targetedObject = retrieveMappingTarget(mapperClass, methodName, sourceObjects, targetedObject);
    // beforeMapping
    apply(BEFORE_MAPPING, mapperClass, sourceArgsDescriptors, sourceObjects, targetedObject, methodName);
    // fill implicites mapping
    fillCommonProperties(sourceObjects, targetedObject);
    // for each other mapping
    const sources = bindSourceNames(sourceObjects, sourceArgsDescriptors.map(arg => arg.name));
    options.forEach(option => mapProperty(mapperClass, targetedObject, sources, option));
    // afterMapping
    apply(AFTER_MAPPING, mapperClass, sourceArgsDescriptors, sourceObjects, targetedObject, methodName);
    return targetedObject;
  };
};

const retrieveMappingTarget = (consumer: any, property: string, args: any[], targetedObject: any) => {
  let index = Reflect.getOwnMetadata(MAPPING_TARGET, consumer, property)
  if (isNil(index)) return targetedObject
  if (!sameType(args[index], targetedObject)) throw new Error()
  return plainToClass(
    targetedObject.constructor as ClassConstructor<any>,
    args[index],
    { excludeExtraneousValues: true, enableImplicitConversion: true, strategy: 'exposeAll' });
}

const validateMappingOptions = (...options: MappingOptions[]): void => {
  options.forEach(option => {
    option = plainToClass(MappingOptions, option);
    if (validateSync(option, { forbidUnknownValues: true }).length > 0)
      throw new InvalidMappingOptionsExceptionMapper()
  })
}