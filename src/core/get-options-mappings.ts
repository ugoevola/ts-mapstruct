import { BadExpressionExceptionMapper } from '../exceptions/bad-expression.exception'
import { InvalidSourceExceptionMapper } from '../exceptions/invalid-source.exception'
import { get, getAllFunctionNames, set, setGlobalVariable } from '../utils/utils'
import { ArgumentDescriptor } from '../models/argument-descriptor'
import { MappingOptions } from '../models/mapping-options'
import { convert } from '../utils/converter'
import { isArray, isNil } from 'lodash'

export const getOptionsMapping = (
  optionsList: MappingOptions[]
): Array<[MappingOptions, Function]> => {
  return optionsList.map((options: MappingOptions) => {
    if (!isNil(options.source)) return [options, fnSource]
    else if (!isNil(options.expression)) return [options, fnExpression]
    else if (!isNil(options.type)) return [options, fnType]
    return [options, fnValue]
  })
}

const fnValue = <T>(
  targetedObject: T,
  _mapperClass: any,
  _sourceArgs: ArgumentDescriptor[],
  options: MappingOptions
): void => {
  const value = convert(valueFromValue(options), options)
  set(targetedObject, options.target, value)
}

const fnSource = <T>(
  targetedObject: T,
  _mapperClass: any,
  sourceArgs: ArgumentDescriptor[],
  options: MappingOptions
): void => {
  const value = convert(valueFromSource(sourceArgs, options), options)
  set(targetedObject, options.target, value)
}

const fnExpression = <T>(
  targetedObject: T,
  mapperClass: any,
  sourceArgs: ArgumentDescriptor[],
  options: MappingOptions
): void => {
  const value = convert(
    valueFromExpression(mapperClass, sourceArgs, options),
    options
  )
  set(targetedObject, options.target, value)
}

const fnType = <T>(
  targetedObject: T,
  _mapperClass: any,
  _sourceArgs: ArgumentDescriptor[],
  options: MappingOptions
): void => {
  convertTargets(targetedObject, options.target.split('.'), options)
}

const convertTargets = (
  object: any,
  [target, ...rest]: string[],
  options: MappingOptions
): void => {
  const value = object[target]
  if (isNil(value)) return
  else if (rest.length === 0) object[target] = convert(value, options)
  else if (isArray(value)) value.map(value => convertTargets(value, rest, options))
  else convertTargets(value, rest, options)
}

const valueFromValue = (options: MappingOptions): any => {
  return options.value
}

const valueFromSource = (
  sourceArgs: ArgumentDescriptor[],
  options: MappingOptions
): any => {
  const [sourceName, sourceProperties] = options.source.split(/\.(.*)/s)
  if (
    !sourceArgs.some((sourceArg: ArgumentDescriptor) =>
      sourceArg.nameEquals(sourceName)
    )
  )
    throw new InvalidSourceExceptionMapper(sourceName)
  const sourceValue = sourceArgs.find((sourceArg: ArgumentDescriptor) =>
    sourceArg.nameEquals(sourceName)
  ).value
  return isNil(sourceProperties)
    ? sourceValue
    : sourceProperties
        .split('.')
        .reduce((pre, value) => get(pre, value), sourceValue)
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
  sourceArgs.forEach((sourceArg: ArgumentDescriptor) =>
    setGlobalVariable(sourceArg.nameWithoutFirstUnderscore(), sourceArg.value)
  )
  functionNames.forEach(key => {
    global[key] = global[key] ?? mapperClass[key]
  })
}

const cleanGlobalsVariables = (
  sourceArgs: ArgumentDescriptor[],
  functionNames: string[]
): void => {
  sourceArgs.forEach((sourceArg: ArgumentDescriptor) => {
    global[sourceArg.nameWithoutFirstUnderscore()] = undefined
  })
  functionNames.forEach(key => {
    if (global.suppliedMappingFunctions.indexOf(key) === -1)
      setGlobalVariable(key, undefined)
  })
}
