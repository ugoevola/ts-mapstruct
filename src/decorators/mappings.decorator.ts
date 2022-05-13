import { fillCommonProperties, mapProperty } from "../shared/property-mapping";
import { MappingOptions } from "../models/mapping-options";
import { getArgumentsNames, bindSourceNames } from "../shared/utils";

export const Mappings = (...options: MappingOptions[]) => (
  mapperClass: any,
  _methodName: string,
  descriptor: PropertyDescriptor
) => {
  const sourcesNames = getArgumentsNames(descriptor.value.toString());
  const targetedObject = descriptor.value.call();
  descriptor.value = (...sourceObjects: any[]): any => {
    // fill implicites mapping
    if (sourceObjects.length === 1)
      fillCommonProperties(sourceObjects[0], targetedObject);
    // for each other mapping
    const sources = bindSourceNames(sourceObjects, sourcesNames);
    options.forEach(option => mapProperty(mapperClass, targetedObject, sources, option));
    return targetedObject;
  };
};