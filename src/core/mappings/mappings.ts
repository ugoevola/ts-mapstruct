import { ArgumentDescriptor } from "models/argument-descriptor"
import { MappingOptions } from "../../.."
import { checkForSurroudingMapping } from "../surrounding-mapping/check-for-surrounding-mapping"
import { AFTER_MAPPING, BEFORE_MAPPING } from "../../utils/constants"
import { control, getSourceArguments, retrieveMappingTarget } from "../../utils/utils"
import { mapProperty } from "./mapping-from-options"
import { mapImplicitProperties } from "./mapping-for-implicit"

export const mapping = (
  mapperClass: any,
  mappingMethodName: string,
  sourceNames: string[],
  sourceValues: any[],
  mappingOptions: MappingOptions[],
  targetedObject: any
) => {
  control(...mappingOptions)
  const sourceArgs: ArgumentDescriptor[] = getSourceArguments(mapperClass, mappingMethodName, sourceNames, sourceValues)
  targetedObject = retrieveMappingTarget(sourceArgs, targetedObject)
  checkForSurroudingMapping(BEFORE_MAPPING, mapperClass, sourceArgs, targetedObject)
  mapImplicitProperties(sourceValues, targetedObject)
  mappingOptions.forEach(option => mapProperty(mapperClass, targetedObject, sourceArgs, option))
  checkForSurroudingMapping(AFTER_MAPPING, mapperClass, sourceArgs, targetedObject)
  return targetedObject
}