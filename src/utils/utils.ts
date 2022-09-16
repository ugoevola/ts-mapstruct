import { InvalidMappingOptionsExceptionMapper } from '../exceptions/invalid-mapping-options.exception'
import { IllegalArgumentNameExceptionMapper } from '../exceptions/illegal-argument-name.exception'
import { InvalidSourceExceptionMapper } from '../exceptions/invalid-source.exception'
import { InvalidTargetExceptionMapper } from '../exceptions/invalid-target.exception'
import { ArgumentDescriptor } from '../models/argument-descriptor'
import { MappingOptions } from '../models/mapping-options'
import { MAPPING_TARGET, MAPPING_TARGET_TYPE } from './constants'
import { ClassConstructor, ClassTransformOptions, plainToClass } from 'class-transformer'
import { validateSync } from 'class-validator'
import { isNil } from 'lodash'

export const set = (object: object, propertyName: string, value: any): any => {
  if (isNil(object) || !(propertyName in object)) { throw new InvalidTargetExceptionMapper(propertyName) }
  object[propertyName] = value
}

export const get = (object: object, propertyName: string): any => {
  if (isNil(object) || !(propertyName in object)) { throw new InvalidSourceExceptionMapper(propertyName) }
  return object[propertyName]
}

export const getAllFunctionNames = (expression: string): string[] => {
  const regex = /([^.\w])?(?!if|for|while|switch|constructor|with)([\w]+) *\(([ \w"'.]+,?)*\)/g
  return [...expression.matchAll(regex)].map(matches => matches[2])
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

// retrieve sources

export const getArgumentNames = (fn: string): string[] => {
  const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
  const ARGUMENT_NAMES = /([^\s,]+)/g
  const fnStr = fn.replace(STRIP_COMMENTS, '')
  let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES)
  return result === null ? [] : result;
}
export const getSourceArguments = (
  mapperClass: any,
  mappingMethodName: string,
  sourceNames: string[],
  sourceValues: any[]
): Array<ArgumentDescriptor> => {
  return sourceValues.map((sourceValue: any, index: number) => {
    const mappingTargetIndex = Reflect.getOwnMetadata(MAPPING_TARGET, mapperClass, mappingMethodName)
    const isMappingTarget = !isNil(mappingTargetIndex) && index === mappingTargetIndex
    const type = isMappingTarget ? Reflect.getOwnMetadata(MAPPING_TARGET_TYPE, mapperClass, mappingMethodName) : undefined
    return new ArgumentDescriptor(sourceNames[index], sourceValue, isMappingTarget, type)
  })
}

// retieve MappingTarget

export const retrieveMappingTarget = (sourceArgs: ArgumentDescriptor[], targetedObject: any): any => {
  const sourceArg = sourceArgs.find(sourceArg => sourceArg.isMappingTarget)
  if (isNil(sourceArg)) return targetedObject
  // TODO: renvoyer une exception dans le cas où le mappingTarget nest pas du bon type
  if (!sameType(sourceArg, targetedObject)) throw new Error()
  return instanciate(targetedObject, sourceArg)
}

// lié à class-tranformer

export const instanciate = (cls: any, plain: any = {}): any => {
  const options = {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
    strategy: 'exposeAll'
  } as ClassTransformOptions
  return plainToClass(cls.constructor as ClassConstructor<any>, plain, options);
}

export const control = (...options: MappingOptions[]): void => {
  options.forEach(option => {
    option = plainToClass(MappingOptions, option)
    if (validateSync(option, { forbidUnknownValues: true }).length > 0) { throw new InvalidMappingOptionsExceptionMapper() }
  })
}
