import { IllegalArgumentNameExceptionMapper } from '../exceptions/illegal-argument-name.exception'
import { isNil } from 'lodash'
import { ArgumentDescriptor } from '../models/argument-descriptor'
import { InvalidSourceExceptionMapper } from '../exceptions/invalid-source.exception'
import { InvalidTargetExceptionMapper } from '../exceptions/invalid-target.exception'

export const set = (object: object, propertyName: string, value: any): any => {
  if (isNil(object) || !(propertyName in object)) { throw new InvalidTargetExceptionMapper(propertyName) }
  object[propertyName] = value
}

export const get = (object: object, propertyName: string): any => {
  if (isNil(object) || !(propertyName in object)) { throw new InvalidSourceExceptionMapper(propertyName) }
  return object[propertyName]
}

export const getArgumentsDescriptors = (fn: string): ArgumentDescriptor[] => {
  const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
  const ARGUMENT_NAMES = /([^\s,]+)/g
  const fnStr = fn.replace(STRIP_COMMENTS, '')
  let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES)
  if (result === null) { result = [] }
  return result.map(argName => new ArgumentDescriptor(argName))
}

export const getAllFunctionNames = (expression: string): string[] => {
  const regex = /([^.\w])?(?!if|for|while|switch|constructor|with)([\w]+) *\(([ \w"'.]+,?)*\)/g
  return [...expression.matchAll(regex)].map(matches => matches[2])
}

export const bindSourceNames = (sources: any[], sourcesNames: string[]): Map<string, any> => {
  return sources.reduce((pre, cur, index) => { pre.set(detachUnderscore(sourcesNames[index]), cur); return pre }, new Map())
}

export const setGlobalVariable = (key: string, value: any): void => {
  const k = detachUnderscore(key)
  if (global.suppliedMappingFunctions.indexOf(k) > -1) { throw new IllegalArgumentNameExceptionMapper(k) }
  global[k] = value
}

export const sameType = (object1: any, object2: any): boolean => {
  return typeof object1 === typeof object2 && (typeof object1 !== 'object' || object1.constructor === object2.constructor)
}

export const detachUnderscore = (key: string): string => {
  return (key?.charAt(0) === '_') ? key.substring(1) : key;
}