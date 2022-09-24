import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance
} from 'class-transformer'
import { validateSync } from 'class-validator'
import { isNil } from 'lodash'
import { IllegalArgumentNameExceptionMapper } from '../exceptions/illegal-argument-name.exception'
import { InvalidMappingOptionsExceptionMapper } from '../exceptions/invalid-mapping-options.exception'
import { InvalidMappingTargetExceptionMapper } from '../exceptions/invalid-mapping-target.exception'
import { InvalidSourceExceptionMapper } from '../exceptions/invalid-source.exception'
import { InvalidTargetExceptionMapper } from '../exceptions/invalid-target.exception'
import { ArgumentDescriptor } from '../models/argument-descriptor'
import { MappingOptions } from '../models/mapping-options'

export const set = (object: any, propertyName: string, value: any): any => {
  if (isNil(object) || !(propertyName in object))
    throw new InvalidTargetExceptionMapper(propertyName, object)
  object[propertyName] = value
}

export const get = (object: object, propertyName: string): any => {
  if (isNil(object) || !(propertyName in object))
    throw new InvalidSourceExceptionMapper(propertyName)
  return object[propertyName]
}

export const getAllFunctionNames = (expression: string): string[] => {
  const regex =
    /([^.\w])?(?!if|for|while|switch|constructor|with)([\w]+) *\(([ \w"'.]+,?)*\)/g
  return [...expression.matchAll(regex)].map(matches => matches[2])
}

export const setGlobalVariable = (key: string, value: any): void => {
  const k = detachUnderscore(key)
  if (global.suppliedMappingFunctions.indexOf(k) > -1)
    throw new IllegalArgumentNameExceptionMapper(k)
  global[k] = value
}

export const sameType = (object1: any, object2: any): boolean => {
  return (
    typeof object1 === typeof object2 &&
    (typeof object1 !== 'object' ||
      Object.create(object1).constructor === Object.create(object2).constructor)
  )
}

export const detachUnderscore = (key: string): string => {
  return key?.charAt(0) === '_' ? key.substring(1) : key
}

export const getArgumentNames = (fn: string): string[] => {
  const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm
  const ARGUMENT_NAMES = /([^\s,]+)/g
  const fnStr = fn.replace(STRIP_COMMENTS, '')
  const result = fnStr
    .slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'))
    .match(ARGUMENT_NAMES)
  return result === null ? [] : result
}

export const getSourceArguments = (
  mapperClass: any,
  mappingMethodName: string,
  sourceNames: string[]
): ArgumentDescriptor[] => {
  return sourceNames.map(
    (sourceName, index) =>
      new ArgumentDescriptor(sourceName, mapperClass, mappingMethodName, index)
  )
}

export const retrieveMappingTarget = <T>(
  sourceArgs: ArgumentDescriptor[],
  targetedType: T
): T => {
  const sourceArg = sourceArgs.find(sourceArg => sourceArg.isMappingTarget)
  if (isNil(sourceArg)) return undefined
  if (!sameType(sourceArg.value, targetedType))
    throw new InvalidMappingTargetExceptionMapper()
  return instanciate(targetedType, sourceArg.value)
}

export const instanciate = <T>(cls: T, plain: any = {}): T => {
  const options: ClassTransformOptions = {
    excludeExtraneousValues: true,
    enableImplicitConversion: true
  }
  return plainToInstance(cls.constructor as ClassConstructor<T>, plain, options)
}

export const control = (
  mapperClass: any,
  mappingMethodName: string,
  ...options: MappingOptions[]
): void => {
  options.forEach(option => {
    option = plainToInstance(MappingOptions, option)
    const errors = validateSync(option, { forbidUnknownValues: true })
    if (errors.length > 0)
      throw new InvalidMappingOptionsExceptionMapper(
        mapperClass.constructor.name,
        mappingMethodName,
        errors[0].toString()
      )
  })
}

export const clean = <T>(object: T): T => {
  Object.entries(object).forEach(([key, value]) => {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    if (value === undefined) delete object[key]
    else if (typeof value === 'object') clean(value)
  })
  return object
}
