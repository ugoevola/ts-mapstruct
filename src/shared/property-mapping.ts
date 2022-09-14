import { InvalidSourceExceptionMapper } from '../exceptions/invalid-source.exception'
import { isNil } from 'lodash'
import { BadExpressionExceptionMapper } from '../exceptions/bad-expression.exception'
import { MappingOptions } from '../models/mapping-options'
import { getAllFunctionNames, set, get, setGlobalVariable, detachUnderscore } from './utils'

export const mapProperty = (
  mapperClass: any,
  targetedObject: any,
  sources: Map<string, any>,
  options: MappingOptions
): void => {
  let value = null
  if (!isNil(options.value)) { value = valueFromValue(options) }
  if (!isNil(options.source)) { value = valueFromSource(sources, options) }
  if (!isNil(options.expression)) { value = valueFromExpression(mapperClass, sources, options) }
  set(targetedObject, options.target, value)
}

const valueFromValue = (
  options: MappingOptions
): any => {
  return options.value
}

const valueFromSource = (
  sources: Map<string, any>,
  options: MappingOptions
): any => {
  const [sourceName, sourceProperties] = options.source.split(/\.(.*)/s)
  if (!sources.has(sourceName)) throw new InvalidSourceExceptionMapper(sourceName)
  const source = sources.get(sourceName)
  return isNil(sourceProperties) ? source : sourceProperties.split('.').reduce((pre, value) => get(pre, value), source)
}

const valueFromExpression = (
  mapperClass: any,
  sources: Map<string, any>,
  options: MappingOptions
): any => {
  const functionNames = getAllFunctionNames(options.expression)
  setGlobalsVariables(mapperClass, sources, functionNames)
  try {
    return eval(options.expression)
  } catch (exception) {
    throw new BadExpressionExceptionMapper()
  } finally {
    cleanGlobalsVariables(sources, functionNames)
  }
}

const setGlobalsVariables = (
  mapperClass: any,
  sources: Map<string, any>,
  functionNames: string[]
): void => {
  for (const [key, value] of sources) setGlobalVariable(key, value)
  functionNames.forEach(key => { global[key] = global[key] ?? mapperClass[key] })
}

const cleanGlobalsVariables = (
  sources: Map<string, any>,
  functionNames: string[]
): void => {
  for (const [key] of sources) global[key] = undefined
  functionNames.forEach(key => { if (global.suppliedMappingFunctions.indexOf(key) === -1) setGlobalVariable(key, undefined) })
}

export const fillCommonProperties = (sourceObjects: any[], targetedObject: any): void => {
  if (sourceObjects.length !== 1) return
  Object.entries(sourceObjects[0]).forEach(([propertyName, propertyValue]) => {
    if (propertyName in targetedObject) {
      targetedObject[propertyName] = propertyValue
    }
  })
}
