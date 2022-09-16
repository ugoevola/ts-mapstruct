import { BadExpressionExceptionMapper } from "../../exceptions/bad-expression.exception"
import { InvalidSourceExceptionMapper } from "../../exceptions/invalid-source.exception"
import { get, getAllFunctionNames, set, setGlobalVariable } from "../../utils/utils"
import { MappingOptions } from "../../models/mapping-options"
import { isNil } from "lodash"
import { ArgumentDescriptor } from "models/argument-descriptor"


export const mapProperty = (
  mapperClass: any,
  targetedObject: any,
  sourceArgs: ArgumentDescriptor[],
  options: MappingOptions
): void => {
  let value = null
  if (!isNil(options.value)) { value = valueFromValue(options) }
  if (!isNil(options.source)) { value = valueFromSource(sourceArgs, options) }
  if (!isNil(options.expression)) { value = valueFromExpression(mapperClass, sourceArgs, options) }
  set(targetedObject, options.target, value)
}

const valueFromValue = (
  options: MappingOptions
): any => {
  return options.value
}

const valueFromSource = (
  sourceArgs: ArgumentDescriptor[],
  options: MappingOptions
): any => {
  const [sourceName, sourceProperties] = options.source.split(/\.(.*)/s)
  const sourceArg = sourceArgs.find((sourceArg: ArgumentDescriptor) => sourceArg.name === sourceName)
  if (!sourceArg)
    throw new InvalidSourceExceptionMapper(sourceName)
  const sourceValue = sourceArg.value
  return isNil(sourceProperties) ? sourceValue : sourceProperties.split('.').reduce((pre, value) => get(pre, value), sourceValue)
}

const valueFromExpression = (
  mapperClass: any,
  sourceArgs: ArgumentDescriptor[],
  options: MappingOptions
): any => {
  const functionNames = getAllFunctionNames(options.expression)
  setGlobalsVariables(mapperClass, sourceArgs, functionNames)
  try {
    return eval(options.expression)
  } catch (exception) {
    throw new BadExpressionExceptionMapper()
  } finally {
    cleanGlobalsVariables(sourceArgs, functionNames)
  }
}

const setGlobalsVariables = (
  mapperClass: any,
  sourceArgs: ArgumentDescriptor[],
  functionNames: string[]
): void => {
  sourceArgs.forEach((sourceArg: ArgumentDescriptor) => setGlobalVariable(sourceArg.name, sourceArg.value))
  functionNames.forEach(key => { global[key] = global[key] ?? mapperClass[key] })
}

const cleanGlobalsVariables = (
  sourceArgs: ArgumentDescriptor[],
  functionNames: string[]
): void => {
  sourceArgs.forEach((sourceArg: ArgumentDescriptor) => global[sourceArg.name] = undefined)
  functionNames.forEach(key => { if (global.suppliedMappingFunctions.indexOf(key) === -1) setGlobalVariable(key, undefined) })
}
