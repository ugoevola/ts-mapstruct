import { BadExpressionExceptionMapper } from '../exceptions/bad-expression.exception'
import { InvalidSourceExceptionMapper } from '../exceptions/invalid-source.exception'
import { get, getAllFunctionNames, set, setGlobalVariable } from '../utils/utils'
import { MappingOptions } from '../models/mapping-options'
import { isNil } from 'lodash'
import { ArgumentDescriptor } from 'models/argument-descriptor'

export const getOptionsMapping = (
  optionsList: MappingOptions[]
): Array<[MappingOptions, Function]> => {
  return optionsList.map((options: MappingOptions) => {
    if (!isNil(options.value)) return [options, fnValue]
    if (!isNil(options.source)) return [options, fnSource]
    if (!isNil(options.expression)) return [options, fnExpression]
    return (null)
  })
}

const fnValue = <T> (
  targetedObject: T,
  _mapperClass: any,
  _sourceArgs: ArgumentDescriptor[],
  options: MappingOptions
): void => set(targetedObject, options.target, valueFromValue(options))

const fnSource = <T> (
  targetedObject: T,
  _mapperClass: any,
  sourceArgs: ArgumentDescriptor[],
  options: MappingOptions
): void => set(targetedObject, options.target, valueFromSource(sourceArgs, options))

const fnExpression = <T> (
  targetedObject: T,
  mapperClass: any,
  sourceArgs: ArgumentDescriptor[],
  options: MappingOptions
): void => set(targetedObject, options.target, valueFromExpression(mapperClass, sourceArgs, options))

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
  if (!sourceArgs.some((sourceArg: ArgumentDescriptor) => sourceArg.nameEquals(sourceName))) {
    throw new InvalidSourceExceptionMapper(sourceName)
  }
  const sourceValue = sourceArgs.find((sourceArg: ArgumentDescriptor) => sourceArg.nameEquals(sourceName)).value
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
  sourceArgs.forEach((sourceArg: ArgumentDescriptor) => { global[sourceArg.name] = undefined })
  functionNames.forEach(key => { if (global.suppliedMappingFunctions.indexOf(key) === -1) setGlobalVariable(key, undefined) })
}
